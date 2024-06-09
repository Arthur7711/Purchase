<template>
  <div
    :class="['text-label-icon', className, { 'readonly-numberlabel': readonly }]"
    :style="{
      border: !readonly
        ? border || '1px solid var(--vt-c-light-white)'
        : border || '1px dashed var(--vt-c-light-white)',
      borderRadius: border || '10px'
    }"
  >
    <div class="p-float-label">
      <InputNumber
        id="label"
        :readonly="readonly"
        v-model="valueData"
        :minFractionDigits="!isInteger ? 2 : 0"
        :maxFractionDigits="!isInteger ? 2 : 0"
      />
      <label for="label">{{ title }}</label>
    </div>
    <slot name="rightIcon"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: number | null;
  border?: string;
  readonly?: boolean;
  className?: string;
  isInteger?: boolean;
}>();

const emit = defineEmits<{
  (e: 'dataChange', value: number): void;
}>();
const valueData = computed({
  get() {
    return props.value;
  },
  set(value) {
    emit('dataChange', value === null ? 0 : value);
  }
});
</script>

<style lang="scss">
.text-label-icon {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: none;
  padding: 15px;
  &.readonly-numberlabel {
    color: rgb(73, 80, 87) !important;
    opacity: 0.7;
  }
  & > .p-float-label {
    width: 100%;
    & > label {
      left: 0 !important;
    }
    & > .p-inputnumber > input {
      width: 100%;
      background: none;
      border: none;
      outline: none;
      padding: 5px 0 0 0;
    }
  }
}
</style>
