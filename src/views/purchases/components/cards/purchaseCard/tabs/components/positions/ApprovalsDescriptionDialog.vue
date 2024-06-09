<template>
  <Dialog :is-open="isOpen" :title="$t('description approver')" @close="closePopup">
    <template #content>
      <TextLabelIcon
        :title="$t('description')"
        :value="description"
        @data-change="description = $event"
      />
    </template>
    <template #action>
      <button class="submit-btn" @click="sendRequest">{{ $t("send") }}</button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

import Dialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/Dialog.vue";
import TextLabelIcon from "@/components/labels/TextLabelIcon.vue";
import { sendApprovalRequest } from "@/api/approvals";

const props = defineProps<{
  isOpen: boolean;
  positionsIds: (number | undefined)[];
  purchaseId?: number;
  approvalId?: number;
}>();

const description = ref<string | null>(null);

const emit = defineEmits<{
  (e: "close", value: boolean): void;
  (e: "send", value: boolean): void;
}>();

const closePopup = () => {
  description.value = null;
  emit("close", false);
};

const sendRequest = async () => {
  if (props.purchaseId && props.approvalId) {
    await sendApprovalRequest(
      props.positionsIds,
      props.approvalId,
      props.purchaseId,
      description.value
    );
    emit("send", true);
    closePopup();
  }
};
</script>

<style lang="scss" scoped>
.submit-btn {
  cursor: pointer;
  outline: none;
  border: none;
  width: 100%;
  padding: 7px 20px;
  border-radius: 10px;
  background: #1565c0;
  color: white;
  font-size: 18px;
  font-weight: 600;
}
</style>
