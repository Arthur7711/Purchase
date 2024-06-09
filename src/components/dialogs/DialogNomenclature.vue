<script setup lang="ts">
import ScreenParams from '@/store/screen';
import { onBeforeUnmount, onMounted, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  title: string;
  topPossition?: string;
  widthSize?: string;
  leftPossition?: string;
  colorTitle?: string;
}>();
const emit = defineEmits<{
  (e: 'close', value: boolean): void;
}>();
const closePopup = () => {
  emit('close', !props.visible);
};

watch(
  () => props.visible,
  () => {
    props.visible ? (document.body.style.position = 'fixed') : (document.body.style.position = '');
  }
);

onBeforeUnmount(() => {
  document.body.style.position = '';
});
</script>
<template>
  <div class="hidden_dialog_box" @click="closePopup" v-if="visible">
    <div
      class="modal_custom"
      @click="(e:any)=>{e.stopPropagation();}"
      :style="{
        display: visible ? 'block' : 'none',
        top: topPossition || '20vh',
        width: widthSize || '600px',
        left: leftPossition || '35vw'
      }"
    >
      <div class="head_container">
        <h2 :style="colorTitle ? { color: colorTitle } : ''">{{ props.title }}</h2>

        <button
          class="modal_custom_button_close"
          v-show="ScreenParams.screenParams.width < 650"
          @click="
            (e) => {
              e.stopPropagation();
              $emit('close', false);
            }
          "
        >
          x
        </button>

        <slot name="headoption"></slot>
      </div>
      <slot name="bodyoption"></slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
.hidden_dialog_box {
  width: 100vw;
  background: rgba(14, 13, 13, 0.5);
  position: fixed;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.modal_custom {
  // position: fixed;
  z-index: 100100;
  height: 95vh;
  overflow-y: scroll;
  background: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  .head_container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    h2 {
      margin-bottom: 20px;
    }
  }
}

.modal_custom_button_close {
  border: none;
  background: none;
  height: 40px;
  font-size: 20px;
}

@media only screen and (max-width: 650px) {
  .hidden_dialog_box {
    width: 100vw;
    overflow: hidden;
    .head_container {
      align-items: flex-start;
      display: grid;
      grid-template-columns: 100fr 1fr;
      grid-template-rows: repeat(1, 1fr);
    }
  }
  .modal_custom {
    margin-left: 0vw;
    overflow-y: scroll;
    overflow-x: auto;
    width: 100vw !important;
    top: 0 !important;
    left: 0 !important;
  }
}
</style>
