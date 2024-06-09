<script setup lang="ts">
import { debounce } from '@/helpers/debounse'
import { ref, watch } from 'vue'

const props = defineProps<{
  label: string
  show_hr: boolean
  inputType?: string
  disable?: boolean
  debTimer?: number
  modelValue: string
  label_style?: { [key: string]: string }
}>()

const emit = defineEmits<{
  (e: 'change', value: string): void
  (e: 'blur', value: Event): void
}>()
const el = ref()
const inputValue = ref(props.modelValue)
const focus = ref(false)
const debEmitter = debounce(
  function () {
    emit('change', inputValue.value)
  },
  props.debTimer ? props.debTimer : 0
)

watch(
  () => props.modelValue,
  () => {
    if (inputValue.value !== props.modelValue) {
      inputValue.value = props.modelValue
    }
  }
)

const handleChange = () => {
  if (props.inputType === 'number') {
    inputValue.value = inputValue.value
      .split('')
      .filter(
        (el: string, i: number) =>
          Number(el) || (i === 0 && el === '-') || el === '.' || Number(el) === 0
      )
      .join('')
  }
  debEmitter()
}
</script>

<template>
  <div
    class="input_label_div_all"
    @click="
      () => {
        el.focus()
      }
    "
  >
    <div style="display: flex; flex-direction: column-reverse; padding-left: 3%">
      <input
        :disabled="disable"
        :placeholder="' '"
        v-model="inputValue"
        type="text"
        id="input_text"
        ref="el"
        class="input_label_input"
        @input="() => handleChange()"
        @blur="(e) => $emit('blur', e)"
      />
      <label for="input_text" :style="label_style" class="input_label_label">{{ label }}</label>
    </div>
    <div style="display: flex; justify-content: center; align-items: center">
      <hr v-if="show_hr" class="input_label_hr" />
      <div>
        <slot name="currency"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.input_label_div_all {
  height: 50px;
  border-radius: 10px;
  width: 100%;
  border: 1px solid var(--mono-divider, #e3e3e3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input_label_input {
  border: none;
  height: 30px;
  outline: none;
  // padding-left: 5px;
  font-size: 14px;
  width: 100%;
  opacity: 0;
  margin-bottom: 25px;
  z-index: 0;
}

.input_label_input:disabled {
  background-color: #99999900;
  color: #999;
  font-weight: 500;
  font-size: 16px;
}

.input_label_input:focus,
.input_label_input:not(:placeholder-shown) {
  opacity: 1;
}

.input_label_input:focus ~ .input_label_label,
.input_label_input:not(:placeholder-shown) ~ label {
  transform: translateY(0.5rem);
  color: var(--mono-grey, #999);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  z-index: 10;
}

.input_label_label {
  // padding: 1px;
  transform: translateY(1.6rem);
  // padding-left: 5px;
  transition: all 0.3s ease-in;
  color: var(--mono-grey, #999);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  z-index: -1;
}

.input_label_hr {
  height: 30px;
  margin-right: 5px;
  border: #99999944 0.1px solid;
}
</style>
