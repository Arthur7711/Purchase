<script setup lang="ts">
import BlueDropdownIcon from '../../../components/icons/BlueDropdownIcon.vue';
import DropdownIcon from '../../../components/icons/DropdownIcon.vue';
import { onMounted, ref, watch } from 'vue';
import useUserInfo from '../../../store/user';
import { getSupplierTypesSummary } from '../../../api/suppliersPage';
import { useRoute } from 'vue-router';
import SupplierPageTable from '../../../components/simpleTable/SupplierPageTable.vue';
import PieChart from '../../../components/charts/PieChart.vue';
import type { ITypesSummary } from './types';
import type { ISupplierPageTable } from '../../../components/simpleTable/types';
import { colors } from '../../../views/analistic/suppliers/colorConstants';
import { getRandomColor } from '../../../helpers/randomColor';
import type { IPieCHartProps } from '../../../components/charts/types';
import {
  firstDateOfMonth,
  lastDateOfMonth,
  sixMonthsEarlier,
  lastYear
} from '../../../helpers/getDatesRange';
import useTableSelection from '../../../store/selectedTableItem';
import i18n_config from '@/locales/i18n_config';

const { locale, messages } = i18n_config.global;
const route = useRoute();
const offeredPossitions = ref([
  { id: 1, title: messages[locale].month, date_from: firstDateOfMonth, date_to: lastDateOfMonth },
  {
    id: 2,
    title: messages[locale]['six months'],
    date_from: sixMonthsEarlier,
    date_to: firstDateOfMonth
  },
  { id: 3, title: messages[locale].year, date_from: lastYear, date_to: firstDateOfMonth },
  { id: 0, title: messages[locale]['all time'], date_from: '0001-01-01', date_to: '0001-01-01' }
]);
const selectedPossition = ref<{ id: number; title: string; date_from: string; date_to: string }>(
  offeredPossitions.value[3]
);
const currencyInfo = ref([
  {
    id: 0,
    title:
      useUserInfo.userCurrency.value === 'BYN'
        ? messages[locale]['Belarusian ruble BYN']
        : useUserInfo.userCurrency.value === 'AMD'
        ? messages[locale]['Armenian dram ֏']
        : messages[locale]['Russian ruble ₽']
  },
  { id: 1, title: messages[locale]['US dollar $'] }
]);
const selectedCurrency = ref<{ id: number; title: string }>();
const paymentTypes = ref([
  { id: 0, title: messages[locale]['paid and scheduled'] },
  { id: 1, title: messages[locale].paid }
]);
const selectedpayment = ref<{ id: number; title: string }>();
const summaryTypes = ref<ITypesSummary>({ total: 0, data: [] });
const tableData = ref<ISupplierPageTable[]>([]);
const selectedTableData = ref<ISupplierPageTable[]>([]);
const chartData = ref<IPieCHartProps>({
  labels: [],
  datasets: [
    {
      backgroundColor: [],
      data: [],
      purchases_count: [],
      borderColor: [],
      procents: []
    }
  ]
});

const generatePieData = () => {
  chartData.value.labels = selectedTableData.value.map((el) => el.name);
  chartData.value.datasets = [
    {
      backgroundColor: [],
      data: [],
      purchases_count: [],
      borderColor: [],
      procents: []
    }
  ];
  selectedTableData.value.forEach((el) => {
    chartData.value.datasets[0].backgroundColor.push(el.color);
    chartData.value.datasets[0].borderColor.push(el.color);
    chartData.value.datasets[0].procents.push(
      Number(((el.sum / summaryTypes.value.total) * 100).toFixed(1))
    );
    chartData.value.datasets[0].purchases_count.push(el.count);
    chartData.value.datasets[0].data.push(el.sum);
  });
};
const getChartData = async () => {
  await getSupplierTypesSummary({
    contragent_id: `${route.params.id}`,
    date_from: selectedPossition.value.date_from,
    date_to: selectedPossition.value.date_to,
    only_paid: selectedpayment.value?.id || 0
  }).then(({ data }: { data: ITypesSummary }) => {
    summaryTypes.value = data;
    tableData.value = data.data.map((el, i) => {
      return {
        id: el.id,
        count: el.items_count,
        name: el.name,
        sum: selectedCurrency.value?.id !== 1 ? el.price_sum : el.aux_price_sum,
        procent: !data.total
          ? '0%'
          : Number(((el.price_sum / data.total) * 100).toFixed(1)) < 0.1
          ? '> 0.1%'
          : ((el.price_sum / data.total) * 100).toFixed(1) + '%',
        color: i > colors.length ? getRandomColor() : colors[i]
      };
    });
    selectedTableData.value = tableData.value;
    generatePieData();
  });
};
const tableInfoChange = () => {
  tableData.value = summaryTypes.value.data.map((el, i) => {
    return {
      id: el.id,
      count: el.items_count,
      name: el.name,
      sum: selectedCurrency.value?.id !== 1 ? el.price_sum : el.aux_price_sum,
      procent: !summaryTypes.value.total
        ? '0%'
        : Number(((el.price_sum / summaryTypes.value.total) * 100).toFixed(1)) < 0.1
        ? '> 0.1%'
        : ((el.price_sum / summaryTypes.value.total) * 100).toFixed(1) + '%',
      color: i > colors.length ? getRandomColor() : colors[i]
    };
  });
  selectedTableData.value = tableData.value;
};
onMounted(async () => {
  currencyInfo.value =
    useUserInfo.userCurrency.value !== 'USD'
      ? [
          {
            id: 0,
            title:
              useUserInfo.userCurrency.value === 'BYN'
                ? messages[locale]['Belarusian ruble BYN']
                : useUserInfo.userCurrency.value === 'AMD'
                ? messages[locale]['Armenian dram ֏']
                : messages[locale]['Russian ruble ₽']
          },
          { id: 1, title: messages[locale]['US dollar $'] }
        ]
      : [{ id: 1, title: messages[locale]['US dollar $'] }];
  selectedCurrency.value = currencyInfo.value[0];

  await getChartData();
});
watch(useUserInfo.userCurrency, async () => {
  currencyInfo.value =
    useUserInfo.userCurrency.value !== 'USD'
      ? [
          {
            id: 0,
            title:
              useUserInfo.userCurrency.value === 'BYN'
                ? messages[locale]['Belarusian ruble BYN']
                : useUserInfo.userCurrency.value === 'AMD'
                ? messages[locale]['Armenian dram ֏']
                : messages[locale]['Russian ruble ₽']
          },
          { id: 1, title: messages[locale]['US dollar $'] }
        ]
      : [{ id: 1, title: messages[locale]['US dollar $'] }];
  selectedCurrency.value = currencyInfo.value[0];
  await getChartData();
});
watch([selectedPossition, selectedpayment], () => {
  getChartData();
});
watch(selectedTableData, () => {
  generatePieData();
});
watch(selectedCurrency, () => {
  tableInfoChange();
});
</script>
<template>
  <div class="chart_supplier_container">
    <div class="head_flex">
      <div class="title_container">
        <h3>{{ $t('statistics by procurement type for') }}</h3>
        <Dropdown
          class="supplier_chart_dropdown"
          :options="offeredPossitions"
          v-model="selectedPossition"
          optionLabel="title"
          panelClass="supplier_date"
        >
          <template #dropdownicon>
            <BlueDropdownIcon />
          </template>
          <template #value="{ value }">
            <p style="color: var(--vt-c-electric-blue); font-size: 20px; font-weight: 600">
              {{ value.title }}
            </p></template
          >
        </Dropdown>
      </div>
      <div class="supplier_dropdowns_chart_group">
        <Dropdown
          class="supplier_chart_dropdown"
          :options="paymentTypes"
          v-model="selectedpayment"
          optionLabel="title"
          panelClass="supplier_date"
        >
          <template #dropdownicon>
            <DropdownIcon />
          </template>
          <template #value="{ value }">
            <p style="color: var(--vt-c-text-black); font-size: 14px; font-weight: 600">
              {{ selectedpayment ? value.title : $t('payment status') }}
            </p></template
          >
        </Dropdown>
        <Dropdown
          class="supplier_chart_dropdown"
          :options="currencyInfo"
          v-model="selectedCurrency"
          optionLabel="title"
          panelClass="supplier_date"
        >
          <template #dropdownicon>
            <DropdownIcon />
          </template>
          <template #value="{ value }">
            <p style="color: var(--vt-c-text-black); font-size: 14px; font-weight: 600">
              {{ selectedCurrency ? value.title : $t('currency') }}
            </p></template
          >
        </Dropdown>
      </div>
    </div>
    <div class="table_chart">
      <div class="table_chart_div_table">
        <SupplierPageTable
          :date_from="selectedPossition.date_from"
          :date_to="selectedPossition.date_to"
          :products="tableData"
          :selectedProduct="selectedTableData"
          :currency="
            selectedCurrency?.title
              ? selectedCurrency?.title.slice(-2)
              : useUserInfo.userCurrency.value === 'USD'
              ? '$'
              : currencyInfo[0].title.slice(-2)
          "
          :key="selectedTableData.length + Number(selectedCurrency?.id)"
          @select-product="selectedTableData = $event"
        />
      </div>
      <div class="chart_container_div_chart">
        <PieChart
          :graphChart="chartData"
          :currency="
            selectedCurrency?.title
              ? selectedCurrency?.title.slice(-2)
              : useUserInfo.userCurrency.value === 'USD'
              ? '$'
              : currencyInfo[0].title.slice(-2)
          "
          chartSize="300px"
          :key="chartData.labels.length + useTableSelection.checkedIndex.value"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.chart_supplier_container {
  width: 100%;
  height: 380px;
  padding: 24px 24px 28px 24px;
  border-radius: 15px;
  gap: 36px;
  box-shadow: 0px 0px 22px 7px #d8dae066;
  background: var(--vt-c-white);
  overflow-y: auto;
  .head_flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title_container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        font-size: 20px;
        font-weight: 600;
        line-height: 20px;
      }
    }
    .supplier_chart_dropdown {
      border: none;
    }
  }
  .table_chart {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
}
.supplier_date {
  .p-dropdown-items-wrapper {
    .p-dropdown-items {
      padding: 8px;
      .p-dropdown-item {
        border-radius: 7px;
        height: 30px;
        display: flex;
        align-items: center;
        color: var(--vt-c-text-black);
      }
      .p-highlight {
        background: #66666633 !important;
        color: var(--vt-c-text-black);
      }
    }
  }
}
.table_chart_div_table {
  width: 60%;
}
@media only screen and (max-width: 650px) {
  .chart_supplier_container {
    width: 98vw;
    overflow: scroll;
    display: flex;
    padding: 0;
    flex-direction: column;
  }
  .head_flex {
    flex-direction: column;
  }
  .title_container > h3 {
    font-size: 16px !important;
  }
  .supplier_dropdowns_chart_group {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .table_chart {
    display: flex;
    flex-direction: column;
    padding: 0 !important;
  }
  .table_chart_div_table {
    width: 105vw !important;
    overflow: hidden;
    margin-left: -5vw;
  }
  .chart_container_div_chart {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
  }
}
</style>
