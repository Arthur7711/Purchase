<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { type PropType } from 'vue';
import { Pie } from 'vue-chartjs';
import type { IPieCHartProps } from '@/views/analistic/positionPage/types';
import usePieCache from '../../store/expenses_store/pieCache';
import { curFormatter } from '@/helpers/currencyFormatter';
import useSelectedPieLabel from '../../store/expenses_store/selectedPieLabel';
import usePurposesExp from '../../store/expenses_store/purposes_exp';
import useTypesExp from '../../store/expenses_store/types_exp';
import useSubTypesExp from '../../store/expenses_store/sub_types_exp';
import useBudgetExp from '../../store/expenses_store/budget_exp';
import useLegalExp from '../../store/expenses_store/legal_exp';
import useDateTo from '../../store/dateTo';
import usePieChartDatasets from '../../store/expenses_store/pieChartsDatasets';
import useDateFrom from '../../store/dateFrom';
ChartJS.register(ArcElement, Tooltip, Legend);
 
export default {
  name: 'PiePosition',
  components: {
    Pie
  },
  props: {
    graphChart: {
      type: Object as PropType<IPieCHartProps>,
      required: true
    },
    symbol: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pieData: this.graphChart,
      url: `#/purchases?table_type=position`,
      url_start: import.meta.env.VITE_VUE_PROJECT,
      type: usePieChartDatasets.pieChartType.value,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: 20
        },
        elements: {
          arc: {
            offset: (c: any) => {
              if (c?.dataIndex === useSelectedPieLabel.selectedLabel.value) {
                return 20;
              } else {
                return 0;
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
                return `${curFormatter(context.dataset.data[context.dataIndex])} ${this.symbol}`;
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
        onClick: (e: any) => {
          e.chart.tooltip.dataPoints[0].element.options.offset = 20;
          usePieCache.setPieCashe(e.chart.tooltip.title[0]);
        }
      }
    };
  },
  methods: {
    currFormatter(num: number) {
      return curFormatter(num);
    },
    setLabelActive(label: number | null) {
      useSelectedPieLabel.setSelectedLabel(label);
    },
    setClick(info: string) {
      usePieCache.setPieCashe(info);
    }, 
    openPurch(i: number) {
      switch (usePieChartDatasets.pieChartType.value) {
        case 'purposes':
          window.open(
            `${this.url_start}${this.url}&purpose_ids=${
              usePurposesExp.selectedPurposesExp.value
                ? usePurposesExp.selectedPurposesExp.value[i].id
                : ''
            }&type_ids=${useTypesExp.selectedTypesExp.value
              ?.map((el) => el.id)
              ?.join(`&type_ids=`)}&subtype_ids=${useSubTypesExp.selectedSubTypesExp.value
              ?.map((el) => el.id)
              ?.join(`&subtype_ids=`)}${
              useLegalExp.selectedLegalExp.value
                ? `&legal_ids=${useLegalExp.selectedLegalExp.value}`
                : ``
            }${
              useBudgetExp.selectedBudgetExp.value
                ? `&budget_ids=${useBudgetExp.selectedBudgetExp.value}`
                : ``
            }&date_from=${useDateFrom.dateFrom.value}&date_to=${useDateTo.dateTo.value}`
          );
          break;
        case 'types':
          window.open(
            `${this.url_start}${this.url}&purpose_ids=${usePurposesExp.selectedPurposesExp.value
              ?.map((el) => el.id)
              ?.join(`&purpose_ids=`)}&type_ids=${
              useTypesExp.selectedTypesExp.value ? useTypesExp.selectedTypesExp.value[i].id : ''
            }&subtype_ids=${useSubTypesExp.selectedSubTypesExp.value
              ?.map((el) => el.id)
              ?.join(`&subtype_ids=`)}${
              useLegalExp.selectedLegalExp.value
                ? `&legal_ids=${useLegalExp.selectedLegalExp.value}`
                : ``
            }${
              useBudgetExp.selectedBudgetExp.value
                ? `&budget_ids=${useBudgetExp.selectedBudgetExp.value}`
                : ``
            }&date_from=${useDateFrom.dateFrom.value}&date_to=${useDateTo.dateTo.value}`
          );
          break;
        case 'subtypes':
          window.open(
            `${this.url_start}${this.url}&purpose_ids=${usePurposesExp.selectedPurposesExp.value
              ?.map((el) => el.id)
              ?.join(`&purpose_ids=`)}&type_ids=${useTypesExp.selectedTypesExp.value
              ?.map((el) => el.id)
              ?.join(`&type_ids=`)}&subtype_ids=${
              useSubTypesExp.selectedSubTypesExp.value
                ? useSubTypesExp.selectedSubTypesExp.value[i].id
                : ''
            }${
              useLegalExp.selectedLegalExp.value
                ? `&legal_ids=${useLegalExp.selectedLegalExp.value}`
                : ``
            }${
              useBudgetExp.selectedBudgetExp.value
                ? `&budget_ids=${useBudgetExp.selectedBudgetExp.value}`
                : ``
            }&date_from=${useDateFrom.dateFrom.value}&date_to=${useDateTo.dateTo.value}`
          );
          break;
        default:
          break;
      }
    }
  },
  watch: {
    graphChart: {
      handler(val) {
        this.pieData = val;
        this.type = usePieChartDatasets.pieChartType.value;
      },
      deep: true
    }
  }
};
</script>

<template>
  <div class="position_div_chart">
    <Pie
      v-show="!pieData.labels[0].includes(Infinity.toString()) && pieData.datasets[0].borderColor"
      :data="pieData"
      :options="options"
      :style="{ maxWidth: '500px', maxHeight: '500px' }"
      id="pie_suppliers"
    ></Pie>
    <div
      :class="
        type === 'subtypes'
          ? 'piechart_exp_div_legend_subtype'
          : type === 'types'
          ? 'piechart_exp_div_legend_type'
          : 'piechart_exp_div_legend'
      "
    >
      <div
        class="piechart_exp_div_legend_container"
        v-for="(label, i) in pieData.labels"
        :key="label"
      >
        <div
          class="piechart_exp_div_legend_container_inside"
          v-if="
            Number(label.split(' ')[label.split(' ').length - 1].replace('%', '')) > 0 &&
            !label.includes(Infinity.toString())
          "
        >
          <div @mouseenter="setLabelActive(i)" class="piechart_exp_div_legend_grid">
            <div
              :style="{
                backgroundColor: pieData.datasets[0].backgroundColor[i],
                maxHeight: '10px',
                minWidth: '10px',
                minHeight: '10px',
                maxWidth: '10px'
              }"
            ></div>
            <div @click="setClick(label)" class="exp_div_label">
              {{ label.includes(Infinity.toString()) ? 'Loading...' : label }}
            </div>
            <div class="pie_exp_div_price">
              <span style="text-align: right; white-space: nowrap" @click="setClick(label)">{{
                currFormatter(pieData.datasets[0].data[i]) + symbol
              }}</span
              ><img
                @click="
                  () => {
                    openPurch(i);
                  }
                "
                class="pie_exp_img_arrow"
                src="../icons/arrowUpRight.svg"
                alt="^"
              />
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#pie_suppliers .chartjs-tooltip-title {
  color: red; /* Change this to the desired color */
}

.position_div_chart {
  min-width: 20vw;
  max-width: 20vw;
  display: flex;
}
.piechart_exp_div_legend_grid {
  display: grid;
  grid-template-columns: repeat(4, 180px);
}
.piechart_exp_div_legend {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  min-width: max-content;
  min-height: 250px;
  max-height: 250px;
}

.piechart_exp_div_legend_type {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  min-width: max-content;
  min-height: 355px;
  max-height: 450px;
}

.piechart_exp_div_legend_subtype {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  min-width: max-content;
  min-height: 355px;
  max-height: 750px;
}

.piechart_exp_div_legend_container {
  margin-left: 30px;
  max-width: 420px;
}

.piechart_exp_div_legend_container_inside {
  min-width: 10vw;
  margin-top: 8px;
  margin-left: -20px;
  cursor: pointer;
}

.pie_exp_div_price {
  display: flex;
  justify-content: flex-end;
  margin-left: -50px;
  margin-bottom: -7px;
  max-width: 80px;
  margin-top: -9px;
  /* margin-right: 150px; */
  /* text-align: left; */
}

.pie_exp_img_arrow {
  margin-left: 5px;
  margin-top: 5px;
  min-width: 7.5px;
  max-width: 7.5px;
  min-height: 7.5px;
  max-height: 7.5px;
}

.exp_div_label {
  margin-top: -7px;
  margin-left: -150px;
  color: #1565c0;
  min-width: 220px;
  max-width: 220px;
  overflow-x: hidden;
  white-space: nowrap;
  overflow-y: hidden;
}

@media only screen and (max-width: 650px) {
  .position_div_chart {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20vh;
    overflow-x: hidden;
    justify-content: center;
    min-width: 100vw;
    margin-left: -10vw;
  }
  .piechart_exp_div_legend,
  .piechart_exp_div_legend_subtype,
  .piechart_exp_div_legend_type {
    max-width: 90vw;
    min-width: 90vw;
    margin-left: -20px;
    display: flex;
    flex-direction: row;
  }
  .piechart_exp_div_legend_grid {
    display: grid;
    grid-template-columns: repeat(4, 165px);
    margin-top: 10px;
  }
}
</style>
