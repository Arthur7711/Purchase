<template>
  <Line
    ref="chart"
    :data="data"
    :options="options"
    :style="{ width: '300px', height: '180px' }"
  />
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
} from 'chart.js';
import { Line } from 'vue-chartjs';
import type { ILineChartProps } from './types';
import { type PropType, watch } from 'vue';
import useCheckedName from '../../store/checkedName';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default {
  name: 'LineChart',
  components: {
    Line
  },
  props: { graphChart: { type: Object as PropType<ILineChartProps>, required: true } },
  data() {
    return {
      data: this.graphChart,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 0.3
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
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
    graphChart: {
      handler(val) {
        this.data = val;
      },
      deep: true
    }
  }
};
</script>
