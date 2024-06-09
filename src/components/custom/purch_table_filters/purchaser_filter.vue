<script lang="ts" setup>
import MultiSelect from "primevue/multiselect";
import { onMounted, ref } from "vue";
import useFilters from "../../../store/purchases_store/filters";

const props = defineProps<{
  options: { id: string | number; name: string }[];
  placeholder: string;
  fieldName: string;
  tableType: string;
}>();
const selectedOption = ref<{ id: string | number; name: string }[]>([]);

onMounted(() => {
  let sel =
    props.tableType === "purchase"
      ? (useFilters.filtersPurch.value[props.fieldName] as [])
      : (useFilters.filtersFavourite.value[props.fieldName] as []);

  if (sel && sel.length) {
    props.options.forEach((el: { id: string | number; name: string }) => {
      sel.forEach((id) => {
        if (el.id == id) {
          selectedOption.value.push(el);
        }
      });
    });
  }
});
</script>

<template>
  <div class="purchaser_filter_div_all">
    <div
      :class="
        fieldName === 'specialist_ids'
          ? 'purchtable_dropdown_selection_purchaser'
          : 'purchtable_dropdown_selection_contragent'
      "
    >
      <MultiSelect
        :options="options"
        panelClass="purchtable_dropdown_selection_panel"
        optionLabel="name"
        :placeholder="placeholder"
        v-model="selectedOption"
        filter
      >
        <template #value v-if="selectedOption?.length">
          {{ $t("selected") }} {{ selectedOption.length }}
        </template>
        <template #closeicon>
          <span
            @click="
              (e) => {
                e.stopPropagation();
                $emit('change', selectedOption);
              }
            "
            >&#10004;</span
          >
        </template>
      </MultiSelect>
    </div>
  </div>
</template>

<style lang="scss">
@import "./purchtable_filters.scss";
</style>
