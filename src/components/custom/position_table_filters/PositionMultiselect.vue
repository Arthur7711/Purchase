<script lang="ts" setup>
import MultiSelect from "primevue/multiselect";
import { onMounted, ref, watch } from "vue";
import BankImage from "../variableCommons/bankImage.vue";
import incoming_filters from "@/store/purchases_store/incoming_filters";
import usePositionFilters from "@/store/purchases_store/positionsFilter";
import usePaymentsFilters from "@/store/payments_store/paymentsFilter";
import useFilters from "@/store/purchases_store/filters";

const props = defineProps<{
  list: { id: string | number; name: string }[];
  placeholder: string;
  fieldName: string;
  tableName: string;
  incoming_selected?: string | number | boolean | (string | number)[];
}>();

const emit = defineEmits<{
  (e: "change", value: { id: string | number; name: string }[]): void;
}>();

const selectedOption = ref<{ id: string | number; name: string }[]>([]);

const updateFilters = () => {
  selectedOption.value = [];
  if (!props.incoming_selected) {
    let sel =
      props.tableName === "positions"
        ? (usePositionFilters.filters.value[props.fieldName] as [])
        : props.tableName === "payments"
        ? (usePaymentsFilters.filters.value[props.fieldName] as [])
        : props.tableName === "purchase"
        ? (useFilters.filtersPurch.value[props.fieldName] as [])
        : (useFilters.filtersFavourite.value[props.fieldName] as []);

    if (sel && sel.length && props.list) {
      props.list.forEach((el) => {
        sel.forEach((id) => {
          if (el.id == id) {
            selectedOption.value.push(el);
          }
        });
      });
    }
  } else {
    let sel = props.incoming_selected as (string | number)[];
    if (sel && sel.length && props.list) {
      props.list.forEach((el) => {
        sel.forEach((id) => {
          if (el.id == id) {
            selectedOption.value.push(el);
          }
        });
      });
    } else {
      selectedOption.value = [];
    }
  }
};

onMounted(() => {
  updateFilters();
});

watch(
  () => props.incoming_selected,
  () => {
    updateFilters();
  }
);

watch(
  () => props.list,
  () => {
    updateFilters();
  }
);
const updateSelectedOption = () => {
  emit("change", selectedOption.value);
};
</script>

<template>
  <div class="position_multiselect_filter_div_all">
    <div class="positions_dropdown_selection_multiselect">
      <MultiSelect
        :options="props.list"
        panelClass="purchtable_dropdown_selection_panel"
        optionLabel="name"
        :placeholder="props.placeholder"
        v-model="selectedOption"
        @change="updateSelectedOption"
        filter
      >
        <template #value v-if="selectedOption?.length">
          {{ $t("selected") }} {{ selectedOption.length }}
        </template>
        <template #option="{ option }"
          ><BankImage v-if="option?.bank_id" :bankName="option.bank_id" />{{
            option.name
          }}</template
        >
      </MultiSelect>
    </div>
  </div>
</template>

<style lang="scss">
.purchtable_dropdown_selection_panel {
  .p-checkbox-box {
    border: 1px #1565c0 solid !important;
    background-color: #ffffff !important;
    border-radius: 2px !important;
  }
  .p-highlight {
    border: none !important;
    background-color: #1565c0 !important;
  }
  .p-multiselect-item.p-highlight {
    background: rgba(190, 190, 190, 0.24) !important;
    color: black !important;
  }
  .p-focus {
    box-shadow: none !important;
  }
}

.p-multiselect {
  outline: none !important;
  box-shadow: none !important;
}

.positions_dropdown_selection_multiselect {
  min-width: 80%;
  max-width: 100%;
  //margin-left: 15px;
  .p-multiselect {
    border: none !important;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .p-multiselect-label {
    font-size: 14px;
    padding: 0.75rem 0;
  }
  .p-multiselect,
  .p-multiselect-label.p-placeholder {
    font-size: 14px;
    overflow: visible;
  }
  .p-multiselect-trigger {
    padding: 0 !important;
    overflow: hidden;
    width: 10px !important;
  }
  .p-multiselect,
  .p-multiselect-trigger {
    background: none;
    //margin-right: 5px;
  }
}
</style>
