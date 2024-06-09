<template>
  <Dialog class="add-payment" :is-open="isOpen" :title="title" @close="closePopup">
    <template #headerActions>
      <div class="add-payment_actions">
        <button class="add-payment_actions__close" @click="closePopup">
          <img :src="CrossMark" alt="X" />
        </button>
      </div>
    </template>
    <template #content>
      <DocumentLayout
        :document="newDocument"
        :groups="groups"
        :currency="currency"
        :show-hint="showHint"
        :remainder="remainder"
        :debited-currency="debitedCurrency"
        :is-first-closed-doc="isFirstClosedDoc"
      />
    </template>
    <template #action>
      <button
        @click="createDocument"
        :class="['add-payment_actions__submit', { active: !isDisabledCreate }]"
        :disabled="isDisabledCreate"
      >
        {{ $t("create") }}
      </button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import Dialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/Dialog.vue";
import DocumentLayout from "@/views/purchases/components/cards/purchaseCard/tabs/components/documents/DocumentLayout.vue";
import CrossMark from "@/components/icons/xmark.svg";

import dateConverter from "@/helpers/dateConverter";
import type { ICreateDocumentPurchase } from "@/api/attachments";
import type { IGroup } from "../../../../../dialogs/types";
import { postAttachment } from "@/api/attachments";
import usePurchasesInfo from "@/store/purchases_store/purchases";

const props = defineProps<{
  isOpen: boolean;
  title: string;
  isFirstClosedDoc: boolean;
  groups: IGroup[];
  purchaseId?: number;
  debitedCurrency: string;
  currency: string;
  showHint: boolean;
  remainder: number;
}>();

const newDocument = ref<ICreateDocumentPurchase>({
  file: null,
  file_type: null,
  entity_id: 1,
  entity_type: "purchase",
  document_type: null,
  document_number: null,
  document_date: new Date(),
  item_ids: [],
  delivery_date: null,
  real_name: null,
  price: null,
  debited_price: null,
});

const isDisabledCreate = computed<boolean>(() => {
  const validDateDocument = newDocument.value.document_date;

  const validDateDelivery =
    newDocument.value.delivery_date &&
    dateConverter(`${newDocument.value.document_date}`) <=
      dateConverter(`${newDocument.value.delivery_date}`);

  const isRightPaymentType =
    usePurchasesInfo.selectedPurchase.value &&
    (usePurchasesInfo.selectedPurchase.value.payment_type_id === 2 ||
      usePurchasesInfo.selectedPurchase.value.payment_type_id === 5 ||
      usePurchasesInfo.selectedPurchase.value.payment_type_id === 6);

  if (newDocument.value.document_type === 3) {
    return !(
      newDocument.value.file &&
      validDateDocument &&
      validDateDelivery &&
      newDocument.value.document_number &&
      ((isRightPaymentType &&
        newDocument.value.price &&
        newDocument.value.debited_price) ||
        !isRightPaymentType)
    );
  } else {
    return !(
      newDocument.value.file &&
      newDocument.value.document_type &&
      validDateDocument
    );
  }
});

const emit = defineEmits<{
  (e: "close", value: boolean): void;
  (e: "send", value: boolean): void;
}>();

const closePopup = () => {
  emit("close", false);
  newDocument.value = {
    file: null,
    file_type: null,
    entity_id: null,
    entity_type: "purchase",
    document_type: null,
    document_number: null,
    price: null,
    debited_price: null,
    item_ids: [],
    document_date: new Date().toLocaleDateString(),
    delivery_date: null,
  };
};

const createDocument = async () => {
  if (props.purchaseId && newDocument.value) {
    await postAttachment({
      ...newDocument.value,
      entity_id: props.purchaseId,
      document_date:
        (newDocument.value.document_date &&
          dateConverter(`${newDocument.value.document_date}`)) ||
        null,
      delivery_date:
        (newDocument.value.delivery_date &&
          dateConverter(`${newDocument.value.delivery_date}`)) ||
        null,
    }).then(() => {
      emit("send", true);
    });

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
      cursor: pointer;
      outline: none;
      border: none;
      width: 100%;
      padding: 7px 20px;
      border-radius: 10px;
      color: white;
      font-size: 18px;
      font-weight: 600;
      background: #b6b6b6;
      &.active {
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
