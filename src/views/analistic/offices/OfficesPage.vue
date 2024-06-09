<script lang="ts" setup>
import { getOfficesOverview, getOfficesTableData, type IOfficesOverview } from '@/api/offices';
import OfficesOfficeContainer from '../../../components/custom/OfficesOfficeContainer.vue';
import dateFrom from '@/store/dateFrom';
import dateTo from '@/store/dateTo';
import useOffices from '../../../store/offices_store/offices_purposes';
import { onMounted, ref, watch } from 'vue';
import { colors } from '../../../components/custom/lightColors';
import type { IOfficeTableData } from '../../../api/offices';
import OfficesTable from '@/components/simpleTable/OfficesTable.vue';
import ChartBar from '@/components/icons/ChartBar.vue';
import TableIcon from '@/components/icons/TableIcon.vue';
import BarChart from '@/components/charts/BarChart.vue';
import type { IBarChartProps } from '@/components/charts/types';
import LoaderWithMorphism from '@/components/custom/LoaderWithMorphism.vue';
import { debounce } from '@/helpers/debounse';
import useUserInfo from '../../../store/user';
import ScreenParams from '@/store/screen';
import { debouncedWatch } from '@vueuse/core';
import officeId from '@/store/officeId';
import { useRoute, useRouter } from 'vue-router';

const officesInfo = ref<IOfficesOverview[] | null>(null);
const tableData = ref<IOfficeTableData | null>(null);
const selectedOffices = ref<number[] | null>();
const mounted = ref(false);
const showChart = ref('table');
const loading = ref(false);
const backgroundColor = ref<{ [key: string]: string }>({ color: '1' });
const router = useRouter();
const route = useRoute();
const barChartData = ref<IBarChartProps>({
  labels: [],
  datasets: [
    {
      data: [],
      label: ''
    }
  ]
});

const setSelectOffices = (id: number) => {
  selectedOffices.value?.includes(id)
    ? (selectedOffices.value = selectedOffices.value.filter((el) => el !== id))
    : selectedOffices.value?.push(id);
  useOffices.setSelectedOffices(selectedOffices.value ? selectedOffices.value : null);
};

const debGetOfficeOverview = debounce(function () {
  getOfficesOverview(dateFrom.dateFrom.value, dateTo.dateTo.value).then((res) => {
    officesInfo.value = res.data;
  });
}, 350);

const setChartData = () => {
  if (tableData.value) {
    barChartData.value = {
      labels: [],
      datasets: [
        {
          data: [],
          label: ''
        }
      ]
    };
    barChartData.value.labels = tableData.value.labels.map((el) => el.name);
    tableData.value.datasets.map((el, i) => {
      barChartData.value.datasets[i] = {
        label: el.label.name,
        data: el.data.map((elem) => elem.per_staff_aux_price_sum),
        backgroundColor: backgroundColor.value[el.label.name]
      };
    });
  }
  loading.value = false;
};

onMounted(async () => {
  queueMicrotask(() => router.push(router.currentRoute.value));
  await getOfficesOverview(dateFrom.dateFrom.value, dateTo.dateTo.value).then((res) => {
    officesInfo.value = res.data;
  });
  useOffices.setSelectedOffices(officesInfo.value ? officesInfo.value?.map((el) => el.id) : null);
  selectedOffices.value = officesInfo.value ? officesInfo.value?.map((el) => el.id) : null;
  mounted.value = true;
});

watch(
  () => [dateFrom.dateFrom.value, dateTo.dateTo.value],
  async () => {
    if (mounted.value) {
      debGetOfficeOverview();
    }
  }
);

watch(
  () => [
    useOffices.selectedPurposes.value,
    useOffices.selectedOffices.value,
    dateFrom.dateFrom.value,
    dateTo.dateTo.value,
    selectedOffices.value?.length,
    useUserInfo.userData.value?.location
  ],
  async () => {
    if (mounted.value) {
      loading.value = true;
      await getOfficesTableData({
        date_to: dateTo.dateTo.value,
        date_from: dateFrom.dateFrom.value,
        offices_ids: useOffices.selectedOffices.value ? useOffices.selectedOffices.value : null,
        purpose_ids: useOffices.selectedPurposes.value ? useOffices.selectedPurposes.value : null
      }).then((res) => {
        tableData.value = res.data;
        res.data.datasets.map((el, i) => {
          if (!backgroundColor.value[el.label.name]) {
            backgroundColor.value[el.label.name] = colors[i];
          }
        });
      });
      setChartData();
    }
  }
);

debouncedWatch(
  () => [
    dateFrom.dateFrom.value,
    dateTo.dateTo.value,
    useOffices.selectedOffices.value,
    useOffices.selectedPurposes.value
  ],
  () => {
    router.push(
      `/analytics/offices?${
        useOffices?.selectedOffices.value
          ? '&offices=' +
            useOffices?.selectedOffices.value.map((el) => encodeURIComponent(el)).join(',')
          : ''
      }${
        useOffices.selectedPurposes.value
          ? '&purposes=' +
            useOffices.selectedPurposes.value.map((el) => encodeURIComponent(el)).join(',')
          : ''
      }&date_from=${encodeURIComponent(dateFrom.dateFrom.value)}&date_to=${encodeURIComponent(
        dateTo.dateTo.value
      )}`
    );
  }
);
</script>

<template>
  <div class="offices_page_div_all">
    <div class="offices_page_div_top">
      <h2 class="offises_page_top_title">{{ $t('cost per employee by office') }}</h2>
      <div class="offices_page_top_officesgroup">
        <OfficesOfficeContainer
          v-for="office in officesInfo"
          :key="office.id"
          :id="office.id"
          :background_color="backgroundColor[office.name]"
          :aux_expenses="office.per_staff_aux_price_sum"
          :cust_aux="Number(office.staff_avg).toFixed(0)"
          :name="office.name"
          :percent_down="Number(office.percent_per_staff_aux_price_sum).toFixed(0)"
          @select-office="() => setSelectOffices(office.id)"
        />
      </div>
      <div style="display: flex; justify-content: flex-end; margin-bottom: -90px">
        <button class="officespage_button_selector" @click="showChart = 'table'">
          <TableIcon :active="showChart === 'table'" />
        </button>
        <button class="officespage_button_selector" @click="showChart = 'chart'">
          <ChartBar :selected="showChart === 'chart'" />
        </button>
      </div>
      <LoaderWithMorphism :show="loading" />
      <div v-if="showChart === 'table'" class="officepage_div_top_table">
        <div class="officepage_div_top_table_spangroup">
          <div style="width: 360px">
            <span
              style="
                color: var(--mono-grey, #999);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                margin-left: 15px;
                margin-right: -15px;
                line-height: 18px;
              "
              >{{ $t('goals') }}</span
            >
            <div style="width: 300px"></div>
          </div>
          <div class="officepage_div_top_table_spangroup_labels" v-if="tableData">
            <div
              class="officepage_div_top_table_spangroup_labels_mapper"
              v-for="office in tableData.datasets"
              :key="office.label.id"
              style="display: flex"
            >
              <span class="officepage_div_top_table_spangroup_labels_labels"
                >{{
                  office.label.name === 'Saint-Petersburg'
                    ? $t('SPB')
                    : office.label.name === 'Minsk'
                      ? $t('Minsk')
                      : office.label.name === 'Yerevan'
                        ? $t('Yerevan')
                        : office.label.name === 'Global'
                          ? 'Global'
                          : 'Bytex'
                }}
                <h5
                  style="
                    color: var(--mono-grey, #999);
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 18px;
                  "
                >
                  {{ $t('costs') }} $
                </h5>
              </span>
            </div>
          </div>
        </div>
        <div class="offices_page_div_table" v-if="tableData">
          <OfficesTable
            v-for="(data, i) in tableData.labels"
            :index="i"
            :label="data.name"
            :label_id="data.id"
            :table-data="tableData.datasets"
            :key="data.id"
          />
        </div>
      </div>
      <div v-else-if="showChart === 'chart'" class="officepage_div_chart_container">
        <BarChart v-if="barChartData" :chart-size="'80vw'" :chart-data="barChartData" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './officesPage.scss';
</style>
