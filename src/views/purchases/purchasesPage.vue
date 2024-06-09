<script lang="ts" setup>
import purchaseHeader from '@/components/header/purchaseHeader.vue';
import PurchasesTable from '@/components/simpleTable/purchasesTable.vue';
import { onMounted, ref, watch } from 'vue';
import useFilters from '@/store/purchases_store/filters';
import usePurchasesInfo from '@/store/purchases_store/purchases';
import usePurchDateTo from '../../store/purchases_store/purchDateTo';
import usePurchDateFrom from '../../store/purchases_store/purchDateFrom';
import PositionsTable from '@/components/simpleTable/positionsTable.vue';

import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import CurtailedContentPurchases from '@/views/purchases/components/cards/CurtailedContentPurchases.vue';

const selectedTable = ref('purchase');
const headerData = ref<{
  summ: string | number;
  aux_summ: string | number;
  purch_count: string | number;
  activatedTotalPrice: string | number;
  activatedTotalUSD: string | number;
}>({ summ: 0, aux_summ: 0, purch_count: 0, activatedTotalPrice: 0, activatedTotalUSD: 0 });
const favUpdate = ref('value');
const favClick = (val: string) => {
  favUpdate.value = val;
};

const router = useRouter();
const route = useRoute();

const queryUrls = ref<any>({});
const datesQuery = ref<{ [key: string]: string | number | undefined }>({});
const queryCurrTab = ref<LocationQuery>({});

watch(
  () => [
    usePurchDateFrom.dateFormat.value,
    usePurchDateFrom.dateFrom.value,
    usePurchDateTo.dateTo.value
  ],
  (dates) => {
    const isAllTime = usePurchDateFrom.dateFrom.value === '0001-01-01';
    datesQuery.value = {
      date: isAllTime ? 3 : usePurchDateFrom.dateFormat.value || undefined,
      date_from: !isAllTime ? dates[1] : undefined,
      date_to: !isAllTime ? dates[2] : undefined
    };

    router.replace({
      query: {
        ...route.query,
        ...datesQuery.value,
        table_type: selectedTable.value
      }
    });

    queryUrls.value[selectedTable.value] = route.query;
  }
);

watch(
  () => selectedTable.value,
  () => {
    if (route.query.table_type) {
      queryUrls.value[route.query.table_type as string] = route.query;
    }

    queryCurrTab.value = queryUrls.value[selectedTable.value]
      ? queryUrls.value[selectedTable.value]
      : {};
  }
);

watch(
  () => queryCurrTab.value,
  () => {
    router.replace({
      query: {
        ...queryCurrTab.value,
        ...datesQuery.value,
        table_type: selectedTable.value
      }
    });
  },
  {
    deep: true
  }
);

watch(
  () => usePurchasesInfo.curtailedPurchases.value,
  (value) => {
    usePurchasesInfo.setLocaleStorageCurtailedPurchase(value);
  },
  {
    deep: true
  }
);

watch(
  () => usePurchasesInfo.curtailedPositions.value,
  (value) => {
    usePurchasesInfo.setLocaleStorageCurtailedPosition(value);
  },
  {
    deep: true
  }
);

onMounted(() => {
  usePurchasesInfo.getLocaleStorageCurtailedPurchase();
  usePurchasesInfo.getLocaleStorageCurtailedPosition();
});
</script>

<template>
  <div class="purchpage_div_all">
    <div class="purchase_upper_labels">
      <purchaseHeader
        @select-table="
          (val) => {
            selectedTable = val;
          }
        "
        :top_data="headerData"
        :hard_update="favUpdate"
        :query="route.query?.table_type ? route.query : null"
      />
    </div>
    <div v-if="selectedTable === 'purchase'">
      <PurchasesTable
        @fav_click="favClick"
        :table-type="selectedTable"
        @update_top_data="(value) => (headerData = value)"
        :query="route.query"
      />
    </div>
    <div v-else-if="selectedTable === 'position'">
      <PositionsTable
        :table-type="selectedTable"
        @update_top_data="(value) => (headerData = value)"
        :query="route.query"
      />
    </div>
    <div v-else-if="selectedTable === 'favourite'">
      <PurchasesTable
        :table-type="selectedTable"
        v-if="selectedTable === 'favourite'"
        @update_top_data="(value) => (headerData = value)"
        :query="route.query"
      />
    </div>
  </div>
  <CurtailedContentPurchases v-if="usePurchasesInfo.curtailedPurchases.value.length" />
</template>

<style lang="scss">
@import "./purchpage.scss";
</style>
