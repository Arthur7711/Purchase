<template>
  <input
    v-model="inputValue"
    type="text"
    :style="
      field_name === 'sn'
        ? { width: '100px' }
        : field_name === 'item_name'
        ? { width: '88px' }
        : field_name === 'task_id'
        ? { width: '90px' }
        : field_name === 'purchase_id'
        ? { width: '66px' }
        : field_name === 'note'
        ? { width: '90px' }
        : ''
    "
    style="font-size: 13px; font-weight: 600"
    :placeholder="placeholder"
    @input="$emit('changeValue', { val: inputValue, field: field_name })"
  />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  value: string | number | boolean | (string | number)[] | null;
  field_name: string;
  placeholder: string;
}>();

const emit = defineEmits<{
  (
    e: "changeValue",
    value: { val: string | number | boolean | (string | number)[] | null; field: string }
  ): void;
}>();

const inputValue = ref<string | number | boolean | (string | number)[] | null>(null);

watch(
  () => props.value,
  () => {
    inputValue.value = props.value;
  }
);

onMounted(() => {
  inputValue.value = props.value;
});
</script>

<style lang="scss" scoped></style>
