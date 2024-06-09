<template>
  <Line ref="chart" :data="data" :options="options" :style="{ width: '700px', height: '75vh' }" />
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { ILineChartProps } from './types'
import { type PropType, watch } from 'vue'
import useCheckedName from '../../store/checkedName'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
  name: 'LineChart',
  components: {
    Line
  },
  props: {
    graphChart: { type: Object as PropType<ILineChartProps>, required: true },
    name: { type: String, required: false }
  },
  data() {
    return {
      data: this.graphChart,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 1
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (e: any) => {
                if (this.name) {
                  return e.dataset.label + ' ' + e.dataset.data[e.dataIndex] + ' %'
                }
              }
            },
            backgroundColor: '#fff',
            titleColor: '#1A1A1A',
            bodyFont: {
              weight: '700'
            },
            bodyColor: '#1A1A1A',
            displayColors: false
          }
        },
        onClick: (e: any) => {
          if (useCheckedName.checkedName.value === e.chart.tooltip.body[0].lines[0].split(':')[0]) {
            useCheckedName.setCheckedName('')
          } else {
            useCheckedName.setCheckedName(e.chart.tooltip.body[0].lines[0].split(':')[0])
          }
        }
      }
    }
  },
  watch: {
    graphChart: {
      handler(val) {
        this.data = val
      },
      deep: true
    }
  }
}
</script>
