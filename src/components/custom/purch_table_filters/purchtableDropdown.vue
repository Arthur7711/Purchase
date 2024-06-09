<script lang="ts" setup>
import MultiSelect from "primevue/multiselect";
import { onMounted, ref, watch } from "vue";
import usePaymentsFilters from "@/store/payments_store/paymentsFilter";
import useFilters from "@/store/purchases_store/filters";
import usePositionsFilters from "@/store/purchases_store/positionsFilter";
import BankImage from "../variableCommons/bankImage.vue";
import { colorizeApproveStatus } from "@/helpers/colorize_paying_status";
import { colorizeProductStatus } from "@/helpers/colorize_paying_status";
import { colorizePayingStatus } from "@/helpers/colorize_paying_status";

const props = defineProps<{
  options: {
    id: string | number;
    name?: string;
    bank_id?: string;
    description?: string;
  }[];
  selectedFilters?: {
    id: string | number;
    name?: string;
    bank_id?: string;
    description?: string;
  }[];
  placeholder: string;
  fieldName: string;
  tableName: string;
  incoming_selected?: string | number | boolean | (string | number)[];
}>();
const emit = defineEmits<{
  (
    e: "select",
    value: {
      id: string | number;
      name?: string;
      bank_id?: string;
      description?: string;
    }[]
  ): void;

  (
    e: "change",
    value: {
      id: string | number;
      name?: string;
      bank_id?: string;
      description?: string;
    }[]
  ): void;
}>();

const selected = ref<
  { id: string | number; name?: string; bank_id?: string; description?: string }[]
>([]);

const updateFilters = () => {
  if (!props.incoming_selected) {
    let sel =
      props.tableName === "payments"
        ? (usePaymentsFilters.filters.value[props.fieldName] as [])
        : props.tableName === "positions"
        ? (usePositionsFilters.filters.value[props.fieldName] as [])
        : props.tableName === "purchase"
        ? (useFilters.filtersPurch.value[props.fieldName] as [])
        : (useFilters.filtersFavourite.value[props.fieldName] as []);

    sel = sel && sel.sort((a, b) => a - b);

    if (sel && sel.length) {
      props.options.forEach((el) => {
        sel.forEach((id) => {
          if (el.id == id) {
            selected.value.push(el);
          }
        });
      });
    }
  } else {
    let sel = props.incoming_selected as (string | number)[];

    selected.value = [];
    if (sel && sel.length) {
      props.options.forEach((el) => {
        sel.forEach((id) => {
          if (el.id == id) {
            selected.value.push(el);
          }
        });
      });
    } else {
      selected.value = [];
    }
  }
};

watch(
  () => selected.value,
  (value) => {
    emit("select", value);
  },
  { deep: true }
);

watch(
  () => props.selectedFilters,
  (value) => {
    if (value) selected.value = value;
  },
  { deep: true }
);

watch(
  () => props.incoming_selected,
  () => updateFilters()
);

onMounted(() => {
  if (
    props.fieldName !== "creators" &&
    props.fieldName !== "payingType" &&
    props.fieldName !== "docType"
  ) {
    updateFilters();
  }
});
</script>

<template>
  <div
    :class="[
      'purchtable_dropdown_selection',
      placeholder === $t('agreement') && fieldName !== 'approval'
        ? 'purchtable_dropdown_selection_approve'
        : placeholder === $t('payment status')
        ? 'purchtable_dropdown_selection_paystat'
        : placeholder === $t('cardholder')
        ? 'purchtable_dropdown_selection_cardhold'
        : placeholder === 'item status_2'
        ? 'purchtable_dropdown_selection_positions_status'
        : placeholder === $t('status')
        ? 'purchtable_dropdown_selection_pos_status'
        : '',
    ]"
  >
    <MultiSelect
      v-model="selected"
      display="chip"
      :options="options"
      optionLabel="name"
      panelClass="purchtable_dropdown_selection_panel"
      :placeholder="placeholder"
      @change="emit('change', selected)"
    >
      <template v-if="selected" #value>
        {{ selected.length ? $t("selected") + " " + selected.length : placeholder }}
      </template>
      <template #option="options">
        <div
          v-for="option in options"
          :key="option.id"
          :style="
            placeholder === $t('agreement')
              ? { color: colorizeApproveStatus(option.id)?.color ?? '' }
              : placeholder === $t('item status_2') || placeholder === $t('status')
              ? { color: colorizeProductStatus(option.id)?.color ?? '' }
              : placeholder === $t('payment status')
              ? { color: colorizePayingStatus(option.id) }
              : ''
          "
        >
          <div style="display: flex; justify-content: center; align-items: center">
            <BankImage v-if="option?.bank_id" :bankName="option.bank_id" />
            <span> {{ option?.description || option.name }}</span>
          </div>
        </div>
      </template>
    </MultiSelect>
  </div>
</template>

<style lang="scss">
.purchtable_dropdown_selection {
  min-width: 105px;
  max-width: 105px;
  // margin-left: -1px;
  & > .p-multiselect {
    border: none !important;
    display: flex !important;
  }
  .p-multiselect-label {
    font-size: 14px;
  }
  .p-multiselect .p-multiselect-label {
    padding: 0 !important;
  }

  .p-multiselect,
  .p-multiselect-label.p-placeholder {
    font-size: 14px;
    min-width: 110px;
    max-width: 110px;
    overflow: visible;
    display: flex;
  }
  .p-multiselect-trigger {
    padding: 0 !important;
    overflow: hidden;
    width: 10px !important;
    // margin-right: 30px;
  }
  .p-multiselect,
  .p-multiselect-trigger {
    background: none;
  }
}

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

.purchtable_dropdown_selection_purchaser {
  min-width: 100px;
  max-width: 100px;
  // margin-left: -1px;
  & > .p-multiselect {
    border: none !important;
    display: flex !important;
  }
  .p-multiselect-label {
    font-size: 14px;
  }
  .p-multiselect,
  .p-multiselect-label.p-placeholder {
    font-size: 14px;
    min-width: 100px;
    max-width: 100px;
    // margin-left: -10px;
    // margin-right: -30px;
    overflow: visible;
  }
  .p-multiselect-trigger {
    padding: 0 !important;
    overflow: hidden;
    width: 10px !important;
    margin-right: 20px;
  }
  .p-multiselect,
  .p-multiselect-trigger {
    background: none;
    margin-right: 5px;
  }
}

.purchtable_dropdown_selection_card_holder {
  .p-multiselect,
  .p-multiselect-label.p-placeholder {
    font-size: 14px;
    min-width: 105px;
    max-width: 105px;
    //  margin-left: -10px;
    overflow: visible;
  }
  .p-multiselect-trigger {
    padding: 0 !important;
    overflow: hidden;
    width: 10px !important;
    // margin-right: -10px;
  }
}

.p-multiselect-label-container {
  display: flex;
  max-width: 90px;
}

.purchtable_dropdown_selection_approve {
  margin: 0;
  // margin-left: 9px !important;
}

.purchtable_dropdown_selection_paystat {
  margin: 0;
  // margin-left: 10px !important;
}

.purchtable_dropdown_selection_cardhold {
  // margin-left: 10px !important;
  overflow: visible;
  .p-multiselect-trigger {
    padding: 0 !important;
    overflow: visible;
    width: 10px !important;
    // margin-left: 0px;
    // margin-right: -10px;
  }
}

.purchtable_dropdown_selection_cardholder {
  min-width: 105px;
  max-width: 105px;
  margin-left: 0px !important;
  & > .p-multiselect {
    border: none !important;
    display: flex !important;
  }
  .p-multiselect-label {
    font-size: 14px;
  }
  .p-multiselect,
  .p-multiselect-label.p-placeholder {
    font-size: 14px;
    min-width: 110px;
    max-width: 110px;
    //margin-left: -10px;
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
    //margin-left: 10px !important;
  }
}

.purchtable_dropdown_selection_legal {
  min-width: 105px;
  max-width: 105px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  & > .p-multiselect {
    border: none !important;
    display: flex !important;
  }
  .p-multiselect-label {
    font-size: 14px;
  }
  .p-multiselect,
  .p-multiselect-label.p-placeholder {
    font-size: 14px;
    min-width: 110px;
    max-width: 110px;
    //margin-left: -10px;
    overflow: visible;
  }
  .p-multiselect-trigger {
    padding: 0 !important;
    overflow: hidden;
    width: 10px !important;
    //margin-right: 4px;
  }
  .p-multiselect,
  .p-multiselect-trigger {
    background: none;
  }
}

.purchtable_dropdown_selection_contragent {
  min-width: 105px;
  max-width: 105px;
  //margin-left: 8px;
  & > .p-multiselect {
    display: flex !important;
    border: none !important;
  }
  .p-multiselect-label {
    font-size: 14px;
  }
  .p-multiselect,
  .p-multiselect-label.p-placeholder {
    font-size: 14px;
    min-width: 110px;
    max-width: 110px;
    //margin-left: -10px;
    overflow: visible;
  }
  .p-multiselect-trigger {
    padding: 0 !important;
    overflow: hidden;
    width: 10px !important;
    //margin-right: 4px;
  }
  .p-multiselect,
  .p-multiselect-trigger {
    background: none;
  }
}

.purchtable_dropdown_selection_pos_status {
  min-width: 105px;
  max-width: 105px;
  //margin-left: 0px;
  & > .p-multiselect {
    border: none !important;
    display: flex !important;
  }
  .p-multiselect-label {
    font-size: 14px;
  }
  .p-multiselect,
  .p-multiselect-label.p-placeholder {
    font-size: 14px;
    min-width: 110px;
    display: flex;
    max-width: 110px;
    overflow: visible;
  }
  .p-multiselect-trigger {
    padding: 0 !important;
    overflow: hidden;
    width: 10px !important;
    //margin-right: 4px;
  }
  .p-multiselect,
  .p-multiselect-trigger {
    background: none;
    //margin-right: 10px;
  }
}

.purchaser_filter_div_all {
  max-width: 90px;
  .p-dropdown .p-dropdown-clear-icon {
    right: 10px;
  }
  .p-fluid,
  .p-inputtext {
    font-size: 14px;
  }
}

.p-inputwrapper-focus {
  border: none !important;
  box-shadow: none;
}

.p-multiselect:not(.p-disabled).p-focus {
  border: none !important;
  box-shadow: none;
}

.purchtable_dropdown_selection_positions_status {
  //margin-left: 10px;
}
</style>
