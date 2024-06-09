<template>
  <Bar
    :data="data"
    :options="options"
    id="pie_suppliers"
    :style="{ width: chartSize || '550px' }"
  />
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { type PropType } from 'vue';
import { Bar } from 'vue-chartjs';
import type { IBarChartProps } from './types';
import { readabilityNumber } from '../../helpers/readabilityNumber';

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: 'BarChart',
  components: {
    Bar
  },
  props: {
    chartData: { type: Object as PropType<IBarChartProps>, required: true },
    currency: { type: String as PropType<string>, required: false },
    chartSize: { type: String as PropType<string>, required: false }
  },
  data() {
    return {
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 20,
        layout: {
          padding: 20
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return `${readabilityNumber(Math.floor(context.dataset.data[context.dataIndex]))}$`;
              },
              beforeBody: (ctx: any) => {
                return [
                  ctx[0].dataset.label === 'Saint-Petersburg'
                    ? 'СПБ'
                    : ctx[0].dataset.label === 'Yerevan'
                      ? 'Ереван'
                      : ctx[0].dataset.label === 'Minsk'
                        ? 'Минск'
                        : ctx[0].dataset.label
                ];
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
        }
      }
    };
  },
  watch: {
    chartData: {
      handler(val) {
        this.data = val;
      },
      deep: true
    }
  }
};
</script>
<style>
@media only screen and (max-width: 1440px) {
  #pie_suppliers {
    width: auto;
  }
}
</style>
