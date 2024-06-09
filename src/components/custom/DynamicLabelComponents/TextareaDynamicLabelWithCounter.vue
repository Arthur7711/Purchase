<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  label: string;
  maxlength?: number;
  resizeble?: boolean;
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();
const hideLabel = ref(false);
const value = ref<string>(props.modelValue);
const maxLength = props.maxlength ? props.maxlength : 10000;
const handleInput = (e: string) => {
  if (e.length <= maxLength) {
    value.value = e;
    emit('change', value.value);
  }
};

watch(
  () => props.modelValue,
  () => {
    if (value.value !== props.modelValue) {
      value.value = props.modelValue;
    }
  }
);
</script>

<template>
  <div>
    <div class="textarea_label_div_content">
      <textarea
        name="textarea_dynamic"
        :maxlength="maxLength"
        @scroll="(e) => {
          if((e.target as HTMLElement)!.scrollTop !== 0 && !hideLabel) {
            hideLabel = true
          } else if((e.target as HTMLElement)!.scrollTop === 0 && hideLabel) {
            hideLabel = false
          }
          }"
        v-model="value"
        id="textarea_dynamic"
        class="textarea_label_textarea"
        :style="!resizeble ? { resize: 'none' } : ''"
        placeholder=" "
        @input="(e:any) => handleInput(e.target.value)"
      ></textarea>
      <label
        :style="!hideLabel ? { opacity: '1' } : { opacity: '0' }"
        class="textarea_label_label"
        for="textarea_dynamic"
        ><span>{{ label }}</span
        ><span
          :style="value.length === maxLength ? { color: 'red' } : ''"
          v-if="value.length && maxLength !== 10000"
          >{{ value.length }}/{{ maxlength }}</span
        ></label
      >
    </div>
  </div>
</template>

<style lang="scss">
.textarea_label_textarea {
  min-height: 76px;
  padding: 15px 15px 15px 10px;
  border-radius: 10px;
  border: 1px solid var(--mono-divider, #e3e3e3);
  background: var(--mono-white, #fff);
  outline: none;
}
.textarea_label_div_content {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  margin-top: -27px !important;
  padding: 0%;
  padding-right: 4%;
}

.textarea_label_label {
  color: #999;
  transform: translateY(2rem);
  margin-left: 10px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  transition: all 0.3s ease-in-out;
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
}

.textarea_label_textarea:focus ~ .textarea_label_label,
.textarea_label_textarea:not(:placeholder-shown) ~ .textarea_label_label {
  transform: translateY(1.3rem);
  font-size: 12px;
}
</style>
