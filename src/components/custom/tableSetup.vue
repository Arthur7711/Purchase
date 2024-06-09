<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { type ICheckedCol } from '../../store/tablesStore/checkedColumn';
import draggable from 'vuedraggable';
import DialogNomenclature from '../dialogs/DialogNomenclature.vue';
import { getDownloadExelPurchasesTable } from '@/api/purchasesTable';
import useFilters from '../../store/purchases_store/filters';
import usePurchDateTo from '../../store/purchases_store/purchDateTo';
import usePurchDateFrom from '../../store/purchases_store/purchDateFrom';
import { lastMonth } from '@/helpers/getDatesRange';
import { format } from 'date-fns';
import { getDownloadExelFavouriteTable } from '@/api/favoriteTablePurchases';
import { downloadExcelPositions } from '@/api/positionsTable';
import usePositionsFilters from '../../store/purchases_store/positionsFilter';
import ScreenParams from '@/store/screen';
const props = defineProps<{
  allColumns: { id: number; field: string; name: string; active: boolean }[];
  checkedColumns: { id: number; field: string; name: string; active: boolean }[];
  defaultColumns: { id: number; field: string; name: string; active: boolean }[];
  table_type: string;
}>();

const showAll = ref(false);
const visiblePopup = ref(false);
const columns = ref(props.allColumns);
const checked = ref<ICheckedCol[]>(props.checkedColumns);
const selectedExelColumns = ref(props.defaultColumns);
const type = ref('');
onMounted(() => {
  type.value =
    props.table_type === 'purchase' || props.table_type === 'favourite'
      ? 'purchase_columns'
      : props.table_type === 'position'
        ? 'positions_columns'
        : props.table_type === 'payments'
          ? 'payments_columns'
          : '';
  if (props.table_type === 'payments' || !props.table_type) {
    columns.value = localStorage.getItem('payments_columns')
      ? JSON.parse(localStorage.getItem('payments_columns') as string)
      : props.allColumns;
  }
});
const emit = defineEmits<{
  (e: 'columns-change', val: { id: number; field: string; name: string; active: boolean }[]): void;
  (
    e: 'change-col-number',
    val: { id: number; field: string; name: string; active: boolean }[]
  ): void;
}>();
const setDefault = () => {
  columns.value = props.defaultColumns.map((el) => {
    el.active = true;
    return el;
  });
  checked.value = props.defaultColumns.map((el) => {
    el.active = true;
    return el;
  });
};

const handleChecked = (e: any, id: number) => {
  columns.value = columns.value.map((el) => {
    if (el.id === id) {
      el.active = !el.active;
      return el;
    } else {
      return el;
    }
  });

  checked.value = columns.value.map((el) => {
    if (el.id === id && el.active) {
      return el;
    } else if (el.id !== id && el.active) {
      return el;
    }
  }) as ICheckedCol[];
};

const dragOpts = computed(() => ({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost'
}));

const handleDownload = () => {
  switch (props.table_type) {
    case 'favourite':
      getDownloadExelFavouriteTable({
        ...useFilters.filtersFavourite.value,
        date_to: usePurchDateTo.dateTo.value || format(new Date(), 'yyyy-MM-dd'),
        date_from: usePurchDateFrom.dateFrom.value || lastMonth,
        columns: selectedExelColumns.value
      }).then((res) => {
        const link = document.createElement('a');
        link.setAttribute('href', `${res.data.url}`);
        link.setAttribute('download', '');
        link.setAttribute('target', '_blank');
        link.click();
      });
      break;
    case 'purchase':
      getDownloadExelPurchasesTable({
        ...useFilters.filtersPurch.value,
        date_to: usePurchDateTo.dateTo.value || format(new Date(), 'yyyy-MM-dd'),
        date_from: usePurchDateFrom.dateFrom.value || lastMonth,
        columns: selectedExelColumns.value
      }).then((res) => {
        const link = document.createElement('a');
        link.setAttribute('href', `${res.data.url}`);
        link.setAttribute('download', '');
        link.setAttribute('target', '_blank');
        link.click();
      });
      break;
    case 'position':
      downloadExcelPositions({
        ...usePositionsFilters,
        date_to: usePurchDateTo.dateTo.value || format(new Date(), 'yyyy-MM-dd'),
        date_from: usePurchDateFrom.dateFrom.value || lastMonth,
        columns: selectedExelColumns.value
      }).then((res) => {
        const link = document.createElement('a');
        link.setAttribute('href', `${res.data.url}`);
        link.setAttribute('download', '');
        link.setAttribute('target', '_blank');
        link.click();
      });
      break;
    default:
      break;
  }
};

watch(
  () => selectedExelColumns.value,
  () => {
    selectedExelColumns.value = selectedExelColumns.value.sort((a, b) => a.id - b.id);
  }
);

watch(
  () => columns.value,
  () => {
    const check = columns.value.filter((el) => el.active);
    localStorage.setItem(
      type.value ? type.value : 'payments_columns',
      JSON.stringify(columns.value)
    );
    emit('columns-change', check);
    emit('change-col-number', columns.value);
  }
);
</script>

<template>
  <div class="purchtable_setup_div_all">
    <div
      @click="visiblePopup = !visiblePopup"
      class="purchtable_setup_div_excel"
      v-if="table_type !== 'payments'"
    >
      <img src="../icons/exel-icon.svg" alt=" " />
      <span style="color: #1565c0; font-size: 16px; font-weight: 600; cursor: pointer">
        {{ $t('upload excel') }}</span
      >
    </div>
    <DialogNomenclature
      :color-title="'#1565C0'"
      :visible="visiblePopup"
      :title="$t('customizing excel')"
      @close="visiblePopup = !visiblePopup"
    >
      <template #bodyoption>
        <div style="margin-top: -20px">{{ $t('select columns uploading') }}</div>
        <div style="margin-top: 16px; display: grid; grid-template-columns: repeat(2, 1fr)">
          <div style="margin: 0 20px 20px 0" v-for="col in columns" :key="col.id">
            <Checkbox
              v-model="selectedExelColumns"
              :inputId="String(col.id)"
              :value="{
                id: col.id,
                name: col.name,
                field: col.field,
                active: col.active
              }"
            />
            <span style="margin-left: 12.5px">{{ col.name }}</span>
          </div>
        </div>
        <span
          @click="selectedExelColumns = allColumns"
          style="color: #1565c0; font-size: 13px; font-weight: 600; cursor: pointer"
          >{{ $t('select all') }}</span
        >
        <div style="width: 100%; display: flex; justify-content: flex-end; align-items: center">
          <button class="purch_table_cancel_exel" @click="visiblePopup = !visiblePopup">
            {{ $t('cancel') }}
          </button>
          <button class="purch_table_download_exel" @click="handleDownload">
            {{ $t('save') }}
          </button>
        </div>
      </template>
    </DialogNomenclature>
  </div>
  <hr class="tablesetup_hr_top" v-if="table_type !== 'payments'" />
  <div class="tablesetup_div_bottom">
    <div class="tablesetup_setup_col">
      <h4>{{ $t('column setup') }}</h4>
      <div class="tablesetup_div_buttongroup">
        <button @click="setDefault">{{ $t('return initial') }}</button>
        <button
          v-if="table_type !== 'payments' || ScreenParams.screenParams.height < 720"
          @click="showAll = !showAll"
          class="tablesetup_buttongroup_secondbutton"
        >
          {{ showAll === true ? $t('hide') : $t('show') }}
        </button>
      </div>
      <div class="tablesetup_div_drag_container">
        <draggable
          v-model="columns"
          item-key="id"
          style="overflow: hidden"
          :style="showAll === true ? { overflowY: 'scroll', height: '620px' } : { height: '620px' }"
          v-bind="dragOpts"
          :handle="ScreenParams.screenParams.width < 650 ? '.handle' : false"
        >
          <template #item="{ element }">
            <div class="tablesetup_mapping_items">
              <img
                class="handle"
                src="../icons/grip-dots.svg"
                alt="::"
                style="margin-right: 20px; cursor: grab"
              />
              <Checkbox
                @change="(e) => handleChecked(e, element.id)"
                v-model="checked"
                @drag="(w: any) => w.stopPropagation()"
                :inputId="String(element.id)"
                :value="{
                  id: element.id,
                  name: element.name,
                  field: element.field,
                  active: element.active
                }"
              />
              <span style="margin-left: 8px">{{ element.name }}</span>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './tableSetup.scss';
</style>
