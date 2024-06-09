<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import upperLabelPurch from '../upperLabels/upperLabelPurch.vue';
import DatePickerLabelPurch from '../labels/DatePickerLabelPurchHeader.vue';
import CreatePurchaseDialog from '@/views/purchases/components/dialogs/CreatePurchaseDialog.vue';
import { curFormatter } from '../../helpers/currencyFormatter';
import useUserInfo from '../../store/user';
import PurchtableColumnsSetup from '../custom/purch_table_filters/PurchtableColumnsSetup.vue';
import { getAllData } from '@/api/purchaseCommons';
import { getFavouriteTypes } from '@/api/favoriteTablePurchases';
import { useRouter, useRoute } from 'vue-router';
import useActiveTable from '@/store/purchases_store/activeTable';
import { getCurrencySignName } from '@/helpers/currencySign';
import TableAmountModule from '../custom/TableAmountModule.vue';
import ScreenParams from '@/store/screen';
import DropdownArrow from '../icons/DropdownArrow.vue';
import usePurchasesInfo from '@/store/purchases_store/purchases';

const props = defineProps<{
  top_data: {
    summ: string | number;
    aux_summ: string | number;
    purch_count: string | number;
    activatedTotalPrice: string | number;
    activatedTotalUSD: string | number;
  };
  hard_update: string;
  name?: string;
  query?: any;
}>();
const hdTaskId = ref<string | null>(null);
const favouriteTypes = ref<{ id: number; name: string }[] | null>(null);
const activeLabel = ref('purchase');
const isSelectedFormat = ref<string | number | null>(null);
const toggleCreateDialogPurchase = ref(false);
const router = useRouter();
const route = useRoute();
const showAmount = ref(false);
onMounted(async () => {
  const queryParams = router.currentRoute.value.query;
  activeLabel.value =
    router.currentRoute.value.name !== 'payments' && props.query?.table_type
      ? props.query.table_type
      : router.currentRoute.value.name === 'payments'
        ? 'payments'
        : 'purchase';

  if (props.query?.table_type) {
    emit('select-table', activeLabel.value);
    useActiveTable.setActiveTable(activeLabel.value);
  }
  await getAllData();

  useActiveTable.setActiveTable(activeLabel.value);
  await getFavouriteTypes().then((res) => (favouriteTypes.value = res.data));
  if (queryParams['to_task_id']) {
    hdTaskId.value = queryParams['to_task_id'] as string;
    router.replace({
      query: {
        ...route.query,
        to_task_id: undefined
      }
    });
  }
  activeLabel.value = props.query
    ? props.query.table_type
    : props.name !== 'payments'
      ? 'purchase'
      : 'payments';
});

const emit = defineEmits<{
  (e: 'select-table', value: any): void;
}>();

watch(
  () => props.hard_update,
  async () => {
    await getFavouriteTypes().then((res) => (favouriteTypes.value = res.data));
  }
);
 
watch(
  () => usePurchasesInfo.selectedNewPurchase.value,
  (value) => {
    if (value) {
      toggleCreateDialogPurchase.value = true;
    }
  }
);

watch(
  () => activeLabel.value,
  async () => {
    emit('select-table', activeLabel.value);
    useActiveTable.setActiveTable(activeLabel.value);

    if (activeLabel.value === 'favourite') {
      await getFavouriteTypes().then((res) => (favouriteTypes.value = res.data));
    }
  }
);

watch(
  () => hdTaskId.value,
  (value) => {
    if (value) {
      toggleCreateDialogPurchase.value = true;
    }
  }
);
const showOptions = ref(false);
</script>

<template>
  <div
    @click="showOptions ? (showOptions = !showOptions) : null"
    class="purchheader_div_all"
    :style="{
      marginLeft: name !== 'payments' ? '-30px' : ''
    }"
  >
    <div v-if="name !== 'payments'" class="headerpurch_div_upper_flex">
      <div @click="() => (activeLabel = 'purchase')" class="headerpurch_div_upper_bg">
        <upperLabelPurch
          :name="'purchase'"
          :positions="[
            { id: 0, name: $t('unreceived') },
            { id: 1, name: $t('without closing') }
          ]"
          :active="activeLabel === 'purchase' ? true : false"
        >
          <template #title>
            <div class="purch_header_purch_div_top">
              <span style="font-size: 23px">{{ $t('purchases') }}</span
              ><button
                v-if="useUserInfo.userData.value?.permissions?.create_purchase"
                :disabled="activeLabel !== 'purchase'"
                @click="toggleCreateDialogPurchase = true"
                :class="
                  activeLabel === 'purchase'
                    ? 'purch_header_button_plus_active'
                    : 'purch_header_button_plus'
                "
              >
                +
              </button>
            </div></template
          >
        </upperLabelPurch>
        <div v-if="activeLabel === 'purchase'" class="purch_header_hr_container_active">
          <div class="purch_header_hr_active_purch"></div>
        </div>
      </div>
      <div @click="() => (activeLabel = 'position')" class="headerpurch_div_upper_bg">
        <upperLabelPurch
          :name="'positions'"
          :positions="[{ id: -1, name: $t('in stock') }]"
          :active="activeLabel === 'position' ? true : false"
        >
          <template #title
            ><span style="font-size: 23px">{{ $t('items') }}</span></template
          >
        </upperLabelPurch>
        <div v-if="activeLabel === 'position'" class="purch_header_hr_container_active_position">
          <div class="purch_header_hr_active_position"></div>
        </div>
      </div>
      <div @click="() => (activeLabel = 'favourite')" class="headerpurch_div_upper_bg">
        <upperLabelPurch
          name="favourite"
          :positions="favouriteTypes ? favouriteTypes : [{ id: 0, name: '' }]"
          :active="activeLabel === 'favourite' ? true : false"
        >
          <template #title>
            <img
              v-if="activeLabel === 'favourite'"
              style="max-width: 25px; min-height: 30px"
              src="../icons/starWhite.svg"
              :alt="$t('favorite')"
            />
            <img
              v-else
              style="max-width: 25px; min-height: 30px"
              src="../icons/star.svg"
              :alt="$t('favorite')"
            />
          </template>
        </upperLabelPurch>
        <div v-if="activeLabel === 'favourite'" class="purch_header_hr_container_active_favourite">
          <div class="purch_header_hr_active_favourite"></div>
        </div>
      </div>
    </div>
    <div
      class="headerpurch_div_right-group"
      :class="name === 'payments' ? 'headerpurch_div_right-group_payments' : ''"
    >
      <TableAmountModule
        :top_data="top_data"
        :name="name"
        class="headerpurch_table_amount"
        v-if="ScreenParams.screenParams.width > 850"
        :table-type="activeLabel"
      />
      <div v-else-if="showAmount" class="headerpurch_table_amount_container">
        <TableAmountModule :top_data="top_data" :name="name" :table-type="activeLabel" />
      </div>
      <div class="headerpurch_div_datepicker">
        <div class="headerpurch_div_datepicker_container">
          <DatePickerLabelPurch
            @format_change="(val) => (isSelectedFormat = val)"
            :table_type="activeLabel"
            :query="query ? query : null"
          />
        </div>
        <div v-if="ScreenParams.screenParams.width < 850">
          <div @click="(e) => e.stopPropagation()" class="headerpurch_div_table_setup">
            <button
              class="headerpurch_button_open_options"
              @click="
                (e) => {
                  e.stopPropagation();
                  showOptions = !showOptions;
                }
              "
            >
              {{ $t('options') }}
              <DropdownArrow
                style="transition: all 0.4s; margin-left: 10px"
                :style="showOptions ? { rotate: '0deg' } : { rotate: '180deg' }"
              />
            </button>
            <div class="headerpurch_div_show_options" v-if="showOptions">
              <button
                v-if="name !== 'payments'"
                class="headerpurch_button_show_amount"
                @click="showAmount = !showAmount"
              >
                {{ showAmount ? $t('hide') : $t('show_2') }} {{ $t('amounts') }}
              </button>
              <PurchtableColumnsSetup :table_type="activeLabel" />
            </div>
          </div>
        </div>
        <div
          :style="
            ScreenParams.screenParams.width < 850
              ? { width: '0px', height: '0px', overflow: 'hidden' }
              : ''
          "
          class="headerpurch_div_table_setup_desctop"
        >
          <PurchtableColumnsSetup :table_type="activeLabel" />
        </div>
      </div>
    </div>
  </div>
  <CreatePurchaseDialog
    v-if="toggleCreateDialogPurchase"
    :is-open="toggleCreateDialogPurchase"
    :task-id="hdTaskId"
    @close="toggleCreateDialogPurchase = $event"
  ></CreatePurchaseDialog>
</template>

<style lang="scss" scoped>
@import './purchHeader.scss';
</style>
