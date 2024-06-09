<script lang="ts" setup>
import Search from "@/components/icons/Search.vue";
import PurchaseTableSearch from "./PurchaseTableSearch.vue";
import { ref, watch } from "vue";
import useFilters from "@/store/purchases_store/filters";
import usePositionFilters from "@/store/purchases_store/positionsFilter";
import usePaymentsFilters from "@/store/payments_store/paymentsFilter";
import PositionTableSearcher from "./PositionTableSearcher.vue";
import PaymentsTableSearcher from "./PaymentsTableSearcher.vue";

const props = defineProps<{
  table_type: string;
}>();
const input_value = ref<string>("");

const handleClick = () => {
  switch (props.table_type) {
    case "purchase":
      useFilters.setFiltersPurch({ val: input_value.value, name: "description" });
      break;
    case "favourite":
      useFilters.setFiltersFav({ val: input_value.value, name: "description" });
      break;
    case "position":
      usePositionFilters.setPositionsFilters({ val: input_value.value, name: "name" });
      break;
    case "payments":
      usePaymentsFilters.setPaymentFilters({
        val: input_value.value,
        name: "description",
      });
      break;
    default:
      break;
  }
};

watch(
  () => props.table_type,
  () => {
    input_value.value = "";
  }
);
</script>

<template>
  <div>
    <div class="table_top_searcher_div_all">
      <div class="table_top_searcher_div_searchgroup" style="display: flex">
        <input
          v-model="input_value"
          class="table_top_searcher_input_search"
          :placeholder="$t('search')"
          type="text"
        />
        <button @click="handleClick" class="table_top_searcher_button_search">
          <Search :color="'white'" />
          {{ $t("search") }}
        </button>
        <img @click="$emit('close', false)" src="../../icons/closer-x.svg" alt="X" />
      </div>
      <div v-show="table_type === 'purchase' || table_type === 'favourite'">
        <PurchaseTableSearch @clear="input_value = ''" :table-type="table_type" />
      </div>
      <div v-show="table_type === 'position'">
        <PositionTableSearcher @clear="input_value = ''" />
      </div>
      <div v-show="table_type === 'payments'">
        <PaymentsTableSearcher @clear="input_value = ''" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "./tableTopSearcher.scss";
</style>
