<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { type ISafe } from '@/store/safes';
import type { IPurchase } from '@/views/purchases/components/dialogs/types';
import { getSafes } from '@/api/safes';
import { getPurchase } from '@/api/purchases';
import { getCurrencySignName } from '@/helpers/currencySign';
import useSafes from '@/store/safes';
import {
  type IBalance,
  type ISources,
  type IOperation,
  getOutcomeSources,
  getBalance,
  getOperation,
  getIncomeSources
} from '@/api/gettersSafe';
import ModalSelectSafe from './ModalSelectSafe.vue';
import useUserInfo from '@/store/user';
import useSafeFilters from '@/store/safeStore/safeFilterStore';
import DatePickerSafeModal from './modalSafeComponents/DatePickerSafeModal.vue';
import ExcelDownloadSafe from './modalSafeComponents/ExcelDownloadSafe.vue';
import dateConverter from '@/helpers/dateConverter';
import ProgressSpinner from 'primevue/progressspinner';
import usePurchasesInfo from '@/store/purchases_store/purchases';
import { debounce } from '@/helpers/debounse';
import i18n_config from '@/locales/i18n_config';
import { curFormatter } from '@/helpers/currencyFormatter';

const { locale, messages } = i18n_config.global;
const isSafeSelected = ref<false | { safe_id: number; id: number }>(false);
const isUpdate = ref(false);
const safes = ref<ISafe[]>();
const income_sources = ref<ISources[] | null>(null);
const outcome_sources = ref<ISources[] | null>(null);
const balance_card = ref<IBalance | null>(null);
const operations = ref<IOperation | null>(null);
const columns = ref([
  { id: 0, name: messages[locale].date, field: 'date', active: true },
  { id: 1, name: messages[locale].amount, field: 'amount', active: true },
  { id: 2, name: messages[locale].source, field: 'entity', active: true },
  { id: 3, name: messages[locale].description, field: 'description', active: true }
]);

// const emit = defineEmits<{
//   (e: 'close', val: boolean): void;
// }>();

const setSafe = async (safe_id: number, id: number) => {
  await getBalance(safe_id, id).then((res) => (balance_card.value = res));
  useSafeFilters.setFilters('id', id);
  useSafeFilters.setFilters('safe_id', safe_id);
  await getOperation(useSafeFilters.filters.value).then((res) => (operations.value = res));
  await getIncomeSources(safe_id).then((res) => (income_sources.value = res));
  isSafeSelected.value = { safe_id, id };
};

const pushTableData = async () => {
  if (!isUpdate.value) {
    isUpdate.value = true;
    await getOperation(useSafeFilters.filters.value).then((res) =>
      res.data.map((el) => {
        operations.value?.data.push(el);
      })
    );
    isUpdate.value = false;
  }
};

const hardUpdate = ref<boolean>(false);

const handleHardUpdate = (val: boolean) => {
  hardUpdate.value = val;
  setTimeout(() => {
    hardUpdate.value = false;
  }, 350);
};

onMounted(async () => {
  isUpdate.value = true;
  document.body.style.position = 'fixed';
  document.body.style.width = '100vw';
  await getSafes().then((res) => (safes.value = res));
  await getOutcomeSources().then((res) => (outcome_sources.value = res));
  setTimeout(() => {
    isUpdate.value = false;
  }, 290);
});

onBeforeUnmount(() => {
  document.body.style.position = '';
  document.body.style.width = '';
});

const debUpdate = debounce(async function () {
  isUpdate.value = true;
  if (useSafeFilters.filters.value.page !== 1) {
    useSafeFilters.setFilters('page', 1);
  }
  if (useSafeFilters.filters.value.safe_id && useSafeFilters.filters.value.id) {
    await getOperation(useSafeFilters.filters.value)
      .then((res) => (operations.value = res))
      .catch((err) =>
        setTimeout(() => {
          isUpdate.value = false;
        }, 290)
      );
  }
  setTimeout(() => {
    isUpdate.value = false;
  }, 290);
}, 300);

const debHardUpdate = debounce(async function () {
  isUpdate.value = true;
  await getSafes().then((res) => (safes.value = res));
  await getOperation(useSafeFilters.filters.value).then((res) => (operations.value = res));
  if (isSafeSelected.value) {
    await getBalance(isSafeSelected.value?.safe_id, isSafeSelected.value.id).then(
      (res) => (balance_card.value = res)
    );
    await getIncomeSources(isSafeSelected.value.safe_id).then(
      (res) => (income_sources.value = res)
    );
  }
  setTimeout(() => {
    isUpdate.value = false;
  }, 290);
}, 300);

const handleOpenPurchCard = async (id: string | number) => {
  await getPurchase(+id).then((res: IPurchase) => {
    usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
  });
};

watch(
  () => [
    useSafeFilters.filters.value.amount,
    useSafeFilters.filters.value.date_from,
    useSafeFilters.filters.value.date_to,
    useSafeFilters.filters.value.description,
    useSafeFilters.filters.value.entity_id,
    useSafeFilters.filters.value.entity_type,
    useSafeFilters.filters.value.id,
    useSafeFilters.filters.value.order_dir,
    useSafeFilters.filters.value.safe_id
  ],
  async () => {
    if (!isUpdate.value) {
      debUpdate();
    }
  }
);

watch(
  () => hardUpdate.value,
  async () => {
    debHardUpdate();
  }
);
</script>

<template>
  <div
    class="modal_safe_div_all"
    @click="
      () => {
        $emit('close', false);
        useSafeFilters.removeFilters();
      }
    "
  >
    <div
      class="modal_safe_div_dialog"
      @click="
        (e) => {
          e.stopPropagation();
        }
      "
    >
      <div class="modal_safe_div_header">
        <span class="modal_safe_div_header_span_not_selected" v-if="!isSafeSelected">{{
          $t("Safe selection")
        }}</span>
        <div v-else class="modal_safe_div_header">
          <DatePickerSafeModal />
          <div class="modal_safe_div_excel">
            <ExcelDownloadSafe
              v-if="balance_card"
              :currency="balance_card?.currency"
              :columns="columns"
            />
          </div>
        </div>
        <div
          v-if="isUpdate"
          style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            z-index: 100;
            justify-content: center;
            align-items: center;
          "
        >
          <ProgressSpinner />
        </div>
        <div class="modal_safe_div_header_topgroup">
          <span
            class="modal_safe_span_office_name"
            v-if="isSafeSelected"
            style="margin-right: 20px; margin-bottom: 4px"
          >
            {{
              useUserInfo.userData.value?.location.office_shortname.toUpperCase() +
              "-" +
              useUserInfo.userData.value?.location.department.toUpperCase()
            }}</span
          >
          <button
            @click="
              () => {
                $emit('close', false);
                useSafeFilters.removeFilters();
              }
            "
          >
            <img src="../../icons/closer-x.svg" alt="X" />
          </button>
        </div>
      </div>
      <div class="modal_safe_div_body">
        <div v-if="!isSafeSelected">
          <div v-for="safe in safes" :key="safe.id" style="margin-top: 14px">
            <span class="modal_safe_body_span_safe_name">{{ safe.name }}</span>
            <div
              class="modal_safe_body_div_accounts"
              v-for="account in safe.accounts"
              @click="() => setSafe(account.safe_id, account.id)"
              :key="account.id"
            >
              {{ curFormatter(account.balance) }}
              {{ getCurrencySignName(account.currency) }}
            </div>
          </div>
        </div>
        <div v-else>
          <ModalSelectSafe
            :safes="safes"
            :is-update="isUpdate"
            @scroll="pushTableData()"
            @entity_id="(id) => handleOpenPurchCard(id)"
            :columns="columns"
            :operations="operations"
            :income_sources="income_sources"
            :outcome_sources="outcome_sources"
            v-if="balance_card && safes"
            :safe_account="balance_card"
            @update="handleHardUpdate"
          />
        </div>
      </div>
      <div v-if="isSafeSelected" class="modal_sfae_div_footer">
        <button
          class="modal_safe_button_back"
          @click="
            () => {
              isSafeSelected = false;
              useSafeFilters.removeFilters();
            }
          "
        >
          {{ $t("back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "./ModalSafe.scss";
</style>
