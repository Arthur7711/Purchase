<script lang="ts" setup>
import useUserInfo from "@/store/user";
import useIncomingFilters from "@/store/purchases_store/incoming_filters";
import SelectionSearchOptions from "@/components/custom/searcher_components/SelectionSearchOptions.vue";
import useFilters from "@/store/purchases_store/filters";
import { onMounted, ref, watch } from "vue";
import MultiselectPurchTableSearch from "./MultiselectPurchTableSearch.vue";
import i18n_config from "@/locales/i18n_config";

const props = defineProps<{
  tableType: string;
}>();

const { messages, locale } = i18n_config.global;

const filters = ref(useIncomingFilters.incomingFilters.value);
const namesParamsSelection: {
  paramFilter: string;
  paramOptions: string;
  locale: string;
}[] = [
  {
    paramFilter: "payment_status_ids",
    paramOptions: "payment_statuses",
    locale: messages[locale]["payment status"],
  },
  {
    paramFilter: "approve_statuses",
    paramOptions: "approve_statuses",
    locale: messages[locale]["agreement"],
  },
  {
    paramFilter: "product_status_ids",
    paramOptions: "product_statuses",
    locale: messages[locale]["item status_2"],
  },
  {
    paramFilter: "payment_type_ids",
    paramOptions: "payment_type_ids",
    locale: messages[locale]["payment type"],
  },
  {
    paramFilter: "type_document_ids",
    paramOptions: "document_types",
    locale: messages[locale]["documents"],
  },
  {
    paramFilter: "legal_ids",
    paramOptions: "legal_ids",
    locale: messages[locale]["legal entity"],
  },
];

const namesParamsMultiSelect = [
  {
    paramFilter: "contragent_ids",
    paramOptions: "contragent_ids",
    locale: messages[locale]["supplier"],
  },
  {
    paramFilter: "card_holder_ids",
    paramOptions: "card_holder_ids",
    locale: messages[locale]["cardholder"],
  },
];

watch(
  () => useIncomingFilters.incomingFilters.value,
  () => {
    filters.value = useIncomingFilters.incomingFilters.value;
  }
);

const handleChange = (val: (string | number)[], name: string) => {
  props.tableType === "purchase"
    ? useFilters.setFiltersPurch({ val: val, name: name })
    : useFilters.setFiltersFav({ val: val, name: name });
};
</script>

<template>
  <div class="purch-seacrh">
    <SelectionSearchOptions
      v-for="selection in namesParamsSelection"
      :key="selection.locale"
      :name="selection.locale"
      :options="filters[selection.paramOptions]"
      @change="(val) => handleChange(val, selection.paramFilter)"
      :incoming_selected="tableType === 'purchase' ? (useFilters.filtersPurch.value[ selection.paramFilter] as Array<(string | number)>) : (useFilters.filtersFavourite.value[ selection.paramFilter] as Array<(string | number)>)"
      :filter_name="selection.paramFilter"
    />

    <div class="purch-seacrh_wrapper">
      <MultiselectPurchTableSearch
        v-for="multiSelect in namesParamsMultiSelect"
        :key="multiSelect.locale"
        :options="filters[multiSelect.paramOptions]"
        :placeholder="multiSelect.locale"
        @change="(val) => handleChange(val, multiSelect.paramFilter)"
        @select_all="(val) => handleChange(val, multiSelect.paramFilter)"
        :incoming_selected="tableType === 'purchase' ? (useFilters.filtersPurch.value[ multiSelect.paramFilter] as Array<(string | number)>) : (useFilters.filtersFavourite.value[ multiSelect.paramFilter] as Array<(string | number)>)"
      />

      <button
        @click="
          () => {
            if (tableType === 'purchase') {
              useFilters.removeFiltersPurch();
            } else {
              useFilters.removeFiltersFav();
            }

            $emit('clear', '');
          }
        "
        class="purch-seacrh_wrapper__btn-clear"
      >
        {{ $t("reset") }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.purch-seacrh {
  display: flex;
  flex-direction: row;
  gap: 40px;
  margin-left: -12vw;
  margin-top: 36px;
  &_wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    &__btn-clear {
      display: flex;
      justify-content: flex-start;
      background: none;
      border: none;
      color: #1565c0;
    }
  }
}
</style>
