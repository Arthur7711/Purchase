<script setup lang="ts">
import Clock from '../../../components/icons/Clock.vue'
import Money from '../../../components/icons/Money.vue'
import ChartPie from '../../../components/icons/ChartPie.vue'
import ChartBar from '../../../components/icons/ChartBar.vue'
import { ref, onMounted, watch } from 'vue'
import { statuses } from './suplierData'
import SimpleTable from '../../../components/simpleTable/SimpleTable.vue'
import PieChart from '../../../components/charts/PieChart.vue'
import LineChart from '../../../components/charts/LineChart.vue'
import { getLineSuppliers, getPieSuppliers } from '../../../api/suppliers'
import type { ISipleTable } from '../../../components/simpleTable/types'
import type { ILineChartData, IPieItemData } from './types'
import { colors } from './colorConstants'
import type {
  IPieCHartProps,
  IPieIncomingData,
  ILineChartProps 
} from '../../../components/charts/types'
import useDateTo from '../../../store/dateTo'
import useDateFrom from '../../../store/dateFrom'
import useOfficeId from '../../../store/officeId'
import useUserInfo from '../../../store/user'
import { getRandomColor } from '../../../helpers/randomColor'
import useTableSelection from '../../../store/selectedTableItem'
import ChartItemInfo from '../../../components/chartItemInfo/ChartItemInfo.vue'
import i18n_config from '@/locales/i18n_config'

const { locale, messages } = i18n_config.global
const selectedChartTab = ref(false)
const selectedStatus = ref<{ id: number; title: string } | null>(null)
const selectedCurrency = ref<{ id: number; title: string } | null>(null)
const suppliersLineData = ref<ILineChartProps>({
  labels: [],
  datasets: []
})
const suppliersPieData = ref<IPieCHartProps>({
  labels: [],
  datasets: [{ procents: [], backgroundColor: [], data: [], purchases_count: [], borderColor: [] }]
})
const errorMessage = ref('')
const tableData = ref<ISipleTable[] | []>([])
const mainLineChart = ref<any>({})
const mainPieData = ref<IPieIncomingData>({ data: [], total: 0 })
const selectedTableData = ref<ISipleTable[]>([])
const lineMainDataset = ref<ILineChartData[]>([])
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
])
const getPieData = async () => {
  getPieSuppliers({
    date_from: useDateFrom.dateFrom.value,
    date_to: useDateTo.dateTo.value,
    only_paid: selectedStatus.value?.id || 0
  })
    .then(({ data }: { data: { data: IPieItemData[]; total: number } }) => {
      mainPieData.value = data
      suppliersPieData.value.labels = []
      suppliersPieData.value.datasets[0].backgroundColor = []
      suppliersPieData.value.datasets[0].borderColor = []
      suppliersPieData.value.datasets[0].data = []
      suppliersPieData.value.datasets[0].purchases_count = []
      suppliersPieData.value.datasets[0].procents = []
      tableData.value = data.data.map((pieData, i) => {
        return {
          id: pieData.id,
          name: pieData.name,
          sum: selectedCurrency.value?.id === 1 ? pieData.total_price_aux : pieData.total_price,
          count: pieData.purchases_count,
          procent: !data.total
            ? '0%'
            : Number(((pieData.total_price / data.total) * 100).toFixed(1)) < 0.1
            ? '> 0.1%'
            : ((pieData.total_price / data.total) * 100).toFixed(1) + '%',
          color: i > colors.length ? getRandomColor() : colors[i]
        }
      })
      data.data.map((pieData, i) => {
        suppliersPieData.value.labels.push(pieData.name)
        suppliersPieData.value.datasets[0].backgroundColor.push(
          i > colors.length ? getRandomColor() : colors[i]
        )
        suppliersPieData.value.datasets[0].borderColor.push(
          i > colors.length ? getRandomColor() : colors[i]
        )
        suppliersPieData.value.datasets[0].data.push(
          selectedCurrency.value?.id === 1 ? pieData.total_price_aux : pieData.total_price
        )
        suppliersPieData.value.datasets[0].purchases_count.push(pieData.purchases_count),
          suppliersPieData.value.datasets[0].procents.push(
            !data.total ? 0 : Number(((pieData.total_price / data.total) * 100).toFixed(1))
          )
        return
      })
    })
    .catch((error) => (errorMessage.value = error.message + error.error[0]))
}
const getLineData = async () => {
  getLineSuppliers({
    date_from: useDateFrom.dateFrom.value,
    date_to: useDateTo.dateTo.value,
    only_paid: selectedStatus.value?.id || 0
  })
    .then(({ data }: any) => {
      suppliersLineData.value.labels = data.labels
      suppliersLineData.value.datasets = data.datasets.map(
        (
          lineData: {
            label: string
            data: { purchases_count: number; total_price: number; total_price_usd: number }[]
            borderColor: string
          },
          i: number
        ) => {
          return {
            label: lineData.label,
            borderColor: i > colors.length ? getRandomColor() : colors[i],
            data: lineData.data.map((el) =>
              selectedCurrency.value?.id === 1 ? el.total_price_usd : el.total_price
            )
          }
        }
      )
      mainLineChart.value = data
      lineMainDataset.value = JSON.parse(JSON.stringify(suppliersLineData.value.datasets))
    })
    .catch((error) => (errorMessage.value = error.message + error.error[0]))
}
onMounted(async () => {
  currencyInfo.value = [
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

  getPieData()
  getLineData()
})
watch(
  [useDateFrom.dateFrom, useDateTo.dateTo, useOfficeId.updatedRefer, useOfficeId.officeId],
  () => {
    getPieData()
    getLineData()
  }
)
watch(useUserInfo.userCurrency, () => {
  currencyInfo.value = [
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
  selectedCurrency.value = null
})
watch(selectedStatus, async () => {
  getPieData()
  getLineData()
})

watch(tableData, () => {
  selectedTableData.value = tableData.value
})

watch(selectedTableData, () => {
  suppliersPieData.value.datasets[0].data = selectedTableData.value.map((el) => el.sum)
  suppliersPieData.value.datasets[0].backgroundColor = selectedTableData.value.map((el) => el.color)
  suppliersPieData.value.datasets[0].borderColor = selectedTableData.value.map((el) => el.color)
  suppliersPieData.value.datasets[0].procents = selectedTableData.value.map((el) => {
    return Number(((el.sum / mainPieData.value.total) * 100).toFixed(1))
  })
  suppliersPieData.value.labels = selectedTableData.value.map((el) => el.name)
  suppliersLineData.value.datasets = mainLineChart.value.datasets
    ?.map(
      (
        lineData: {
          label: string
          data: { purchases_count: number; total_price: number; total_price_usd: number }[]
          borderColor: string
        },
        i: number
      ) => {
        return {
          label: lineData.label,
          borderColor: i > colors.length ? getRandomColor() : colors[i],
          data: lineData.data.map((el) => {
            return selectedCurrency.value?.id === 1 ? el.total_price_usd : el.total_price
          })
        }
      }
    )
    ?.filter((el: any) => {
      return selectedTableData.value.find((elem) => elem.name === el.label)
    })
})
watch(selectedCurrency, () => {
  suppliersPieData.value.labels = []
  suppliersPieData.value.datasets[0].backgroundColor = []
  suppliersPieData.value.datasets[0].data = []
  suppliersPieData.value.datasets[0].purchases_count = []
  suppliersLineData.value = {
    labels: [],
    datasets: []
  }
  tableData.value = mainPieData.value.data.map((pieData, i) => {
    return {
      id: pieData.id,
      name: pieData.name,
      sum: selectedCurrency.value?.id === 1 ? pieData.total_price_aux : pieData.total_price,
      count: pieData.purchases_count,
      procent: !mainPieData.value.total
        ? '0%'
        : Number(((pieData.total_price / mainPieData.value.total) * 100).toFixed(1)) < 0.1
        ? '> 0.1%' 
        : ((pieData.total_price / mainPieData.value.total) * 100).toFixed(1) + '%',
      color: i > colors.length ? getRandomColor() : colors[i]
    }
  })
  mainPieData.value.data.map((pieData, i) => {
    suppliersPieData.value.labels.push(pieData.name)
    suppliersPieData.value.datasets[0].backgroundColor.push(
      i > colors.length ? getRandomColor() : colors[i]
    )
    suppliersPieData.value.datasets[0].borderColor.push(
      i > colors.length ? getRandomColor() : colors[i]
    )
    suppliersPieData.value.datasets[0].data.push(
      selectedCurrency.value?.id === 1 ? pieData.total_price_aux : pieData.total_price
    )
    suppliersPieData.value.datasets[0].purchases_count.push(pieData.purchases_count)
    return
  })
  suppliersLineData.value.labels = mainLineChart.value.labels
  suppliersLineData.value.datasets = mainLineChart.value.datasets.map(
    (
      lineData: {
        label: string
        data: { purchases_count: number; total_price: number; total_price_usd: number }[]
        borderColor: string
      },
      i: number
    ) => {
      return {
        label: lineData.label,
        borderColor: i > colors.length ? getRandomColor() : colors[i],
        data: lineData.data.map((el) => {
          return selectedCurrency.value?.id === 1 ? el.total_price_usd : el.total_price
        })
      }
    }
  )
})
</script>
<template>
  <div class="support_page">
    <div class="support_head">
      <h2>{{ $t('supplier ranking') }}</h2>
      <div class="support_tabs">
        <Dropdown
          class="values_button"
          :options="statuses"
          optionLabel="title"
          v-model="selectedStatus"
          :style="{
            border: selectedStatus
              ? '1px solid var(--vt-c-electric-blue)'
              : '1px solid var(--vt-c-light-white)'
          }"
          :class="selectedStatus ? 'dropdown_active' : ''"
        >
          <template #dropdownicon>
            <div></div>
          </template>
          <template #value>
            <div class="dropdown_icon_container" v-if="!selectedStatus">
              <Clock />
              <p>{{ $t('payment status') }}</p>
            </div>
          </template>
        </Dropdown>
        <Dropdown
          class="values_button"
          :options="currencyInfo"
          optionLabel="title"
          v-model="selectedCurrency"
          v-if="useUserInfo.userCurrency.value !== 'USD'"
          :style="{
            border: selectedCurrency
              ? '1px solid var(--vt-c-electric-blue)'
              : '1px solid var(--vt-c-light-white)'
          }"
          :class="selectedStatus ? 'dropdown_active' : ''"
        >
          <template #dropdownicon>
            <div></div>
          </template>
          <template #value>
            <div class="dropdown_icon_container" v-if="!selectedCurrency">
              <Money />
              <p>{{ $t('currency') }}</p>
            </div>
          </template>
        </Dropdown>
        <button class="icon_button" @click="() => (selectedChartTab = false)">
          <ChartPie :selected="!selectedChartTab" />
        </button>
        <button class="icon_button" @click="() => (selectedChartTab = true)">
          <ChartBar :selected="selectedChartTab" />
        </button>
      </div>
    </div>
    <p v-if="errorMessage">{{errorMessage}}</p>
    <div class="support_body" :key="useOfficeId.officeId.value">
      <SimpleTable
        :selected-product="selectedTableData"
        :products="tableData"
        @select-product="selectedTableData = $event"
        :key="tableData.length + (selectedCurrency?.id || 0)"
        :currency="
          selectedCurrency?.title
            ? selectedCurrency?.title.slice(-2)
            : useUserInfo.userCurrency.value === 'USD'
            ? '$'
            : currencyInfo[0].title.slice(-2)
        "
      />
      <div v-if="!selectedChartTab && suppliersPieData.labels.length" style="margin-top: 30px">
        <div>
          <PieChart
            :graph-chart="suppliersPieData"
            :key="
              suppliersPieData.datasets[0].data.length +
              (selectedCurrency?.id || 0) +
              useTableSelection.checkedIndex.value
            "
            :currency="
              selectedCurrency?.title
                ? selectedCurrency?.title.slice(-2)
                : useUserInfo.userCurrency.value === 'USD'
                ? '$'
                : currencyInfo[0].title.slice(-2)
            "
          />
        </div>
        <div class="chartItemsBox">
          <ChartItemInfo
            v-for="item in selectedTableData.filter((el) => Number(el.procent.split('%')[0]) >= 20)"
            :key="item.id"
            :data="item"
            :currency="
              selectedCurrency?.title
                ? selectedCurrency?.title.slice(-2)
                : useUserInfo.userCurrency.value === 'USD'
                ? '$'
                : currencyInfo[0].title.slice(-2)
            "
          />
        </div>
      </div>
      <div v-if="selectedChartTab && suppliersLineData.labels.length" style="margin-top: 30px">
        <LineChart
          :graphChart="suppliersLineData"
          :key="suppliersLineData.datasets.length + (selectedCurrency?.id || 0) + Math.random()"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import './styles.scss';
</style>
