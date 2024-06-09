<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps<{
  title: string
  value: string
  showError?: boolean
  errorText?: string
  disable?: boolean
}>()

const isFocused = ref(false)
const emit = defineEmits<{
  (e: 'dataChange', value: string): void
}>()
const valueData = computed({
  get() {
    return props.value
  },
  set(value) {
    emit('dataChange', value)
  }
})
</script>
<template>
  <div class="case">
    <div
      class="label_box"
      :style="{ borderColor: props.showError ? 'red' : 'var(--vt-c-light-white)' }"
    >
      <label
        :for="title"
        :style="{
          top: isFocused || value ? '2px' : '10px',
          fontSize: isFocused || value ? '12px' : '16px'
        }"
        >{{ title }}</label
      >
      <input
        :id="title"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
        :style="{ border: 'none' }"
        v-model="valueData"
        :disabled="props.disable"
        autocomplete="off"
      />
    </div>
    <p v-if="props.showError" class="error_message">{{ props?.errorText }}</p>
  </div>
</template>
<style lang="scss" scoped>
.case {
  .label_box {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--vt-c-light-white);
    padding: 15px;
    border-radius: 10px;
    height: 50px;
    label {
      position: absolute;
      left: 15px;
      transition: 0.4s;
      color: var(--vt-c-bold-gray);
    }
    input {
      width: 100%;
      transition: 0.4s;
      border: none;
      outline: none;
      color: var(--vt-c-text-black);
      font-size: 16px;
    }
    &::after {
      content: '';
      text-align: right;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 15px;
      height: 3em;
      background: linear-gradient(to right, rgba(246, 247, 246, 0.144), rgba(227, 227, 227, 0.2));
      // filter: blur(1px);
      pointer-events: none;
    }
  }
  .error_message {
    font-size: 16px;
    font-weight: 600;
    color: red;
    padding-left: 5px;
  }
}
</style>
