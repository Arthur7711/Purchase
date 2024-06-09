<template>
  <Dialog class="edit-position" :is-open="isOpen" :padding-dialog="'0'">
    <template #content>
      <DeletePopup
        class="comment_delete-popup__content"
        :text="$t('change the fact date')"
        :remove="() => change(new Date())"
        :id="0"
        :show-delete-popup="true"
        :is-change-btn="true"
        @cancel="
          () => {
            change(null);
          }
        "
        :x="0"
        :y="0"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "@/views/purchases/components/cards/purchaseCard/tabs/components/Dialog.vue";
import DeletePopup from "@/components/deletePopup/DeletePopup.vue";
import dateConverter from "@/helpers/dateConverter";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "updateFactDate", value: null | string): void;
  (e: "close", value: boolean): void;
}>();

const change = (res: null | Date) => {
  const value = res ? dateConverter(`${res}`) : null;

  emit("updateFactDate", value);

  emit("close", false);
};
</script>

<style lang="scss" scoped></style>
