<script setup lang="ts">
import ScreenParams from '@/store/screen';
import { onBeforeUnmount, onMounted } from 'vue';

const props = defineProps<{
  visible: boolean;
  widthSize?: string | '600px';
  gapDialogWrapper?: string | '18px';
  styleWrapper?: { [key: string]: string };
}>();
const emit = defineEmits<{
  (e: 'close', value: boolean): void;
}>();
const closePopup = () => {
  emit('close', !props.visible);
};

onMounted(() => {
  document.body.style.position = 'fixed';
});

onBeforeUnmount(() => {
  document.body.style.position = '';
});
</script>
<template>
  <div
    :class="$style['dialog']"
    @click="closePopup"
    :style="{ display: visible ? 'block' : 'none' }"
  >
    <div
      :class="$style['dialog-wrapper']"
      @click="
        (e) => {
          e.stopPropagation();
        }
      "
      :style="{
        width: widthSize,
        gap: gapDialogWrapper,
        ...styleWrapper
      }"
    >
      <div :class="$style['dialog-wrapper_header']">
        <h2 :class="$style['dialog-wrapper_header__title']">
          <slot name="title"></slot>
          <button
            v-if="ScreenParams.screenParams.width < 650"
            :class="$style['dialog-wrapper_header__actions--close']"
            @click="closePopup"
          >
            Close
          </button>
        </h2>

        <div :class="$style['dialog-wrapper_header__actions']">
          <slot name="actions"></slot>
          <button
            v-if="ScreenParams.screenParams.width > 650"
            :class="$style['dialog-wrapper_header__actions--close']"
            @click="closePopup"
          >
            <img alt="cross" src="../../components/icons/xmark.svg" />
          </button>
        </div>
      </div>
      <slot name="content"></slot>
    </div>
  </div>
</template>
<style module lang="scss" scoped>
@import '../../assets/colors.scss';
.dialog {
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 1001;
  height: 100vh;
  left: 0px;
  top: 0px;
  &-wrapper {
    position: fixed;
    z-index: 1001;
    height: 90%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff;
    // backdrop-filter: blur(7.5px);
    border-radius: 15px;
    padding: 24px 32px 32px 32px;
    &_header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__title {
        padding-left: 18px;
      }
      &__actions {
        display: flex;
        align-items: center;
        gap: 24px;
        &--close {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 10px;
          height: 16px;
          background: none;
          border: none;
          outline: none;
          opacity: 0.8;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 650px) {
  .dialog {
    overflow: hidden;
    &-wrapper {
      min-height: 100vh;
      border-radius: 0;
      &_header {
        padding-right: 2%;
        padding-top: 10%;
        display: flex;
        flex-direction: column;
        &__actions {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding-bottom: 2%;
          &--close {
            background-color: $purch_blue;
            width: 160px;
            font-size: 17px;
            padding: 2%;
            border-radius: 12px;
            height: 2rem;
            color: white;
          }
        }
      }
    }
  }
}
</style>
