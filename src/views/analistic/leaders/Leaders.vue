<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ChartPie from '../../../components/icons/ChartPie.vue'
import ChartBar from '../../../components/icons/ChartBar.vue'
import useUserInfo from '../../../store/user'
import Money from '../../../components/icons/Money.vue'
import DropdownIcon from '../../../components/icons/SelectedDroper.vue'
import useDateTo from '../../../store/dateTo'
import useDateFrom from '../../../store/dateFrom'
import useOfficeId from '../../../store/officeId'
import TableProgress from '../../../components/simpleTable/TableProgress.vue'
import type { IProgressTable } from '../../../components/simpleTable/types'
import type {
  IPossitionPieData,
  ILeaderPiePossition,
  ILinePossition,
  ILineapprovals
} from './types'
import {
  getPieAcceptedPossitionLeaders,
  getPieAcceptedTaskLeaders,
  getLineAcceptedPossitionLeaders,
  getLineAcceptedTaskLeaders
} from '../../../api/leaders'
import { colors } from '../suppliers/colorConstants'
import PieChart from '../../../components/charts/PieChart.vue'
import LineChart from '../../../components/charts/LineChart.vue'
import type { IPieCHartProps, ILineChartProps } from '../../../components/charts/types'
import { getRandomColor } from '../../../helpers/randomColor'
import useTableSelection from '../../../store/selectedTableItem'
import ChartItemInfo from '../../../components/chartItemInfo/ChartItemInfo.vue'
import i18n_config from '@/locales/i18n_config'

const { locale, messages } = i18n_config.global
const selectedChartTab = ref(false)
const selectedCurrency = ref<{ id: number; title: string } | null>(null)
const errorMessage = ref('')
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
const offeredPossitions = ref([
  { id: 0, title: messages[locale]['sum of approved positions'] },
  { id: 1, title: messages[locale]['percentage of approvals'] }
])
const selectedPossition = ref<{ id: number; title: string }>(offeredPossitions.value[0])
const tableData = ref<IProgressTable[] | []>([])
const selectedTableData = ref<IProgressTable[]>([])
const moreThan20 = ref<IProgressTable[]>([])
const mainPieData = ref<IPieCHartProps>({ labels: [], datasets: [] })
const reservePieData = ref<ILeaderPiePossition>({ total: 0, data: [] })
const linePossitionData = ref<ILineChartProps>({ datasets: [], labels: [] })
const reserveLinePossitionData = ref<ILinePossition>({ datasets: [], labels: [] })
const showNA = ref(false)
const reserveLineapprovalsData = ref<ILineapprovals>({ datasets: [], labels: [] })
const reservePieTaskData = ref<ILeaderPiePossition>({ total: 0, data: [] })
const handeledTableData = ref<IProgressTable[] | []>([])
const activeItemsTotal = ref(0)

const getPiePossitionData = async () => {
  getPieAcceptedPossitionLeaders({
    date_from: useDateFrom.dateFrom.value,
    date_to: useDateTo.dateTo.value
  })
    .then(({ data }: { data: ILeaderPiePossition }) => {
      reservePieData.value = data
      if (showNA.value) {
        tableData.value = data.data.map((possitionData, i) => {
          return {
            id: possitionData.id,
            name: possitionData.displayname,
            sum:
              selectedCurrency.value?.id === 1
                ? possitionData.aux_price_sum
                : possitionData.price_sum,
            procent: !reservePieData.value.total
              ? '0%'
              : Number(((possitionData.price_sum / reservePieData.value.total) * 100).toFixed(1)) <
                0.1
              ? '> 0.1%'
              : ((possitionData.price_sum / reservePieData.value.total) * 100).toFixed(1) + '%',
            color: i > colors.length ? getRandomColor() : colors[i],
            approved: possitionData.approvals_accepted_count,
            approvedProcent: possitionData.approvals_accepted_percent,
            imgUrl: import.meta.env.VITE_VUE_APP_API_URL_AVATAR + possitionData.samaccountname,
            count: possitionData.items_count,
            pending: possitionData.approvals_pending_count,
            reject: possitionData.approvals_rejected_count,
            reserveSum:
              selectedCurrency.value?.id === 1
                ? possitionData.aux_price_sum
                : possitionData.price_sum,
            reserveProcent: !reservePieData.value.total
              ? 0
              : Number(((possitionData.price_sum / reservePieData.value.total) * 100).toFixed(1))
          }
        })
      } else {
        const totalNoNA =
          data.total - Number(data.data.find((el) => el.displayname === 'N/A')?.price_sum || 0)
        tableData.value = data.data
          .filter((el) => el.displayname !== 'N/A')
          .map((possitionData, i) => {
            return {
              id: possitionData.id,
              name: possitionData.displayname,
              sum:
                selectedCurrency.value?.id === 1
                  ? possitionData.aux_price_sum
                  : possitionData.price_sum,
              procent: !reservePieData.value.total
                ? '0%'
                : Number(((possitionData.price_sum / totalNoNA) * 100).toFixed(1)) < 0.1
                ? '> 0.1%'
                : ((possitionData.price_sum / totalNoNA) * 100).toFixed(1) + '%',
              color: i > colors.length ? getRandomColor() : colors[i],
              approved: possitionData.approvals_accepted_count,
              approvedProcent: possitionData.approvals_accepted_percent,
              imgUrl: import.meta.env.VITE_VUE_APP_API_URL_AVATAR + possitionData.samaccountname,
              count: possitionData.items_count,
              pending: possitionData.approvals_pending_count,
              reject: possitionData.approvals_rejected_count,
              reserveSum:
                selectedCurrency.value?.id === 1
                  ? possitionData.aux_price_sum
                  : possitionData.price_sum,
              reserveProcent: !reservePieData.value.total
                ? 0
                : Number(((possitionData.price_sum / totalNoNA) * 100).toFixed(1))
            }
          })
      }
    })
    .catch((error) => (errorMessage.value = error.message + error.error[0]))
}
const getPieTaskData = async () => {
  getPieAcceptedTaskLeaders({
    date_from: useDateFrom.dateFrom.value,
    date_to: useDateTo.dateTo.value
  })
    .then(({ data }: { data: ILeaderPiePossition }) => {
      reservePieTaskData.value = data
      if (showNA.value) {
        tableData.value = data.data.map((possitionData, i) => {
          return {
            id: possitionData.id,
            name: possitionData.displayname,
            sum: possitionData.items_count,
            procent: !reservePieTaskData.value.total
              ? '0%'
              : Number(
                  (
                    (possitionData.approvals_accepted_count / data.total) *
                    100
                  ).toFixed(1)
                ) < 0.1
              ? '> 0.1%'
              : (
                  (possitionData.approvals_accepted_count / data.total) *
                  100
                ).toFixed(1) + '%',
            color: i > colors.length ? getRandomColor() : colors[i],
            approved: possitionData.approvals_accepted_count,
            approvedProcent: possitionData.approvals_accepted_percent,
            imgUrl: import.meta.env.VITE_VUE_APP_API_URL_AVATAR + possitionData.samaccountname,
            count: possitionData.approvals_accepted_count,
            pending: possitionData.approvals_pending_count,
            reject: possitionData.approvals_rejected_count,
            reserveSum:
              selectedCurrency.value?.id === 1
                ? possitionData.aux_price_sum
                : possitionData.price_sum,
            reserveProcent: !reservePieTaskData.value.total
              ? 0
              : Number(
                  (
                    (possitionData.approvals_accepted_count / data.total) *
                    100
                  ).toFixed(1)
                )
          }
        })
      } else {
        const totalNoNA =
          data.total - Number(data.data.find((el) => el.displayname === 'N/A')?.approvals_accepted_count || 0)
        tableData.value = data.data
          .filter((el) => el.displayname !== 'N/A')
          .map((possitionData, i) => {
            return {
              id: possitionData.id,
              name: possitionData.displayname,
              sum: possitionData.items_count,
              procent: !reservePieTaskData.value.total
                ? '0%'
                : Number(((possitionData.approvals_accepted_count / totalNoNA) * 100).toFixed(1)) <
                  0.1
                ? '> 0.1%'
                : ((possitionData.approvals_accepted_count / totalNoNA) * 100).toFixed(1) + '%',
              color: i > colors.length ? getRandomColor() : colors[i],
              approved: possitionData.approvals_accepted_count,
              approvedProcent: possitionData.approvals_accepted_percent,
              imgUrl: import.meta.env.VITE_VUE_APP_API_URL_AVATAR + possitionData.samaccountname,
              count: possitionData.approvals_accepted_count,
              pending: possitionData.approvals_pending_count,
              reject: possitionData.approvals_rejected_count,
              reserveSum:
                selectedCurrency.value?.id === 1
                  ? possitionData.aux_price_sum
                  : possitionData.price_sum,
              reserveProcent: !reservePieTaskData.value.total
                ? 0
                : Number(((possitionData.approvals_accepted_count / totalNoNA) * 100).toFixed(1))
            }
          })
      }
    })
    .catch((error) => (errorMessage.value = error.message + error.error[0]))
}
const getLinePossitionData = async () => {
  getLineAcceptedPossitionLeaders({
    date_from: useDateFrom.dateFrom.value,
    date_to: useDateTo.dateTo.value
  })
    .then(({ data }: { data: ILinePossition }) => {
      reserveLinePossitionData.value = data
      linePossitionData.value.labels = data.labels
      linePossitionData.value.datasets = data.datasets.map((lineData, i) => {
        return {
          label: lineData.label,
          data: lineData.data.map((el) =>
            selectedCurrency.value?.id === 1 ? el.aux_price_sum : el.price_sum
          ),
          borderColor: i > colors.length ? getRandomColor() : colors[i]
        }
      })
    })
    .catch((error) => (errorMessage.value = error.message + error.error[0]))
}
const getLineTaskData = async () => {
  getLineAcceptedTaskLeaders({
    date_from: useDateFrom.dateFrom.value,
    date_to: useDateTo.dateTo.value
  })
    .then(({ data }: { data: ILineapprovals }) => {
      reserveLineapprovalsData.value = data
      linePossitionData.value.labels = data.labels
      linePossitionData.value.datasets = data.datasets.map((lineData, i) => {
        return {
          label: lineData.label,
          data: lineData.data.map((el) => el.percent),
          borderColor: i > colors.length ? getRandomColor() : colors[i]
        }
      })
    })
    .catch((error) => (errorMessage.value = error.message + error.error[0]))
}
const updateTableDatas = () => {
  mainPieData.value = {
    labels: [],
    datasets: [
      { procents: [], backgroundColor: [], data: [], purchases_count: [], borderColor: [] }
    ]
  }
  selectedTableData.value = tableData.value
  if (showNA.value) {
    selectedTableData.value.forEach((el) => {
      mainPieData.value.labels.push(el.name)
      mainPieData.value.datasets[0].backgroundColor.push(el.color)
      mainPieData.value.datasets[0].borderColor.push(el.color)
      mainPieData.value.datasets[0].data.push(el.sum)
      mainPieData.value.datasets[0].purchases_count.push(el.approved)
      mainPieData.value.datasets[0].procents.push(el.reserveProcent)
    })
  } else {
    selectedTableData.value.forEach((el) => {
      if (el.name !== 'N/A') {
        mainPieData.value.labels.push(el.name)
        mainPieData.value.datasets[0].backgroundColor.push(el.color)
        mainPieData.value.datasets[0].borderColor.push(el.color)
        mainPieData.value.datasets[0].data.push(el.sum)
        mainPieData.value.datasets[0].purchases_count.push(el.approved)
        mainPieData.value.datasets[0].procents.push(Number(el.procent))
      }
    })
  }
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
  getPiePossitionData()
  getLinePossitionData()
})
watch(tableData, () => {
  updateTableDatas()
})
watch(selectedTableData, () => {
  activeItemsTotal.value = !selectedPossition.value.id ? Number(
    selectedTableData.value?.reduce((acc: number, val: { sum: number }) => {
      return acc + val.sum
    }, 0)
  ) : Number(
    selectedTableData.value?.reduce((acc: number, val: { approved: number }) => {
      return acc + val.approved
    }, 0)
  )

  handeledTableData.value = tableData.value.map((el) => {    
    if(!selectedPossition.value.id) {
    return {
      ...el,
      procent: !reservePieData.value.total
        ? '0%'
        : !selectedTableData.value.find((elem) => elem.id === el.id)
        ? 'N/A'
        : Number(((el.sum / activeItemsTotal.value) * 100).toFixed(1)) < 0.1
        ? '> 0.1%'
        : ((el.sum / activeItemsTotal.value) * 100).toFixed(1) + '%'
    }
     } else {
    return {
      ...el,
      procent: !reservePieData.value.total
        ? '0%'
        : !selectedTableData.value.find((elem) => elem.id === el.id)
        ? 'N/A'
        : Number(((el.approved / activeItemsTotal.value) * 100).toFixed(2)) < 0.1
        ? '> 0.1%'
        : ((el.approved / activeItemsTotal.value) * 100).toFixed(1) + '%'
    }
     }
  })
  mainPieData.value = {
    labels: [],
    datasets: [
      { procents: [], backgroundColor: [], data: [], purchases_count: [], borderColor: [] }
    ]
  }
  linePossitionData.value.datasets = []
  selectedTableData.value.forEach((el) => {
    mainPieData.value.labels.push(el.name)
    mainPieData.value.datasets[0].backgroundColor.push(el.color)
    mainPieData.value.datasets[0].borderColor.push(el.color)
    mainPieData.value.datasets[0].data.push( 
      !selectedPossition.value.id ?
       el.sum
     : el.approved)
    mainPieData.value.datasets[0].purchases_count.push(el.approved)
    mainPieData.value.datasets[0].procents.push(
      !selectedPossition.value.id ?
       Number(((el.sum / activeItemsTotal.value) * 100)?.toFixed(1)) 
     : Number(((el.approved / activeItemsTotal.value) * 100)?.toFixed(1))
    )
  })
  moreThan20.value = selectedTableData.value.filter((el) => Number(el.procent.split('%')[0]) >= 20)
  if (!selectedPossition.value.id) {
    linePossitionData.value.datasets = reserveLinePossitionData.value.datasets
      .map((lineData, i) => {
        return {
          label: lineData.label,
          data: lineData.data.map((el) =>
            selectedCurrency.value?.id === 1 ? el.aux_price_sum : el.price_sum
          ),
          borderColor: i > colors.length ? getRandomColor() : colors[i]
        }
      })
      .filter((el) => selectedTableData.value.find((elem) => elem.name === el.label))
  } else {
    linePossitionData.value.datasets = reserveLineapprovalsData.value.datasets
      .map((lineData, i) => {
        return {
          label: lineData.label,
          data: lineData.data.map((el) => el.percent),
          borderColor: i > colors.length ? getRandomColor() : colors[i]
        }
      })
      .filter((el) => selectedTableData.value.find((elem) => elem.name === el.label))
  }
})
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
watch(selectedCurrency, () => {
  if (!selectedPossition.value.id) {
    if (showNA.value) {
      tableData.value = reservePieData.value.data?.map((possitionData, i) => {
        return {
          id: possitionData.id,
          name: possitionData.displayname,
          sum:
            selectedCurrency.value?.id === 1
              ? possitionData.aux_price_sum
              : possitionData.price_sum,
          procent: !reservePieData.value.total
            ? '0%'
            : Number(((possitionData.price_sum / reservePieData.value.total) * 100).toFixed(1)) <
              0.1
            ? '> 0.1%'
            : ((possitionData.price_sum / reservePieData.value.total) * 100).toFixed(1) + '%',
          color: i > colors.length ? getRandomColor() : colors[i],
          approved: possitionData.approvals_accepted_count,
          approvedProcent: possitionData.approvals_accepted_percent,
          imgUrl: import.meta.env.VITE_VUE_APP_API_URL_AVATAR + possitionData.samaccountname,
          count: possitionData.items_count,
          pending: possitionData.approvals_pending_count,
          reject: possitionData.approvals_rejected_count,
          reserveSum:
            selectedCurrency.value?.id === 1
              ? possitionData.aux_price_sum
              : possitionData.price_sum,
          reserveProcent: !reservePieData.value.total
            ? 0
            : Number(((possitionData.price_sum / reservePieData.value.total) * 100).toFixed(1))
        }
      })
    } else {
      let data = reservePieData.value.data.filter((el) => el.displayname !== 'N/A')
      tableData.value = data.map((possitionData, i) => {
        return {
          id: possitionData.id,
          name: possitionData.displayname,
          sum:
            selectedCurrency.value?.id === 1
              ? possitionData.aux_price_sum
              : possitionData.price_sum,
          procent: !reservePieData.value.total
            ? '0%'
            : Number(((possitionData.price_sum / reservePieData.value.total) * 100).toFixed(1)) <
              0.1
            ? '> 0.1%'
            : ((possitionData.price_sum / reservePieData.value.total) * 100).toFixed(1) + '%',
          color: i > colors.length ? getRandomColor() : colors[i],
          approved: possitionData.approvals_accepted_count,
          approvedProcent: possitionData.approvals_accepted_percent,
          imgUrl: import.meta.env.VITE_VUE_APP_API_URL_AVATAR + possitionData.samaccountname,
          count: possitionData.items_count,
          pending: possitionData.approvals_pending_count,
          reject: possitionData.approvals_rejected_count,
          reserveSum:
            selectedCurrency.value?.id === 1
              ? possitionData.aux_price_sum
              : possitionData.price_sum,
          reserveProcent: !reservePieData.value.total
            ? 0
            : Number(((possitionData.price_sum / reservePieData.value.total) * 100).toFixed(1))
        }
      })
    }
  } else {
    if (showNA.value) {
      tableData.value = reservePieTaskData.value.data.map((possitionData, i) => {
        return {
          id: possitionData.id,
          name: possitionData.displayname,
          sum: possitionData.items_count,
          procent: !reservePieTaskData.value.total
            ? '0%'
            : Number(
                (
                  (possitionData.approvals_accepted_count / reservePieTaskData.value.total) *
                  100
                ).toFixed(1)
              ) < 0.1
            ? '> 0.1%'
            : (
                (possitionData.approvals_accepted_count / reservePieTaskData.value.total) *
                100
              ).toFixed(1) + '%',
          color: i > colors.length ? getRandomColor() : colors[i],
          approved: possitionData.approvals_accepted_count,
          approvedProcent: possitionData.approvals_accepted_percent,
          imgUrl: import.meta.env.VITE_VUE_APP_API_URL_AVATAR + possitionData.samaccountname,
          count: possitionData.approvals_accepted_count,
          pending: possitionData.approvals_pending_count,
          reject: possitionData.approvals_rejected_count,
          reserveSum:
            selectedCurrency.value?.id === 1
              ? possitionData.aux_price_sum
              : possitionData.price_sum,
          reserveProcent: !reservePieTaskData.value.total
            ? 0
            : Number(
                (
                  (possitionData.approvals_accepted_count / reservePieTaskData.value.total) *
                  100
                ).toFixed(1)
              )
        }
      })
    } else {
      let data = reservePieTaskData.value.data.filter((el) => el.displayname !== 'N/A')
      tableData.value = data.map((possitionData, i) => {
        return {
          id: possitionData.id,
          name: possitionData.displayname,
          sum: possitionData.items_count,
          procent: !reservePieTaskData.value.total
            ? '0%'
            : Number(
                (
                  (possitionData.approvals_accepted_count / reservePieTaskData.value.total) *
                  100
                ).toFixed(1)
              ) < 0.1
            ? '> 0.1%'
            : (
                (possitionData.approvals_accepted_count / reservePieTaskData.value.total) *
                100
              ).toFixed(1) + '%',
          color: i > colors.length ? getRandomColor() : colors[i],
          approved: possitionData.approvals_accepted_count,
          approvedProcent: possitionData.approvals_accepted_percent,
          imgUrl: import.meta.env.VITE_VUE_APP_API_URL_AVATAR + possitionData.samaccountname,
          count: possitionData.approvals_accepted_count,
          pending: possitionData.approvals_pending_count,
          reject: possitionData.approvals_rejected_count,
          reserveSum:
            selectedCurrency.value?.id === 1
              ? possitionData.aux_price_sum
              : possitionData.price_sum,
          reserveProcent: !reservePieTaskData.value.total
            ? 0
            : Number(
                (
                  (possitionData.approvals_accepted_count / reservePieTaskData.value.total) *
                  100
                ).toFixed(1)
              )
        }
      })
    }
  }
})
watch(
  [useDateFrom.dateFrom, useDateTo.dateTo, useOfficeId.updatedRefer, useOfficeId.officeId],
  () => {
    if (!selectedPossition.value.id) {
      getPiePossitionData()
      getLinePossitionData()
    } else {
      getPieTaskData()
      getLineTaskData()
    }
  }
)
watch(selectedPossition, () => {
  if (!selectedPossition.value.id) {
    getPiePossitionData()
    getLinePossitionData()
  } else {
    getPieTaskData()
    getLineTaskData()
  }
})
watch(showNA, () => {
  if (!selectedPossition.value.id) {
    getPiePossitionData()
  } else {
    getPieTaskData()
  }
})
</script>
<template>
  <div class="leader_page">
    <div class="leader_head">
      <div class="text_possitions">
        <h2>{{ $t('executive rating by ') }}</h2>
        <Dropdown
          class="leader_possitions"
          :options="offeredPossitions"
          v-model="selectedPossition"
          optionLabel="title"
        >
          <template #dropdownicon>
            <DropdownIcon />
          </template>
          <template #value="{ value }">
            <p style="color: var(--vt-c-electric-blue); font-size: 22px; font-weight: 600">
              {{ value.title }}
            </p></template
          >
        </Dropdown>
      </div>
      <div class="leader_tabs">
        <div class="checked_box">
          <Checkbox v-model="showNA" :binary="true" class="show_na" />
          <span>{{ $t('account for costs without a concurrence') }}</span>
        </div>
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
          :class="selectedCurrency ? 'dropdown_active' : ''"
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
    <p>{{ errorMessage }}</p>
    <div class="leader_body">
      <TableProgress
        v-if="tableData.length"
        :selected-product="selectedTableData"
        :products="handeledTableData.length ? handeledTableData : tableData"
        @select-product="selectedTableData = $event"
        :key="tableData.length + (selectedCurrency?.id || 0) + selectedPossition.id + Math.random()"
        :titleswitch="selectedPossition.id === 0"
        :currency="
          selectedCurrency?.title
            ? selectedCurrency?.title.slice(-2)
            : useUserInfo.userCurrency.value === 'USD'
            ? '$'
            : currencyInfo[0].title.slice(-2)
        "
      />
      <div v-if="!selectedChartTab">
        <div>
          <PieChart
            :graphChart="mainPieData"
            :name="selectedPossition.id ? 'procent' : ''"
            :key="
              mainPieData.labels.length +
              (selectedCurrency?.id || 0) +
              selectedPossition.id +
              Math.random() +
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
            v-for="item in selectedTableData
              .filter((el) => el.sum / activeItemsTotal >= 0.2)
              .sort((a, b) => b.sum - a.sum)"
            :key="item.id"
            :name="selectedPossition.id ? 'procent' : undefined"
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
      <div v-if="selectedChartTab">
        <LineChart
          :graphChart="linePossitionData"
          :name="selectedPossition.id ? 'procent' : ''"
          :key="
            linePossitionData.datasets.length +
            (selectedCurrency?.id || 0) +
            selectedPossition.id +
            Math.random()
          "
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import 'styles';
</style>
