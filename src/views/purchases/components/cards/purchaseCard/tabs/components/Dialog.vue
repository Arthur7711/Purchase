<template>
  <Teleport v-if="isOpen" to="body">
    <div
      class="dialog"
      :style="{
        display: 'flex',
      }"
      @click="closePopup"
    >
      <div
        class="dialog_wrapper"
        :style="{
          opacity: '1',
          padding: paddingDialog || '24px 32px 32px 32px',
        }"
        @click="
          (e) => {
            e.stopPropagation();
          }
        "
      >
        <div class="dialog_wrapper__content">
          <div v-if="title" class="dialog_wrapper__content_header">
            <h3 class="title">{{ title }}</h3>
            <slot name="headerActions"></slot>
          </div>
          <slot name="content"></slot>
        </div>
        <slot name="action"></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  title?: string;
  paddingDialog?: string;
}>();

const emit = defineEmits<{
  (e: "close", value: boolean): void;
}>();

const closePopup = () => {
  emit("close", false);
};
</script>

<style lang="scss" scoped>
.dialog {
  display: none;
  position: fixed;
  z-index: 1002;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.192);
  top: 0;
  left: 0;
  &_wrapper {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 32px;
    transition: 3s linear;
    opacity: 0;
    border-radius: 15px;
    height: max-content;
    background: white;
    &__content {
      position: relative;

      display: flex;
      flex-direction: column;
      gap: 22px;
      &_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          color: #1a1a1a;
          font-size: 22px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
