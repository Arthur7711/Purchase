<template>
  <Dialog class="edit-payment" :is-open="isOpen" :title="title" @close="closePopup">
    <template #headerActions>
      <div class="edit-payment_actions">
        <button
          @click="savePayment"
          :disabled="isDisabledSaved"
          :class="['edit-payment_actions__submit', { active: !isDisabledSaved }]"
        >
         {{ $t('save') }}
        </button>
        <button class="edit-payment_actions__close" @click="closePopup">
          <img :src="CrossMark" alt="X" />
        </button>
      </div>
    </template>
    <template #content>
      <PaymentLayout
        v-if="data"
        :payment="data"
        :remainder="remainder"
        :show-hint="showHint"
        :currency="currency"
        :debited-currency="debitedCurrency"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import Dialog from '@/views/purchases/components/cards/purchaseCard/tabs/components/Dialog.vue';
import PaymentLayout from '@/views/purchases/components/cards/purchaseCard/tabs/components/payments/PaymentLayout.vue';
import CrossMark from '@/components/icons/xmark.svg';

import dateConverter from '@/helpers/dateConverter';
import type { IPayment } from '@/api/paymentsPurchase';
import { editPaymentPurchase } from '@/api/paymentsPurchase';
import usePurchasesInfo from '@/store/purchases_store/purchases';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  debitedCurrency: string;
  currency: string;
  purchaseId?: number;
  payment: IPayment | null;
  showHint: boolean;
  remainder: number;
}>();

const data = ref<IPayment | null>(props.payment);

const isDisabledSaved = computed<boolean>(() => {
  const validDate =
    data.value &&
    data.value.date &&
    usePurchasesInfo.selectedPurchase.value?.purchase_date &&
    dateConverter(`${usePurchasesInfo.selectedPurchase.value.purchase_date}`) <=
      dateConverter(`${data.value.date}`);

  return !(
    data.value &&
    validDate &&
    data.value.type_id &&
    data.value.price &&
    data.value.debited_price
  );
});

const emit = defineEmits<{
  (e: 'close', value: null): void;
  (e: 'send', value: boolean): void;
}>();

watch(
  () => props.payment,
  (value) => {
    if (value) {
      data.value = {
        ...value,
        date: new Date(value.date).toLocaleString().split(',')[0]
      };
    }
  }
);

const closePopup = () => {
  emit('close', null);
};

const savePayment = async () => {
  if (props.purchaseId && data.value) {
    await editPaymentPurchase(props.purchaseId, data.value.id, {
      ...data.value,
      type_id: +data.value.type_id,
      date: data.value.date && dateConverter(`${data.value.date}`)
    });
    emit('send', true);
    closePopup();
  }
};
</script>

<style lang="scss">
.p-datepicker {
  z-index: 1002 !important;
}

.p-dropdown-panel {
  z-index: 1003 !important;
}
.edit-payment {
  &_actions {
    display: flex;
    align-items: center;
    gap: 24px;
    &__submit {
      cursor: auto;
      border: none;
      outline: none;
      padding: 5px 14px;
      border-radius: 10px;
      background: #b6b6b6;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      &.active {
        cursor: pointer;
        background: #1565c0;
        color: white;
        margin: 0;
      }
    }
    &__close {
      display: flex;
      align-items: center;
      background: none;
      cursor: pointer;
      border: none;
      outline: none;
      opacity: 0.9;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
