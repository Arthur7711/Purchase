<template>
  <Dialog class="edit-payment" :is-open="isOpen" :title="title" @close="closePopup">
    <template #headerActions>
      <div class="edit-payment_actions">
        <button
          @click="saveDocument"
          :class="['edit-payment_actions__submit', { active: !isDisabledSaved }]"
          :disabled="isDisabledSaved"
        >
          {{ $t('save') }}
        </button>
        <button class="edit-payment_actions__close" @click="closePopup">
          <img :src="CrossMark" alt="X" />
        </button>
      </div>
    </template>
    <template #content>
      <DocumentLayout
        v-if="data"
        :show-hint="showHint"
        :type="'edit'"
        :document="data"
        :remainder="remainder"
        :groups="groups"
        :currency="currency"
        :debited-currency="debitedCurrency"
        :is-first-closed-doc="false"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

import Dialog from '@/views/purchases/components/cards/purchaseCard/tabs/components/Dialog.vue';
import DocumentLayout from '../documents/DocumentLayout.vue';
import CrossMark from '@/components/icons/xmark.svg';

import dateConverter from '@/helpers/dateConverter';
import type { IGroup } from '@/views/purchases/components/dialogs/types';
import type { ICreateDocumentPurchase } from '@/api/attachments';
import { editDocumentPurchase } from '@/api/attachments';
import usePurchasesInfo from '@/store/purchases_store/purchases';

const props = defineProps<{
  isOpen: boolean;
  title: string;
  debitedCurrency: string;
  currency: string;
  groups: IGroup[];
  purchaseId?: number;
  document: ICreateDocumentPurchase | null;
  showHint: boolean;
  remainder: number;
}>();

const data = ref<ICreateDocumentPurchase | null>(null);

const isDisabledSaved = computed<boolean>(() => {
  const validDateDocument =
    data.value &&
    data.value.document_date &&
    usePurchasesInfo.selectedPurchase.value?.purchase_date &&
    dateConverter(`${usePurchasesInfo.selectedPurchase.value.purchase_date}`) <=
      dateConverter(`${data.value.document_date}`);

  const validDateDelivery =
    data.value &&
    data.value.delivery_date &&
    usePurchasesInfo.selectedPurchase.value?.purchase_date &&
    dateConverter(`${data.value.document_date}`) <= dateConverter(`${data.value.delivery_date}`);

  if (!!data.value && data.value.document_type === 3) {
    return !(
      data.value.real_name &&
      validDateDocument &&
      validDateDelivery &&
      data.value.document_number
    );
  } else {
    return !!data.value && !(data.value.real_name && data.value.document_type && validDateDocument);
  }
});

const emit = defineEmits<{
  (e: 'close', value: null): void;
  (e: 'send', value: boolean): void;
}>();

watch(
  () => props.document,
  (value) => {
    if (value) {
      const doc = JSON.parse(JSON.stringify(value));

      data.value = {
        ...doc,
        document_date:
          (doc.document_date && new Date(`${doc.document_date}`).toLocaleString().split(',')[0]) ||
          null,
        delivery_date:
          (doc.delivery_date && new Date(`${doc.delivery_date}`).toLocaleString().split(',')[0]) ||
          null
      };
    }
  }
);

const closePopup = () => {
  emit('close', null);
};

const saveDocument = async () => {
  if (props.purchaseId && data.value?.id && data.value.document_type) {
    await editDocumentPurchase(data.value.id, {
      real_name: data.value.real_name,
      document_type: data.value.document_type,
      item_ids: data.value.item_ids,
      document_number: data.value.document_number,
      document_date:
        (data.value.document_date && dateConverter(`${data.value.document_date}`)) || null,
      delivery_date:
        (data.value.delivery_date && dateConverter(`${data.value.delivery_date}`)) || null
    }).then(() => {
      emit('send', true);
    });

    closePopup();
  }
};

onMounted(() => {
  if (props.document) {
    const doc = JSON.parse(JSON.stringify(props.document));

    data.value = {
      ...doc,
      document_date:
        (doc.document_date && new Date(`${doc.document_date}`).toLocaleString().split(',')[0]) ||
        null,
      delivery_date:
        (doc.delivery_date && new Date(`${doc.delivery_date}`).toLocaleString().split(',')[0]) ||
        null
    };
  }
});
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
      cursor: pointer;
      border: none;
      outline: none;
      padding: 5px 14px;
      border-radius: 10px;
      background: #b6b6b6;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      &.active {
        color: white;
        background: #1565c0;
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
