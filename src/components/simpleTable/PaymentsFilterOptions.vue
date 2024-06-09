<script setup lang="ts">
import { ref } from "vue";
import SortButton from "../custom/SortButton.vue";
import type { ICommonDefault } from "@/store/purchases_store/commons";
import PurchtableDropdown from "../custom/purch_table_filters/purchtableDropdown.vue";
import PositionFilterOptions from "./PositionFilterOptions.vue";
import PositionMultiselect from "../custom/position_table_filters/PositionMultiselect.vue";
import usePaymentsFilters from "@/store/payments_store/paymentsFilter";
import i18n_config from "@/locales/i18n_config";
import PurchTextFilter from "../custom/purch_table_filters/PurchTextFilter.vue";
import PurchPriceFilter from "../custom/purch_table_filters/PurchPriceFilter.vue";

const props = defineProps<{
  field_name: string;
  selected_sort: {
    field: string;
    dir: string;
  };
  options: { id: string | number; name: string }[];
}>();
const inputValue = ref("");
const { messages, locale } = i18n_config.global;

const nameParams: { [key: string]: string[] } = {
  purchase_id: ["purchase_id", messages[locale]["purchase ID"]],
  "purchase.contragent": ["contragent_ids", messages[locale]["supplier"]],
  note: ["note", messages[locale]["note"]],
  price: ["price", messages[locale]["price"]],
  debited_price: ["debited_price", messages[locale]["currency amount"]],
  "purchase.description": ["description", messages[locale]["description"]],
  "purchase.payment_type": ["payment_type_ids", messages[locale]["payment type"]],
  "purchase.legal_entity": ["legal_ids", messages[locale]["legal entity"]],
  paying_type: ["paying_type_ids", messages[locale]["payment method"]],
  "purchase.card_holder": ["card_holder_ids", messages[locale]["cardholder"]],
  date: ["date", messages[locale]["date"]],
  "purchase.payment_status": ["payment_status_ids", messages[locale]["payment status"]],
};

const handleChange = (val: { val: any; field: string }) => {
  switch (val.field) {
    case "purchase_id":
      usePaymentsFilters.setPaymentFilters({ val: val.val, name: "purchase_id" });
      break;
    case "purchase.contragent":
      usePaymentsFilters.setPaymentFilters({
        val: val.val.map((el: { id: string | number }) => el.id),
        name: "contragent_ids",
      });
      break;
    case "purchase.legal_entity":
      usePaymentsFilters.setPaymentFilters({
        val: val.val.map((el: { id: string | number }) => el.id),
        name: "legal_ids",
      });
      break;
    case "debited_price":
      usePaymentsFilters.setPaymentFilters({ val: val.val, name: "debited_price" });
      break;
    case "purchase.description":
      usePaymentsFilters.setPaymentFilters({ val: val.val, name: "description" });
      break;
    case "price":
      usePaymentsFilters.setPaymentFilters({ val: val.val, name: "price" });
      break;
    case "purchase.payment_status":
      usePaymentsFilters.setPaymentFilters({
        val: val.val.map((el: { id: string | number }) => el.id),
        name: "payment_status_ids",
      });
      break;
    case "purchase.card_holder":
      usePaymentsFilters.setPaymentFilters({
        val: val.val.map((el: { id: string | number }) => el.id),
        name: "card_holder_ids",
      });
      break;
    case "purchase.payment_type":
      usePaymentsFilters.setPaymentFilters({
        val: val.val.map((el: { id: string | number }) => el.id),
        name: "payment_type_ids",
      });
      break;
    case "paying_type":
      usePaymentsFilters.setPaymentFilters({
        val: val.val.map((el: { id: string | number }) => el.id),
        name: "paying_type_ids",
      });
      break;
    case "note":
      usePaymentsFilters.setPaymentFilters({ val: val.val, name: "note" });
      break;
    default:
      break;
  }
};
</script>

<template>
  <div
    style="display: flex; justify-content: flex-start; font-size: 14px; margin-left: 15px"
  >
    <div
      v-if="
        field_name === 'purchase_id' ||
        field_name === 'note' ||
        field_name === 'purchase.description'
      "
      style="display: flex"
      :class="
        'payment_input_' +
        (field_name.includes('.') ? field_name.split('.')[1] : field_name)
      "
    >
      <PurchTextFilter
        style="font-weight: 600; font-size: 13px"
        :style="field_name === 'purchase_id' ? { width: '67px' } : ''"
        class="position_input_filter"
        :value="usePaymentsFilters.filters.value[nameParams[field_name][0]]"
        :field_name="field_name"
        :placeholder="nameParams[field_name][1] || ''"
        @change-value="handleChange($event)"
      />
    </div>

    <PurchPriceFilter
      v-else-if="field_name === 'debited_price' || field_name === 'price'"
      :name="field_name"
      :placeholder="nameParams[field_name][1] || ''"
      :filter-value="usePaymentsFilters.filters.value[field_name]"
      @select="(val) => handleChange({ val: val, field: field_name })"
    >
      <template #sort>
        <SortButton
          :startSort="selected_sort.field === field_name ? selected_sort.dir : undefined"
          :field_name="field_name"
          :active="selected_sort.field === field_name"
          @select-dir="(val) => $emit('sel_sort', val)"
        />
      </template>
    </PurchPriceFilter>
    <PositionMultiselect
      v-else-if="
        field_name === 'purchase.contragent' ||
        field_name === 'purchase.legal_entity' ||
        field_name === 'purchase.payment_type' ||
        field_name === 'paying_type' ||
        field_name === 'purchase.card_holder'
      "
      :table-name="'payments'"
      :field-name="nameParams[field_name][0]"
      :placeholder="nameParams[field_name][1] || ''"
      :incoming_selected="usePaymentsFilters.filters.value[nameParams[field_name][0]]"
      :list="options"
      style="margin-left: -15px"
      @change="(val) => handleChange({ val: val, field: field_name })"
    />
    <div v-else-if="field_name === 'date'" style="display: flex">
      <span style="font-size: 14px; color: #666666; font-weight: 400">{{
        nameParams[field_name][1]
      }}</span>
      <SortButton
        :startSort="selected_sort.field === field_name ? selected_sort.dir : undefined"
        :field_name="field_name"
        :active="selected_sort.field === field_name"
        @select-dir="(val) => $emit('sel_sort', val)"
      />
    </div>
    <div
      style="margin-left: -15px"
      v-else-if="field_name === 'purchase.payment_status' && options.length"
    >
      <PurchtableDropdown
        :field-name="nameParams[field_name][0]"
        :placeholder="nameParams[field_name][1] || ''"
        :options="options"
        :table-name="'payments'"
        :incoming_selected="usePaymentsFilters.filters.value[nameParams[field_name][0]]"
        @change="(val) => handleChange({ val: val, field: field_name })"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import "./paymentFilterOptions.scss";
</style>
