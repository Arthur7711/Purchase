<template>
  <Dialog class="add-payment" :is-open="isOpen" :title="title" @close="closePopup">
    <template #headerActions>
      <div class="add-payment_actions">
        <button
          @click="createPayment"
          :class="['add-payment_actions__submit', { active: !isDisabledCreate }]"
          :disabled="isDisabledCreate"
        >
          {{ $t('create') }}
        </button>
        <button class="add-payment_actions__close" @click="closePopup">
          <img :src="CrossMark" alt="X" />
        </button>
      </div>
    </template>
    <template #content>
      <PaymentLayout
        :payment="newPayment"
        :remainder="remainder"
        :currency="currency"
        :show-hint="showHint"
        :debited-currency="debitedCurrency"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import Dialog from '@/views/purchases/components/cards/purchaseCard/tabs/components/Dialog.vue';
import PaymentLayout from '@/views/purchases/components/cards/purchaseCard/tabs/components/payments/PaymentLayout.vue';
import CrossMark from '@/components/icons/xmark.svg';

import dateConverter from '@/helpers/dateConverter';
import type { ICreatePayment } from '@/api/paymentsPurchase';
import { createPaymentPurchase } from '@/api/paymentsPurchase';
import usePurchasesInfo from '@/store/purchases_store/purchases';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  debitedCurrency: string;
  currency: string;
  purchaseId?: number;
  showHint: boolean;
  remainder: number;
}>();

const newPayment = ref<ICreatePayment>({
  date: new Date().toLocaleString().split(',')[0],
  type_id: null,
  price: 0,
  debited_price: 0,
  note: null,
  document_id: null
});

const isDisabledCreate = computed<boolean>(() => {
  const validDate =
    newPayment.value.date &&
    usePurchasesInfo.selectedPurchase.value?.purchase_date &&
    dateConverter(`${usePurchasesInfo.selectedPurchase.value.purchase_date}`) <=
      dateConverter(`${newPayment.value.date}`);

  return !(
    validDate &&
    newPayment.value.type_id &&
    newPayment.value.price &&
    newPayment.value.debited_price
  );
});

const emit = defineEmits<{
  (e: 'close', value: boolean): void;
  (e: 'send', value: boolean): void;
}>();

const closePopup = () => {
  emit('close', false);
  newPayment.value = {
    date: new Date().toLocaleString().split(',')[0],
    type_id: null,
    price: 0,
    debited_price: 0,
    note: null,
    document_id: null
  };
};

const createPayment = async () => {
  if (props.purchaseId && newPayment.value) {
    await createPaymentPurchase(props.purchaseId, {
      ...newPayment.value,
      date: newPayment.value.date && dateConverter(`${newPayment.value.date}`)
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
.add-payment {
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
