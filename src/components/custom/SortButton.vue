<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ArrowUp from "../icons/ArrowUp.vue";

const props = defineProps<{
  field_name: string;
  active: boolean;
  startSort?: string;
}>();
const emit = defineEmits<{
  (e: "select-dir", value: { field: string; dir: string }): void;
}>();
const order_dir = ref<string>("");
const selectedSorting = ref("");

const handleDir = (field: string) => {
  if (selectedSorting.value.split("--")[0] !== field) {
    order_dir.value = "asc";
    selectedSorting.value = props.field_name + "--" + order_dir.value;
  } else {
    order_dir.value = order_dir.value === "asc" ? "desc" : "asc";
    selectedSorting.value = props.field_name + "--" + order_dir.value;
  }

  emit("select-dir", { field: props.field_name, dir: order_dir.value });
};

onMounted(() => {
  order_dir.value = props.startSort || "desc";

  selectedSorting.value = props.field_name + "--" + order_dir.value;
});
</script>

<template>
  <button
    @click="() => handleDir(field_name)"
    :style="
      selectedSorting.split('--')[0] === field_name
        ? selectedSorting.split('--')[1] === 'desc'
          ? { rotate: '-1980deg' }
          : { rotate: '-3600deg' }
        : ''
    "
    style="
      background: none;
      border: none;
      transition: all 2s ease-in-out;
      margin-left: 4px;
    "
  >
    <ArrowUp :active="active" />
  </button>
</template>
