<script setup lang="ts">
import purchaseHeader from '@/components/header/purchaseHeader.vue';
import PaymentsTable from '@/components/simpleTable/PaymentsTable.vue';
import usePurchDateTo from '@/store/purchases_store/purchDateTo';
import usePurchDateFrom from '@/store/purchases_store/purchDateFrom';
import useActiveTable from '@/store/purchases_store/activeTable';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const favUpdate = ref('');
const headerData = ref({
  summ: 1,
  aux_summ: 1,
  purch_count: 1,
  activatedTotalPrice: 1,
  activatedTotalUSD: 1
});

const router = useRouter();
const route = useRoute();
const datesQuery = ref<{ [key: string]: string | number | undefined }>({});

watch(
  () => [usePurchDateFrom.dateFrom.value, usePurchDateTo.dateTo.value],
  (dates) => {
    const isAllTime = usePurchDateFrom.dateFrom.value === '0001-01-01';

    datesQuery.value = {
      date: isAllTime ? 3 : undefined,
      date_from: !isAllTime ? dates[0] : undefined,
      date_to: !isAllTime ? dates[1] : undefined
    };

    router.replace({
      query: {
        ...route.query,
        ...datesQuery.value,
        table_type: 'payments'
      }
    });
  }
);
</script>

<template>
  <div class="paymentspage_div_all">
    <div class="paymentspage_div_header">
      <purchaseHeader
        :top_data="headerData"
        :hard_update="favUpdate"
        :name="'payments'"
        :query="route.query"
      />
    </div>
    <div>
      <PaymentsTable />
    </div>
  </div>
</template>

<style lang="scss">
@import './paymentsPage.scss';
</style>
