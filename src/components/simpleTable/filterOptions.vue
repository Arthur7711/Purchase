<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { debounce } from "../../helpers/debounse";
import type { emittedValuePurch } from "./types";
import purchtableDropdown from "../custom/purch_table_filters/purchtableDropdown.vue";
import DropdownColorfulOptions from "../custom/purch_table_filters/DropdownColorfulOptions.vue";
import PurchPriceFilter from "../custom/purch_table_filters/PurchPriceFilter.vue";
import PurchTableOverlayDate from "../custom/purch_table_filters/purchTableOverlayDate.vue";
import useFilters from "../../store/purchases_store/filters";
import i18n_config from "@/locales/i18n_config";
import PurchTextFilter from "../custom/purch_table_filters/PurchTextFilter.vue";
import PositionMultiselect from "../custom/position_table_filters/PositionMultiselect.vue";

const props = defineProps<{
  field_name: string;
  placeholder: string;
  options: { id: number | string; name: string }[];
  specialist?: { id: string | number; name: string }[];
  dropdown_options?:
    | { id: string | number; name: string }[]
    | { id: string | number; name: string; entity_types: string[] }[]
    | null;
  table_type: string;
}>();

const emit = defineEmits<{
  (e: "update", value: any): void;
}>();

const { messages, locale } = i18n_config.global;
const items = ref();

const nameParams: { [key: string]: string[] } = {
  id: ["purchase_id", "ID"],
  specialist: ["specialist_ids", messages[locale]["purchaser"]],
  purchase_date: ["purchase_date", messages[locale]["order"]],
  comming_date: ["comming_date", messages[locale]["delivery"]],
  payings: ["payings", messages[locale]["payment"]],
  description: ["description", messages[locale]["description"]],
  payment_status: ["payment_status_ids", messages[locale]["payment status"]],
  "info.approve_status": ["approve_statuses", messages[locale]["agreement"]],
  "info.product_status": ["product_status_ids", messages[locale]["item status_2"]],
  "info.items_sum_price": ["price", messages[locale]["price"]],
  "info.payings_sum_price": ["paying_sum", messages[locale]["payment amount"]],
  contragent: ["contragent_ids", messages[locale]["supplier"]],
  legal_entity: ["legal_ids", messages[locale]["legal entity"]],
  payment_type: ["payment_type_ids", messages[locale]["payment type"]],
  card_holder: ["card_holder_ids", messages[locale]["cardholder"]],
  doc_closing_exists: ["type_document_ids", messages[locale]["documents"]],
  note: ["note", messages[locale]["note"]],
};

onMounted(() => {
  items.value = props.options.map((el) => el.name);
});

const debounsedEmit = debounce(function (v: emittedValuePurch) {
  emit("update", v);
}, 400);

const value = ref();

watch(value, () => {
  if (!value.value.length) {
    const val = { val: "", field_name: props.field_name };
    debounsedEmit(val);
  }
});

const handleSetPrice = (value: string | number) => {
  emit("update", { val: value, field_name: nameParams[props.field_name][0] });
};

const handleChange = (val: { val: any; field: string }) => {
  switch (val.field) {
    case "id":
    case "description":
    case "note":
      debounsedEmit({ val: val.val, field_name: nameParams[val.field][0] });
      break;

    case "payment_type":
    case "card_holder":
    case "doc_closing_exists":
    case "info.approve_status":
    case "info.product_status":
    case "specialist":
    case "legal_entity":
    case "contragent":
    case "payment_status":
      debounsedEmit({
        val: val.val?.map((el: { id: string | number; name: string }) => el.id),
        field_name: nameParams[val.field][0],
      });
      break;

    default:
      break;
  }
};

const handleCustomDate = (val: { dateTo: string; dateFrom: string }, name: string) => {
  switch (name) {
    case "payings":
      emit("update", { val: val.dateFrom, field_name: "paid_from" });
      emit("update", { val: val.dateTo, field_name: "paid_to" });
      break;
    case "comming_date":
      emit("update", { val: val.dateFrom, field_name: "delivered_from" });
      emit("update", { val: val.dateTo, field_name: "delivered_to" });
      break;
    default:
      break;
  }
};
</script>

<template>
  <div>
    <div
      v-if="field_name === 'id' || field_name === 'description' || field_name === 'note'"
    >
      <PurchTextFilter
        :class="
          field_name === 'description'
            ? 'purchtable_input_filter purchtable_input_filter_desc'
            : 'purchtable_input_filter'
        "
        :value="
          table_type === 'purchase'
            ? nameParams[field_name]
              ? useFilters.filtersPurch.value[nameParams[field_name][0]]
              : ''
            : nameParams[field_name]
            ? useFilters.filtersFavourite.value[nameParams[field_name][0]]
            : ''
        "
        :field_name="field_name"
        :placeholder="nameParams[field_name] ? nameParams[field_name][1] : ''"
        @change-value="handleChange($event)"
      />
    </div>
    <div
      v-else-if="
        (specialist !== undefined && field_name === 'specialist') ||
        field_name === 'contragent' ||
        field_name === 'legal_entity'
      "
    >
      <PositionMultiselect
        :table-name="table_type"
        :field-name="nameParams[field_name][0]"
        :placeholder="nameParams[field_name][1] || ''"
        :list="
          specialist !== undefined
            ? specialist
            : dropdown_options !== null && dropdown_options !== undefined
            ? dropdown_options
            : [{ id: 0, name: '' }]
        "
        @change="
          (val) => {
            handleChange({ val: val, field: field_name });
          }
        "
      />
    </div>
    <div
      v-else-if="
        dropdown_options?.length &&
        (field_name === 'payment_type' ||
          field_name === 'card_holder' ||
          field_name === 'doc_closing_exists' ||
          field_name === 'info.approve_status' ||
          field_name === 'payment_status' ||
          field_name === 'info.product_status')
      "
    >
      <purchtableDropdown
        :field-name="nameParams[field_name][0]"
        :placeholder="nameParams[field_name][1] || ''"
        :table-name="table_type"
        @change="(val) => handleChange({ val: val, field: field_name })"
        :options="dropdown_options || [{ id: 0, name: '' }]"
      />
    </div>
    <PurchTableOverlayDate
      v-else-if="field_name === 'payings' || field_name === 'comming_date'"
      :name="nameParams[field_name][1]"
      @change-cust-date="(val) => handleCustomDate(val, field_name)"
      @select-date="(val) => handleCustomDate(val, field_name)"
      :selected-value="
        table_type === 'purchase'
          ? field_name === 'payings'
            ? [
                useFilters.filtersPurch.value.paid_from,
                useFilters.filtersPurch.value.paid_to,
              ]
            : [
                useFilters.filtersPurch.value.delivered_from,
                useFilters.filtersPurch.value.delivered_to,
              ]
          : field_name === 'payings'
          ? [
              useFilters.filtersFavourite.value.paid_from,
              useFilters.filtersFavourite.value.paid_to,
            ]
          : [
              useFilters.filtersFavourite.value.delivered_from,
              useFilters.filtersFavourite.value.delivered_to,
            ]
      "
    />
    <PurchPriceFilter
      v-else-if="
        field_name === 'info.items_sum_price' || field_name === 'info.payings_sum_price'
      "
      :name="field_name"
      :placeholder="nameParams[field_name][1]"
      :filter-value="
        table_type === 'purchase'
          ? useFilters.filtersPurch.value[nameParams[field_name][0]]
          : useFilters.filtersFavourite.value[nameParams[field_name][0]]
      "
      @select="(val) => handleSetPrice(val)"
    />
    <div v-else-if="field_name === 'purchase_date'">
      <span style="font-size: 14px; color: #696969; font-weight: 400">
        {{ $t("order") }}</span
      >
    </div>
  </div>
</template>
<style lang="scss">
@import "./purchTable.scss";
</style>
