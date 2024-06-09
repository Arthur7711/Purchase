<template>
  <Pie
    :data="data"
    :options="options"
    id="pie_suppliers"
    :style="{ width: chartSize || '550px' }"
  />
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { type PropType } from 'vue'
import { Pie } from 'vue-chartjs'
import type { IPieCHartProps } from './types'
import { readabilityNumber, readabilityDotNumbers } from '../../helpers/readabilityNumber'
import useTableSelection from '../../store/selectedTableItem'
import useCheckedName from '../../store/checkedName'
import i18n_config from '@/locales/i18n_config'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'Suppliers',
  components: {
    Pie
  },
  props: {
    graphChart: { type: Object as PropType<IPieCHartProps>, required: true },
    currency: { type: String as PropType<string>, required: true },
    chartSize: { type: String as PropType<string>, required: false },
    name: { type: String, required: false }
  },
  data() {
    return {
      locale: i18n_config.global.locale,
      messages: i18n_config.global.messages,
      data: this.graphChart,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 20
        },
        elements: {
          arc: {
            offset: (c: any) => {
              if (c?.element?.options?.borderColor === useTableSelection.checkedIndex.value) {
                return 20
              } else {
                return 0
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                if (!this.name) {
                  return `${readabilityNumber(
                    Math.floor(context.dataset.data[context.dataIndex])
                  )} ${this.currency?.includes('N') ? 'Br' : this.currency} \n ${
                    context.dataset.procents[context.dataIndex] > 0.1
                      ? readabilityDotNumbers(context.dataset.procents[context.dataIndex])
                      : '> 0,1'
                  }%`
                } else {
                  return [
                    `${readabilityNumber(
                      Math.floor(context.dataset.purchases_count[context.dataIndex])
                    )} ${i18n_config.global.messages[i18n_config.global.locale as "ru" | "en"]['approved tasks']}`,
                    `${
                      context.dataset.procents[context.dataIndex] > 0.1
                        ? readabilityDotNumbers(context.dataset.procents[context.dataIndex])
                        : '> 0,1'
                    }%`
                  ]
                }
              }
            },
            events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
            backgroundColor: '#fff',
            titleColor: '#1A1A1A',
            bodyFont: {
              weight: '700'
            },
            bodyColor: '#1A1A1A',
            displayColors: false
          }
        },
        onClick: function (e: any) {
          if (e.chart.tooltip.labelColors[0]) {
            useTableSelection.setCheckedIndex(e.chart.tooltip.labelColors[0].backgroundColor)
          }
          if (useCheckedName.checkedName.value === e.chart.tooltip.title[0]) {
            useCheckedName.setCheckedName('')
          } else {
            useCheckedName.setCheckedName(e.chart.tooltip.title[0])
          }
        }
      }
    }
  }
}
</script>
<style>
@media only screen and (max-width: 1440px) {
  #pie_suppliers {
    width: auto;
  }
}
</style>
