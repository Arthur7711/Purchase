<template>
  <div
    :class="['text-area-label', className, { 'readonly-textarealabel': readonly }]"
    :style="{
      border: border || '1px solid var(--vt-c-light-white)',
      borderRadius: border || '10px',
    }"
  >
    <div class="p-float-label">
      <i
        v-if="clearable && value && value.length"
        class="cross-btn mdi mdi-close"
        @click="clear"
      ></i>
      <Textarea id="label" v-model="valueData" :readonly="readonly" rows="5" cols="30" />
      <label for="label">{{ title }}</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title: string;
  value: string | null | undefined;
  border?: string;
  className?: string;
  readonly?: boolean;
  clearable?: boolean; // возможность очищения
}>();

const emit = defineEmits<{
  (e: "dataChange", value: string | null): void;
}>();
const valueData = computed({
  get() {
    return props.value || undefined;
  },
  set(value) {
    emit("dataChange", value || null);
  },
});

const clear = () => {
  emit("dataChange", null);
};
</script>

<style lang="scss" scoped>
.text-area-label {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  background: none;
  padding: 15px;
  &.readonly-textarealabel {
    border: 1px dashed var(--vt-c-light-white) !important;
  }
  .cross-btn {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: -10px;
    &:hover {
      color: #1565c0;
    }
  }
  & > .p-float-label {
    width: 100%;
    height: 100%;
    & > textarea ~ label {
      top: 6%;
    }
    & > input:focus ~ label,
    & > input.p-filled ~ label,
    & > textarea:focus ~ label,
    & > textarea.p-filled ~ label,
    & > .p-inputwrapper-focus ~ label,
    & > .p-inputwrapper-filled ~ label {
      top: -1% !important;
    }
    & > label {
      left: 0;
    }
    & > textarea {
      width: 100%;
      height: 100%;
      background: none;
      border: none;
      outline: none;
      padding: 0;
    }
  }
}
</style>
