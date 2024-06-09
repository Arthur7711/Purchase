<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { type PropType } from 'vue'
import { Pie } from 'vue-chartjs'
import type { IPieCHartProps } from '@/views/analistic/positionPage/types'
import useCheckedName from '../../store/checkedName'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'PiePosition',
  components: {
    Pie
  },
  props: { graphChart: { type: Object as PropType<IPieCHartProps>, required: true } },
  data() {
    return {
      pieData: this.graphChart,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: 20
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return `${context.dataset.data[context.dataIndex]} %`
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
          e.chart.tooltip.dataPoints[0].element.options.offset = 20
          if (useCheckedName.checkedName.value === e.chart.tooltip.title[0]) {
            useCheckedName.setCheckedName('')
          } else {
            useCheckedName.setCheckedName(e.chart.tooltip.title[0])
          }
        }
      }
    }
  },
  watch: {
    graphChart: {
      handler(val) {
        this.pieData = val
      },
      deep: true
    }
  }
}
</script>

<template>
  <div class="position_div_chart">
    <Pie
      :data="pieData"
      :options="options"
      :style="{ maxWidth: '500px', maxHeight: '500px' }"
      id="pie_suppliers"
    ></Pie>
  </div>
</template>

<style>
#pie_suppliers .chartjs-tooltip-title {
  color: red; /* Change this to the desired color */
}

.position_div_chart {
  min-width: 20vw;
  max-width: 20vw;
}
</style>
