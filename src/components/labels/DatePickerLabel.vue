<script setup lang="ts">
import { ref, computed } from 'vue'
import CalendarLabelIcon from '../icons/CalendarLabelIcon.vue'
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
    <div class="label_box" :style="{ borderColor: showError ? 'red' : 'var(--vt-c-light-white)' }">
      <label
        class="text_label"
        :for="title"
        :style="{
          top: isFocused || value ? '0px' : '10px',
          fontSize: isFocused || value ? '12px' : '16px'
        }"
        >{{ title }}</label
      >
      <Calendar
        v-model="valueData"
        :inputId="title"
        class="calendar_label"
        dateFormat="yy-mm-dd"
        :disabled="props.disable"
      />
      <label :for="title" class="calendar_icon">
        <CalendarLabelIcon />
      </label>
    </div>
    <p v-if="props.showError" class="error_message">{{ props?.errorText }}</p>
  </div>
</template>
<style lang="scss">
.case {
  .label_box {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--vt-c-light-white);
    padding: 15px;
    border-radius: 10px;
    label {
      z-index: 10;
      position: absolute;
      transition: 0.4s;
    }
    .text_label {
      left: 15px;
      color: var(--vt-c-bold-gray);
    }
    .calendar_icon {
      left: 90%;
    }
    .calendar_label {
      height: 22px;
      input {
        width: 100%;
        transition: 0.4s;
        border: none;
        outline: none;
        color: var(--vt-c-text-black);
        font-size: 16px;
      }
      input:focus {
        box-shadow: none !important;
      }
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
