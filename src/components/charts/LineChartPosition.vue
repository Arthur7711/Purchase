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
} from 'chart.js';
import { Chart } from 'vue-chartjs';
import type { ICurrencyInfo, ILineChart } from '@/views/analistic/positionPage/types';
import { type PropType } from 'vue';
import i18n_config from '@/locales/i18n_config';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default {
  name: 'LineChartPosition',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Chart
  },
  props: {
    graphChart: { type: Object as PropType<ILineChart>, required: true },
    currency: { type: String, required: true },
    currencyInfo: { type: Array<ICurrencyInfo>, required: true }
  },
  data() {
    return {
      data: {
        labels: this.graphChart.labels,
        datasets: [
          {
            fill: false,
            yAxisID: 'y',
            label: i18n_config.global.messages[i18n_config.global.locale]['average price'],
            data: this.graphChart.datasets[0].data.map((el) => {
              return Number(el.price_avg);
            })
          }
        ]
      },      
      options: {   
        responsive: false,
        maintainAspectRatio: true,
        elements: {
          point: {
            radius: 1.5
          }
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              font: {
                weight: 500
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgb(247, 247, 247)',
            boxShadow: '10px 10px 5px black',
            titleColor: '#1A1A1A',
            bodyFont: {
              weight: '700'
            },
            bodyColor: '#1A1A1A',
            displayColors: false
          }
        },
        scales: {
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    };
  },
  watch: {
    graphChart: {
      handler() {
        if (this.currency.toString() === '0') {
          this.data = {
            labels: this.graphChart.labels,
            datasets: [
              {
                fill: false,
                yAxisID: 'y',
                label: i18n_config.global.messages[i18n_config.global.locale]['average price'],
                data: this.graphChart.datasets[0].data.map((el) => {
                  return Number(el.price_avg);
                })
              }
            ]
          };
        } else {
          this.data = {
            labels: this.graphChart.labels,
            datasets: [
              {
                fill: false,
                yAxisID: 'y',
                label: i18n_config.global.messages[i18n_config.global.locale]['average price'],
                data: this.graphChart.datasets[0].data.map((el) => {
                  return Number(el.aux_price_avg);
                })
              }
            ]
          };
        }
      },
      deep: true
    },
    currency: {
      handler() {
        if (this.currency.toString() === '0') {
          this.data = {
            labels: this.graphChart.labels,
            datasets: [
              {
                fill: false,
                yAxisID: 'y',
                label: i18n_config.global.messages[i18n_config.global.locale]['average price'],
                data: this.graphChart.datasets[0].data.map((el) => {
                  return Number(el.price_avg);
                })
              }
            ]
          };
        } else {
          this.data = {
            labels: this.graphChart.labels,
            datasets: [
              {
                fill: false,
                yAxisID: 'y',
                label: i18n_config.global.messages[i18n_config.global.locale]['average price'],
                data: this.graphChart.datasets[0].data.map((el) => {
                  return Number(el.aux_price_avg);
                })
              }
            ]
          };
        }
      },
      deep: true
    }
  }
};
</script>

<template>
  <div class="card">
    <Chart type="line" ref="chart" :data="data" :options="options" :style="{ width: '50vw' }" />
  </div>
</template>

<style scoped>
.card {
  background: var(--surface-card);
  border-radius: 10px;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>
