<script lang="ts" setup>
import DropdownPrices from '@/components/dropdown_prices/DropdownPrices.vue';
import { onMounted, ref, watch } from 'vue';
import type { ITypesDrop } from '@/views/analistic/prices/types';
import { getTypesDropdata, getPositionSum, getLineData } from '@/api/gettersPrices';
import useError from '../../../store/errorPrices';
import useTypeId from '../../../store/typeId';
import useDateTo from '../../../store/dateTo';
import useDateFrom from '../../../store/dateFrom';
import useNameAnalyt from '../../../store/nameAnalyt';
import DataTablePosition from '@/components/dataTablePosition/dataTablePosition.vue';
import type { ILineChart, IPositionData, IDataItem, IDataTable, IPieCHartProps } from './types';
import router from '@/router';
import PieChartPosition from '@/components/charts/PieChartPosition.vue';
import { colors } from '../suppliers/colorConstants';
import useUserInfo from '../../../store/user';
import LineChartPosition from '../../../components/charts/LineChartPosition.vue';
import { useRoute } from 'vue-router';
import DropdownCurrency from '@/components/dropdown_prices/DropdownCurrency.vue';
import DropdownTypes from '@/components/dropdown_prices/DropdownTypes.vue';
import ProgressSpinner from 'primevue/progressspinner';
import i18n_config from '@/locales/i18n_config';
import { curFormatter } from '@/helpers/currencyFormatter';

const { locale, messages } = i18n_config.global;
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
const relatedIds = ref<number[]>([]);
const isLoading = ref<boolean>(false);
const selectedCurrency = ref();
const position = ref<IPositionData>({
  total: 0,
  data: [],
  id: 0,
  name: ''
});

const DataTable = ref<IDataTable[]>([]);
const PieChartData = ref<IPieCHartProps>({
  labels: [],
  datasets: [{ backgroundColor: [], data: [], borderColor: [] }]
});
const route = useRoute();
const LineChartData = ref<ILineChart>({
  items_count: 0,
  price_avg: 0,
  aux_price_avg: 0,
  labels: [],
  datasets: [
    {
      label: '',
      data: [
        {
          price_avg: 0,
          aux_price_avg: 0
        }
      ]
    }
  ]
});

const onlyPaid = ref<0 | 1 | '0' | '1'>(0);
const paidStatus = [
  { id: 0, name: messages[locale]['paid and scheduled'] },
  { id: 1, name: messages[locale].paid }
];

const changeType = (value: string | number) => {
  useTypeId.setTypeId(value);
};

const changeCurrency = (curr: string | number) => {
  selectedCurrency.value = curr;
};

const changeStatus = (stat: 0 | 1 | '0' | '1') => {
  onlyPaid.value = stat;
};

const getLineDatasets = async () => {
  await getLineData({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    typeId: useTypeId.typeId.value,
    id: route.params.id.toString(),
    related_ids: relatedIds.value[0] ? relatedIds.value : [0],
    only_paid: onlyPaid.value
  }).then(({ data }: { data: ILineChart }) => {
    LineChartData.value = {
      aux_price_avg: data.aux_price_avg,
      datasets: data.datasets,
      items_count: data.items_count,
      labels: data.labels,
      price_avg: data.price_avg
    };
  });
};

const getPosition = async () => {
  await getPositionSum({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    id: route.params.id.toString(),
    typeId: useTypeId.typeId.value ? useTypeId.typeId.value : undefined,
    only_paid: onlyPaid.value
  })
    .then(({ data }: { data: { data: IDataItem[]; total: number; id: number; name: string } }) => {
      position.value = data;
      PieChartData.value.datasets[0].backgroundColor = [];
      PieChartData.value.datasets[0].borderColor = [];
      PieChartData.value.datasets[0].data = [];
      DataTable.value = data.data.map((pieData, i) => {
        return {
          id: pieData.id,
          name: pieData.name,
          price_min: pieData.price_min,
          aux_price_min: pieData.aux_price_min,
          price_max: pieData.price_max,
          aux_price_max: pieData.aux_price_max,
          delivery_avg: pieData.delivery_avg,
          items_count: pieData.items_count,
          procent: ((pieData.items_count / data.total) * 100).toFixed(2) + ' %',
          color:
            i > colors.length ? '#' + Math.floor(Math.random() * 16777215).toString(16) : colors[i]
        };
      });

      if (PieChartData.value.labels.length) {
        PieChartData.value = {
          labels: [],
          datasets: [{ backgroundColor: [], data: [], borderColor: [] }]
        };
      }

      if (relatedIds.value.length) {
        relatedIds.value = [];
      }

      data.data.map((el, i) => {
        PieChartData.value.labels.push(el.name);
        relatedIds.value.push(el.id);
        PieChartData.value.datasets[0].backgroundColor.push(
          i > colors.length ? '#' + Math.floor(Math.random() * 16777215).toString(16) : colors[i]
        );
        PieChartData.value.datasets[0].borderColor.push(
          i > colors.length ? '#' + Math.floor(Math.random() * 16777215).toString(16) : colors[i]
        );
        PieChartData.value.datasets[0].data.push(Number(DataTable.value[i].procent.slice(0, -2)));
      });
    })
    .catch((err) => useError.setError(err.message));
};

const handleUpdataPieChart = (value: IDataItem[]) => {
  if (PieChartData.value.labels.length) {
    PieChartData.value = {
      labels: [],
      datasets: [{ backgroundColor: [], data: [], borderColor: [] }]
    };
  }
  relatedIds.value = [];
  value.map((el, i) => {
    PieChartData.value.labels.push(el.name);
    relatedIds.value.push(el.id);
    PieChartData.value.datasets[0].backgroundColor.push(el.color);
    PieChartData.value.datasets[0].borderColor.push(el.color);
    PieChartData.value.datasets[0].data.push(Number(value[i].procent.slice(0, -2)));
  });
  getLineDatasets();
};

onMounted(() => {
  useError.error.value = '';
  isLoading.value = true;
  getPosition();
  getLineDatasets();
  isLoading.value = false;
});

watch(
  () => [
    useTypeId.typeId.value,
    useDateFrom.dateFrom.value,
    useDateTo.dateTo.value,
    useNameAnalyt.itemId.value,
    onlyPaid.value
  ],
  () => {
    getPosition();
  }
);
</script>

<template>
  <div class="position_div_all" v-if="!useError.error.value && !isLoading">
    <div class="position_div_top">
      <span class="position_span_one" @click="$router.push(`/analytics/prices`)"
        >{{ $t('price change analysis') }}
        <img src="../../../components/icons/chevron-right.svg" alt=">" />
      </span>
      <div class="position_div_span_second">
        <span class="position_span_second items-text">{{ position?.name }}</span>
      </div>
    </div>
    <div class="position_div_center">
      <h2>{{ position?.name }}</h2>
      <div class="position_div_right-buttongroup">
        <DropdownTypes @change-event="changeType" v-if="useTypeId.allTypes.value">
          <template #icon
            ><img src="../../../components/icons/typeIcon.svg" alt="v" />
            <p>&nbsp;&nbsp;{{ $t('types_2') }}&nbsp;</p>
          </template></DropdownTypes
        >
        <DropdownPrices @change-event="changeStatus" :drop-types="paidStatus">
          <template #icon>
            <img src="../../../components/icons/clock.svg" alt="" />
            <p>&nbsp;&nbsp;{{ $t('payment status') }}&nbsp;</p>
          </template>
        </DropdownPrices>
        <DropdownCurrency @change-event="changeCurrency" :drop-types="currencyInfo">
          <template #icon>
            <img src="../../../components/icons/money.svg" alt="" />
            <p>&nbsp;&nbsp;{{ $t('currency') }}&nbsp;</p>
          </template>
        </DropdownCurrency>
      </div>
    </div>
    <div class="position_div_middle_graph">
      <DataTablePosition
        @select-product="handleUpdataPieChart"
        :currency="selectedCurrency"
        v-if="position?.data && DataTable"
        :currency-info="currencyInfo"
        class="datatable_position"
        :def-products="DataTable as IDataItem[]"
        :total-count="position.total"
      ></DataTablePosition>
      <div class="pie_chart_position_div">
        <PieChartPosition
          v-if="PieChartData.labels.length"
          :graph-chart="PieChartData"
        ></PieChartPosition>
      </div>
    </div>
    <div class="position_div_undertable">
      <div>
        <h3>{{ LineChartData.items_count }}</h3>
        <span>{{ $t('number of items') }}</span>
      </div>
      <div class="position_div_footer_second">
        <h3 v-if="!Number(useUserInfo.userCurrency.value)">
          {{ curFormatter(LineChartData.price_avg) }}
          {{
            currencyInfo[0].title.slice(-2) === 'YN'
              ? currencyInfo[0].title.slice(-3)
              : currencyInfo[0].title.slice(-2)
          }}
        </h3>
        <h3 v-else-if="Number(useUserInfo.userCurrency.value)">
          {{ curFormatter(LineChartData.aux_price_avg) }} {{ currencyInfo[1].title.slice(-2) }}
        </h3>
        <span>{{ $t('average price') }}</span>
      </div>
    </div>
    <div class="line_chart_position_div" style="max-width: 55vw">
      <LineChartPosition
        :currency-info="currencyInfo"
        :currency="selectedCurrency"
        :graph-chart="LineChartData"
        v-if="LineChartData.datasets.length"
      />
    </div>
  </div>
  <div v-else-if="useError.error.value && !isLoading">
    <h1>{{ useError.error }}</h1>
  </div>
  <div class="position_loader" v-else-if="!useError.error.value && isLoading">
    <ProgressSpinner />
  </div>
</template>

<style lang="scss">
@import 'positionPage';
</style>
