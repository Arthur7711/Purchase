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
} from 'chart.js';
import { Line } from 'vue-chartjs';
import type { ILineChartProps } from './types';
import { type PropType } from 'vue';
import type { IEventLine } from './types';
import type { ISecondLineDataMulti } from '@/views/analistic/expenses/types';
import { curFormatter } from '../../helpers/currencyFormatter';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default {
  name: 'LineChart',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Line
  },
  props: {
    graphChart: { type: Object as PropType<ILineChartProps>, required: true },
    staff: { type: Array as PropType<(string | number)[]>, required: false },
    per_staff: { type: Array as PropType<(string | number)[]>, required: false },
    symbol: { type: String, required: false },
    multi_data: { type: Object as PropType<ISecondLineDataMulti> | null },
    chart_type: { type: String },
    oneLine: { type: Boolean, required: true },
    tooltip_data: { type: Array as PropType<string[]>, required: true }
  },
  data() {
    return {
      data: this.graphChart,
      cashedata: this.graphChart.datasets.map((el) => el.data),
      staff_count: this.staff,
      perStaff: this.per_staff,
      curr_symb: this.symbol,
      multiData: this.multi_data,
      chartType: this.chart_type,
      displayColor: '',
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
              afterBody: (e: IEventLine[]) => {
                if (this.oneLine) {
                  if (this.symbol !== '$') {
                    return [
                      this.tooltip_data[0] +
                        ': ' +
                        curFormatter(
                          this.graphChart.datasets[e[0].datasetIndex].data[e[0].dataIndex]
                        ) +
                        this.symbol,
                      // @ts-ignore this issue
                      this.tooltip_data[1] + ': ' + curFormatter(this.staff_count[e[0].dataIndex]),
                      // @ts-ignore this issue
                      this.tooltip_data[2] +
                        ': ' +
                        // @ts-ignore this issue
                        curFormatter(Number(this.perStaff[e[0].dataIndex])) +
                        this.curr_symb
                    ];
                  } else {
                    return [
                      this.tooltip_data[0] +
                        ': ' +
                        curFormatter(
                          // @ts-ignore this issue
                          this.graphChart.datasets[e[0].datasetIndex].aux_data[e[0].dataIndex]
                        ) +
                        this.symbol,
                      this.tooltip_data[1] +
                        ': ' +
                        (this.staff ? curFormatter(this.staff[e[0].dataIndex]) : ''),

                      this.tooltip_data[2] +
                        ': ' +
                        // @ts-ignore this issue
                        curFormatter(Number(this.perStaff[e[0].dataIndex])) +
                        this.curr_symb
                    ];
                  }
                } else {
                  switch (this.chart_type) {
                    case 'purposes':
                      if (this.symbol !== '$') {
                        return [
                          this.tooltip_data[0] +
                            ': ' +
                            curFormatter(
                              this.graphChart.datasets[e[0].datasetIndex].data[e[0].dataIndex]
                            ) +
                            this.symbol,
                          this.tooltip_data[1] +
                            ': ' +
                            curFormatter(
                              // @ts-ignore this issue
                              this.multi_data?.purpose[e[0].datasetIndex].staff[e[0].dataIndex]
                            ),

                          this.tooltip_data[2] +
                            ': ' +
                            curFormatter(
                              this.multi_data?.purpose[e[0].datasetIndex].per_staff[0][
                                e[0].dataIndex
                              ] as number
                            ) +
                            this.symbol
                        ];
                      } else {
                        return [
                          this.tooltip_data[0] +
                            ': ' +
                            curFormatter(
                              this.graphChart.datasets[e[0].datasetIndex].aux_data
                                ? // @ts-ignore this issue
                                  this.graphChart.datasets[e[0].datasetIndex].aux_data[
                                    e[0].dataIndex
                                  ]
                                : 0
                            ) +
                            this.symbol,
                          this.tooltip_data[1] +
                            ': ' +
                            curFormatter(
                              // @ts-ignore this issue
                              this.multi_data?.purpose[e[0].datasetIndex].staff[e[0].dataIndex]
                            ),

                          this.tooltip_data[2] +
                            ': ' +
                            curFormatter(
                              this.multi_data?.purpose[e[0].datasetIndex].per_staff[1][
                                e[0].dataIndex
                              ] as number
                            ) +
                            this.symbol
                        ];
                      }
                    case 'types':
                      if (this.symbol !== '$') {
                        return [
                          this.tooltip_data[0] +
                            ': ' +
                            curFormatter(
                              this.graphChart.datasets[e[0].datasetIndex].data[e[0].dataIndex]
                            ) +
                            this.symbol,
                          this.tooltip_data[1] +
                            ': ' +
                            curFormatter(
                              // @ts-ignore this issue
                              this.multi_data?.purpose[e[0].datasetIndex].staff[e[0].dataIndex]
                            ),

                          this.tooltip_data[2] +
                            ': ' +
                            curFormatter(
                              // @ts-ignore this issue
                              this.multi_data?.purpose[e[0].datasetIndex].per_staff[0][
                                e[0].dataIndex
                              ]
                            ) +
                            this.symbol
                        ];
                      } else {
                        return [
                          this.tooltip_data[0] +
                            ': ' +
                            curFormatter(
                              this.graphChart.datasets[e[0].datasetIndex].aux_data
                                ? // @ts-ignore this issue
                                  this.graphChart.datasets[e[0].datasetIndex].aux_data[
                                    e[0].dataIndex
                                  ]
                                : 0
                            ) +
                            this.symbol,
                          this.tooltip_data[0] +
                            ': ' +
                            curFormatter(
                              this.graphChart.datasets[e[0].datasetIndex].data[e[0].dataIndex]
                            ) +
                            this.symbol,
                          this.tooltip_data[1] +
                            ': ' +
                            curFormatter(
                              // @ts-ignore this issue
                              this.multi_data?.purpose[e[0].datasetIndex].staff[e[0].dataIndex]
                            ),

                          this.tooltip_data[2] +
                            ': ' +
                            this.multi_data?.purpose[e[0].datasetIndex].per_staff[1][
                              e[0].dataIndex
                            ] +
                            this.symbol
                        ];
                      }
                    case 'subtypes':
                      if (this.symbol !== '$') {
                        return [
                          this.tooltip_data[0] +
                            ': ' +
                            curFormatter(
                              this.graphChart.datasets[e[0].datasetIndex].data[e[0].dataIndex]
                            ) +
                            this.symbol,
                          this.tooltip_data[1] +
                            ': ' +
                            curFormatter(
                              // @ts-ignore this issue
                              this.multi_data?.purpose[e[0].datasetIndex].staff[e[0].dataIndex]
                            ),

                          this.tooltip_data[2] +
                            ': ' +
                            curFormatter(
                              // @ts-ignore this issue
                              this.multi_data?.purpose[e[0].datasetIndex].per_staff[0][
                                e[0].dataIndex
                              ]
                            ) +
                            this.symbol
                        ];
                      } else {
                        return [
                          this.tooltip_data[0] +
                            ': ' +
                            curFormatter(
                              this.graphChart.datasets[e[0].datasetIndex].aux_data
                                ? // @ts-ignore this issue
                                  this.graphChart.datasets[e[0].datasetIndex].aux_data[
                                    e[0].dataIndex
                                  ]
                                : 0
                            ) +
                            this.symbol,
                          this.tooltip_data[0] +
                            ': ' +
                            curFormatter(
                              this.graphChart.datasets[e[0].datasetIndex].data[e[0].dataIndex]
                            ) +
                            this.symbol,
                          this.tooltip_data[1] +
                            ': ' +
                            curFormatter(
                              // @ts-ignore this issue
                              this.multi_data?.purpose[e[0].datasetIndex].staff[e[0].dataIndex]
                            ),

                          this.tooltip_data[2] +
                            ': ' +
                            curFormatter(
                              // @ts-ignore this issue
                              this.multi_data?.purpose[e[0].datasetIndex].per_staff[1][
                                e[0].dataIndex
                              ]
                            ) +
                            this.symbol
                        ];
                      }
                    default:
                      break;
                  }
                }
              },
              title: (e: IEventLine[]) => {
                let label = this.graphChart.datasets[e[0].datasetIndex].label;
                if (this.oneLine) {
                  return this.tooltip_data[0];
                }
                return label;
              },
              label: () => {
                return null;
              }
            },
            backgroundColor: '#fff',
            titleColor: (e: any) => {
              return e.tooltipItems?.[0]?.dataset?.borderColor;
            },
            bodyFont: {
              weight: '700'
            },
            bodyColor: '#1a1a1a',
            displayColors: false
          }
        },
        onClick: (e: any) => {
          // e.chart.tooltip.dataPoints[0].element.options.borderWidth = 5
          // e.chart.tooltip.dataPoints[0].element.options.hoverBorderWidth = 5
          // e.chart.tooltip.dataPoints[0].element.options.hitRadius = 5
          // e.chart.tooltip.dataPoints[0].element.options.rotation = 5
          // e.chart.tooltip.dataPoints[0].element.options.backgroundColor = 'green'
          // e.chart.tooltip.dataPoints[0].element.options.$animations.borderColor._to = 'green'
          // this.data.datasets[0].borderColor = 'red'
          // this.$.update()
          // this.$data.data.datasets[0].borderColor = '#000'
          // this.data.datasets[0].backgroundColor = '#000'
          // this.data.datasets[0].label = 'ssssss'
          // this.$.update()
        }
      }
    };
  },
  methods: {
    changeColors(val: string) {
      this.displayColor = val;
    }
  },
  watch: {
    graphChart: {
      handler(val) {
        this.data = val;
      },
      deep: true
    },
    staff: {
      handler(val) {
        this.staff_count = val;
      },
      deep: true
    },
    per_staff: {
      handler(val) {
        this.perStaff = val;
      },
      deep: true
    },
    symbol: {
      handler(val) {
        this.curr_symb = val;
        this.data = this.graphChart;
        if (this.symbol === '$') {
          let auxdata = this.graphChart.datasets.map((el) => el.aux_data);
          this.data = {
            labels: this.graphChart.labels,
            //@ts-ignore
            datasets: this.graphChart.datasets.map((el, i) => {
              return {
                label: el.label,
                data: auxdata[i],
                borderColor: el.borderColor,
                aux_data: el.aux_data,
                borderWidth: el.borderWidth
              };
            })
          };
        } else {
          this.data = this.graphChart;
        }
      }
    },
    multi_data: {
      handler(val) {
        this.multiData = val;
      },
      deep: true
    },
    chart_type: {
      handler(val) {
        this.chartType = val;
      }
    }
  }
};
</script>
