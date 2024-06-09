<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
const props = defineProps<{
  title: string;
  values: { name: string; id: number | string | null }[];
  selectedValue: string;
  showError?: boolean;
  errorText?: string;
  disable?: boolean;
}>();
const selectedItem = ref();
const isFocused = ref(false);
const emit = defineEmits<{
  (e: 'dataChange', value: string): void;
}>();

watch(selectedItem, () => {
  if (selectedItem.value?.id) {
    emit('dataChange', selectedItem.value.id);
  }
});
watch(
  () => props.selectedValue,
  () => {
    selectedItem.value = props.values.find((el) => el.id === props.selectedValue);
  }
);
onMounted(() => {
  if (props.selectedValue) {
    selectedItem.value = props.values.find((el) => el.id === props.selectedValue);
  }
});
</script>
<template>
  <div class="case">
    <div class="label_box" :style="{ borderColor: showError ? 'red' : 'var(--vt-c-light-white)' }">
      <label
        :for="title"
        :style="{
          display: selectedValue ? 'block' : 'none',
          top: isFocused || selectedValue ? '2px' : '10px',
          fontSize: isFocused || selectedValue ? '12px' : '16px'
        }"
      >
        {{ title }}
      </label>
      <Dropdown
        v-model="selectedItem"
        :options="values"
        optionLabel="name"
        class="dropdown_label"
        :inputClass="!selectedValue ? 'dropdown_label_span' : 'dropdown_label_active_span'"
        :style="{ height: selectedValue ? '30px' : '22px' }"
        :id="title"
        :placeholder="title"
        :disabled="props.disable"
      />
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
    height: 50px;
    label {
      position: absolute;
      left: 15px;
      transition: 0.4s;
      color: var(--vt-c-bold-gray);
    }
    .dropdown_label {
      width: 100%;
      transition: 0.4s;
      height: 100%;
      border: none !important;
      outline: none;
      display: flex;
      align-items: center;
      .dropdown_label_span {
        color: var(--vt-c-bold-gray);
        font-size: 16px;
        padding: 0px 5px 5px 0px;
      }
      .dropdown_label_active_span {
        color: var(--vt-c-text-black);
        font-size: 16px;
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
