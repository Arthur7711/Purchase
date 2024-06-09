<template>
  <div class="payments-tab">
    <div class="payments-tab_wrapper">
      <div class="payments-tab_wrapper__header">
        <div class="payments-info">
          <img src="../../../../../../components/icons/money_bill.svg" alt="$$$" />
          <div class="payments-info_content">
            <p>{{ $t("payment amount") }}</p>
            <div class="payments-info_content__sums">
              <p class="current-price">
                {{ `${sumPayments} ${currency && getCurrencySignName(currency)}` }}
              </p>
              <p class="debited-price">
                {{
                  `${sumDebitedPayments} ${
                    debitedCurrency
                      ? getCurrencySignName(debitedCurrency)
                      : currency && getCurrencySignName(currency)
                  }`
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <DataTable
        selectionMode="single"
        class="tabs-table"
        scrollable
        scrollHeight="52vh"
        :value="data"
      >
        <template #empty>
          <p class="tabs-table_no-data">{{ $t("no") }} {{ $t("payments_2") }}</p>
        </template>
        <Column
          field="date"
          :style="{
            width: '10%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("date") }}</p>
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell">
              {{ data.date && new Date(data.date).toLocaleString().split(",")[0] }}
            </p>
          </template>
        </Column>
        <Column
          field="price"
          width="10%"
          :style="{
            width: '10%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("amount") }}</p>
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell money">
              {{
                `${
                  data.paying_type && data.paying_type.id === 3
                    ? -1 * data.price
                    : data.price
                } ${currency && getCurrencySignName(currency)}`
              }}
            </p>
          </template>
        </Column>
        <Column
          field="debited_price"
          :style="{
            width: '15%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("currency amount") }}</p>
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell money">
              {{
                `${
                  data.paying_type && data.paying_type.id === 3
                    ? -1 * data.debited_price
                    : data.debited_price
                } ${getCurrencySignName(data.debited_currency)}`
              }}
            </p>
          </template>
        </Column>
        <Column
          field="type_id"
          :style="{
            width: '15%',
          }"
        >
          <template #header>
            <purchtableDropdown
              :options="useCommonsInfo.commons.value.payingTypes"
              :placeholder="$t('type')"
              :fieldName="'payingType'"
              :table-name="''"
              :selected-filters="selectedFilters"
              @select="
                (e) => {
                  selectedFilters = e;
                  filterPayments(e);
                }
              "
            />
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell">
              {{ data.paying_type && data.paying_type.name }}
            </p>
          </template>
        </Column>
        <Column
          field="note"
          :style="{
            width: '15%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("description") }}</p>
          </template>
          <template #body="{ data }">
            <p
              v-tooltip="{
                value: `${data.note}`,
                escape: true,
                class: 'custom-description',
              }"
              class="tabs-table__cell"
            >
              {{
                data.note && data.note.length > 30
                  ? data.note.slice(0, 30) + "..."
                  : data.note || "—"
              }}
            </p>
          </template>
        </Column>
        <Column
          field="document"
          :style="{
            width: '25%',
          }"
        >
          <template #header>
            <p class="tabs-table__header">{{ $t("document") }}</p>
          </template>
          <template #body="{ data }">
            <p class="tabs-table__cell">
              <FileAccept v-if="data.document" />
              {{ (data.document && data.document.real_name) || "—" }}
            </p>
          </template>
        </Column>
        <Column
          field=""
          :style="{
            width: '10%',
          }"
        >
          <template #header>
            <div class="tabs-table__header--wrapper">
              <p class="tabs-table__header"></p>
              <button
                :class="['tabs-table__header-btn', { active: isSort }]"
                @click="sortPayments"
              >
                {{ $t("sorting") }} <img alt="sort" :src="sortArrow" />
              </button>
            </div>
          </template>
          <template #body="{ data }">
            <div class="tabs-table__cell btn-actions">
              <button @click="selectedPayment = data" class="btn-actions_item">
                <Marker />
              </button>
              <button
                class="btn-actions_item"
                @click="
                  (e) => {
                    selectedPaymentID = selectedPaymentID ? 0 : data.id;
                    toggle(e);
                  }
                "
              >
                <DeleteIcon />
              </button>
              <button
                v-if="data.document"
                class="btn-actions_item"
                @click="watchDoc(data.document.file_name)"
              >
                <EyeIcon :color="'rgb(21, 101, 192)'" />
              </button>
              <OverlayPanel ref="deletePopup" class="comment_delete-popup">
                <DeletePopup
                  class="comment_delete-popup__content"
                  :text="$t('after deletion payment')"
                  :remove="(id) => deletePayment(id)"
                  :id="selectedPaymentID"
                  :show-delete-popup="true"
                  @cancel="
                    () => {
                      toggle(false);
                      selectedPaymentID = 0;
                    }
                  "
                  :x="0"
                  :y="0"
                />
              </OverlayPanel>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="payments-tab_add-action">
      <button class="payments-tab_add-action__btn" @click="toggleDialogAddPayment = true">
        {{ $t("add payment") }} <SquarePlus />
      </button>
    </div>
  </div>
  <AddPaymentDialog
    :title="$t('adding payment')"
    :is-open="toggleDialogAddPayment"
    :purchase-id="purchaseId"
    :show-hint="!isAmountCovered"
    :remainder="remainder"
    :currency="currency"
    :debited-currency="debitedCurrency"
    @send="isSendReq = $event"
    @close="toggleDialogAddPayment = $event"
  />
  <EditPaymentDialog
    :title="$t('payment editing_2')"
    :is-open="!!selectedPayment"
    :payment="selectedPayment"
    :purchase-id="purchaseId"
    :currency="currency"
    :remainder="remainder"
    :show-hint="!isAmountCovered"
    :debited-currency="debitedCurrency"
    @send="isSendReq = $event"
    @close="selectedPayment = $event"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";

import AddPaymentDialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/payments/AddPaymentDialog.vue";
import EditPaymentDialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/payments/EditPaymentDialog.vue";
import purchtableDropdown from "@/components/custom/purch_table_filters/purchtableDropdown.vue";
import DeletePopup from "@/components/deletePopup/DeletePopup.vue";

import type { IPayment } from "@/api/paymentsPurchase";
import { getPaymentsPurchase, deletePaymentPurchase } from "@/api/paymentsPurchase";
import FileAccept from "@/components/icons/FileAccept.vue";
import DeleteIcon from "@/components/icons/Delete.vue";
import EyeIcon from "@/components/icons/Eye.vue";
import Marker from "@/components/icons/Marker.vue";
import SquarePlus from "@/components/icons/SquarePlus.vue";
import sortArrow from "@/components/icons/sort-arrows.svg";
import { getCurrencySignName } from "@/helpers/currencySign";
import useCommonsInfo from "@/store/purchases_store/commons";
import usePurchasesInfo from "@/store/purchases_store/purchases";

const props = defineProps<{
  purchaseId?: number;
  count: number;
  debitedCurrency: string;
  currency: string;
  createClosedDoc: boolean;
  isAmountCovered: boolean;
  remainderPayments: number;
}>();

const emit = defineEmits<{
  (e: "updateCount", value: number): void;
  (e: "updateAmount", value: boolean): void;
  (e: "updateRemainder", value: number): void;
}>();

const payments = ref<IPayment[]>([]);
const deletePopup = ref();
const data = ref(payments.value ? [...payments.value] : []);
const selectedPayment = ref<IPayment | null>(null);
const selectedPaymentID = ref<number>(0);
const toggleDialogAddPayment = ref(false);
const isSendReq = ref(false);
const isSort = ref(false);
const remainder = ref(0);
const API_URL = import.meta.env.VITE_VUE_APP_API_URL;
const selectedFilters = ref<
  { id: string | number; name?: string; bank_id?: string; description?: string }[]
>([]);

const sumPayments = computed<number>(
  () => +payments.value.reduce((acc, prev) => (acc += prev.price), 0).toFixed(2)
);
const sumDebitedPayments = computed<number>(
  () => +payments.value.reduce((acc, prev) => (acc += prev.debited_price), 0).toFixed(2)
);

watch(
  () => payments.value,
  (value) => {
    emit("updateCount", value.length);
  },
  { deep: true }
);

watch(
  () => sumDebitedPayments.value,
  (value) => {
    remainder.value = usePurchasesInfo.pricePurchase.value - value;
    const res = value >= usePurchasesInfo.pricePurchase.value;
    emit("updateAmount", res);
    emit("updateRemainder", remainder.value);
  },
  { deep: true }
);

watch(
  () => isSendReq.value,
  async () => {
    if (props.purchaseId && isSendReq.value) {
      payments.value = await getPaymentsPurchase(props.purchaseId);
      data.value = JSON.parse(JSON.stringify(payments.value));

      selectedFilters.value = [];
      isSort.value = false;
      isSendReq.value = false;
      usePurchasesInfo.setUpdateTable(true);

      setTimeout(() => {
        usePurchasesInfo.setUpdateTable(false);
      });
    }
  }
);

watch(
  () => props.createClosedDoc,
  (value) => {
    if (value) {
      isSendReq.value = true;
    }
  }
);

const toggle = (event: Event | boolean): void => {
  deletePopup.value.toggle(event);
};

const deletePayment = async (payingID: number): Promise<void> => {
  if (props.purchaseId) {
    await deletePaymentPurchase(props.purchaseId, payingID);

    selectedPaymentID.value = 0;
    isSendReq.value = true;
    toggle(false);
  }
};

const sortPayments = (): void => {
  isSort.value = !isSort.value;

  if (payments.value.length === data.value.length) {
    payments.value.sort((payment1: IPayment, payment2: IPayment) => {
      const date1: any = new Date(payment1.date);
      const date2: any = new Date(payment2.date);

      return isSort.value ? date2 - date1 : date1 - date2;
    });

    data.value = JSON.parse(JSON.stringify(payments.value));
  } else {
    data.value.sort((payment1: IPayment, payment2: IPayment) => {
      const date1: any = new Date(payment1.date);
      const date2: any = new Date(payment2.date);

      return isSort.value ? date2 - date1 : date1 - date2;
    });

    payments.value.sort((payment1: IPayment, payment2: IPayment) => {
      const date1: any = new Date(payment1.date);
      const date2: any = new Date(payment2.date);

      return isSort.value ? date2 - date1 : date1 - date2;
    });
  }
};

const filterPayments = (
  selected: { id: string | number; name?: string; description?: string }[]
): void => {
  data.value = [];

  if (selected.length === 0) {
    data.value = JSON.parse(JSON.stringify(payments.value));
  } else {
    payments.value.forEach((item: IPayment) => {
      selected.forEach((el) => {
        if (item.type_id === el.id) {
          data.value.push(item);
        }
      });
    });
  }
};

const watchDoc = (fileName: string): void => {
  window.open(`${API_URL}/storage/files/${fileName}/preview`, "_blank");
};

onMounted(async () => {
  if (props.purchaseId) {
    payments.value = await getPaymentsPurchase(props.purchaseId);

    data.value = [...payments.value];
  }
});
</script>

<style lang="scss">
@import "./style.scss";

.payments-tab {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  &_wrapper {
    display: flex;
    gap: 12px;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10px;
    &__header {
      display: flex;
      gap: 10px;
      padding: 14px 18px 0 18px;
      & .payments-info {
        display: flex;
        align-items: center;
        height: 50px;
        padding: 15px;
        gap: 10px;
        border-radius: 10px;
        border: 1px solid #e3e3e3;
        background: #fff;
        &_content {
          & > p {
            color: #999;
            font-size: 12px;
            font-weight: 400;
          }
          &__sums {
            display: flex;
            align-items: center;
            gap: 8px;
            & > .current-price {
              color: #1a1a1a;
              font-size: 16px;
              font-weight: 400;
            }
            & > .debited-price {
              color: #999;
              font-size: 14px;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
  &_add-action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 0;
    &__btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 10px 10px 12px 10px;
      border-radius: 10px;
      gap: 8px;
      color: #1565c0;
      background: none;
      border: none;
      outline: none;
      font-size: 14px;
      font-weight: 600;
      &:disabled {
        cursor: auto;
        opacity: 0.5;
        &:hover {
          background: none;
        }
      }
      &:hover {
        background: #1565c011;
      }
    }
  }
}
.custom-description .p-tooltip-text {
  background-color: white;
  color: #666666;
  padding-bottom: 5px;
  padding-top: 1px;
  font-size: 14px;
  width: auto;
}
</style>
