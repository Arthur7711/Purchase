<template>
  <div
    :class="['text-label-icon', className, { 'readonly-textlabel': readonly }]"
    :style="{
      border: border || '1px solid var(--vt-c-light-white)',
      borderRadius: border || '10px',
    }"
  >
    <div v-if="title" class="p-float-label">
      <InputText
        id="label"
        v-model="valueData"
        :readonly="readonly"
        :disabled="disabled"
      />
      <label for="label">{{ title }}</label>
    </div>
    <InputText
      v-else
      id="label"
      class="text-label-icon_input"
      v-model="valueData"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
    />
    <slot name="rightIcon"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title?: string;
  value: string | null;
  placeholder?: string;
  border?: string;
  className?: string;
  readonly?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "dataChange", value: string | null): void;
}>();
const valueData = computed({
  get() {
    return props.value;
  },
  set(value) {
    emit("dataChange", value);
  },
});
</script>

<style lang="scss" scoped>
.text-label-icon {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: none;
  padding: 15px;
  &.readonly-numberlabel {
    border: 1px dashed var(--vt-c-light-white) !important;
    color: rgb(73, 80, 87) !important;
  }
  &.readonly-textlabel {
    border: 1px dashed var(--vt-c-light-white) !important;
    color: rgb(73, 80, 87) !important;
    opacity: 0.7;
  }
  & > .p-float-label {
    width: 100%;
    & > label {
      left: 0;
    }
    & > input {
      width: 100%;
      background: none;
      border: none;
      outline: none;
      padding: 5px 0 0 0;
    }
  }
  &_input {
    width: 100%;
    background: none;
    border: none;
    outline: none;
    padding: 0;
  }
}
</style>
