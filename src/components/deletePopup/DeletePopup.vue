<script setup lang="ts">
const props = defineProps<{
  showDeletePopup: boolean;
  remove: (id: number) => void;
  text: string;
  isChangeBtn?: boolean;
  x: number | string;
  y: number | string;
  id: number;
}>();
const emit = defineEmits<{
  (e: "cancel", value: number): void;
}>();

const cancelEdit = () => {
  emit("cancel", 0);
};
</script>
<template>
  <div
    class="delete_dropdown"
    v-if="showDeletePopup"
    :style="{
      top: `${y}px`,
      left: `${x}px`,
    }"
  >
    <div class="main">
      <p class="info">{{ text }}</p>
      <div class="btn_box">
        <Button @click="cancelEdit">{{ $t("cancel") }}</Button>
        <Button @click="() => remove(id)">{{
          isChangeBtn ? $t("change") : $t("delete")
        }}</Button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.delete_dropdown {
  background: #ffffff;
  width: 254px;
  border-radius: 15px;
  gap: 16px;
  box-shadow: 0px 0px 22px 7px #bababa66;
  position: fixed;
  z-index: 1003;
  .main {
    background: rgba(245, 124, 0, 0.03);
    width: 100%;
    height: 100%;
    padding: 20px;
    p {
      line-height: 20px;
    }
    .btn_box {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 36px;
        &:nth-child(1) {
          background: none;
          border-color: var(--vt-c-tabs-gray);
          color: var(--vt-c-tabs-gray);
        }
        &:nth-child(2) {
          background: var(--vt-c-orange);
          border: none;
        }
      }
    }
  }
}
</style>
