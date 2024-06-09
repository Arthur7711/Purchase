<script setup lang="ts">
import {
  getBudgetExp,
  getLegalEntities,
  getOverviewStatistics,
  getPurposesSummary,
  getterLineDownMultiline,
  getterLineDownMultilineSubTypes,
  getterLineDownMultilineTypes,
  getterLineDownOneLine,
  getterOfficeStaffTimeline,
  getterStaffTimeline,
  type ILineStaff,
  type ILineUnited,
  type IOverview
} from '@/api/expenses';
import useBudgetExp from '../../../store/expenses_store/budget_exp';
import useLegalExp from '../../../store/expenses_store/legal_exp';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import useDateFrom from '../../../store/dateFrom';
import useDateTo from '../../../store/dateTo';
import ProgressSpinner from 'primevue/progressspinner';
import DropdownPrices from '@/components/dropdown_prices/DropdownPrices.vue';
import useUserInfo from '../../../store/user';
import DropdownCurrency from '@/components/dropdown_prices/DropdownCurrency.vue';
import DropdownBudget from '../../../components/dropdown_exp/DropdownBudget.vue';
import useTypesExp from '../../../store/expenses_store/types_exp';
import useSubTypesExp from '../../../store/expenses_store/sub_types_exp';
import usePurposesExp from '../../../store/expenses_store/purposes_exp';
import useOfficeId from '../../../store/officeId';
import DropdownLegal from '@/components/dropdown_exp/DropdownLegal.vue';
import { CurrSymbol } from '../../../helpers/diction';
import type { IPieCHartProps } from '../positionPage/types';
import PieChartExpenses from '@/components/charts/PieChartExpenses.vue';
import usePieColor from '../../../store/expenses_store/pieChartsDatasets';
import pieChartsDatasets from '../../../store/expenses_store/pieChartsDatasets';
import DropdownTypes from '../../../components/dropdown_exp/DropdownTypes.vue';
import { analytTypes } from './constants';
import usePieCash from '../../../store/expenses_store/pieCache';
import { handleGetterPurpChange, handleGetterTopUpdata, handleGetterTypeChange } from './getters';
import useSelectedPieLabel from '../../../store/expenses_store/selectedPieLabel';
import { debouncedWatch } from '@vueuse/core';
import ChartPie from '@/components/icons/ChartPie.vue';
import ChartBar from '@/components/icons/ChartBar.vue';
import InputSwitch from 'primevue/inputswitch';
import LineChart from '@/components/charts/LineChart.vue';
import type { ILineChartProps } from '@/components/charts/types';
import LineChartExp from '@/components/charts/LineChartExp.vue';
import Dropdown_noneBorder from '@/components/dropdown_exp/Dropdown_noneBorder.vue';
import { debounce } from '@/helpers/debounse';
import type { ISecondLineDataMulti } from './types';
import infoDisplayer from '../../../components/custom/infoDisplayer.vue';
import i18n_config from '@/locales/i18n_config';
import ScreenParams from '@/store/screen';
import { useRoute, useRouter } from 'vue-router';
import dateTo from '../../../store/dateTo';
import dateFrom from '../../../store/dateFrom';

const { messages, locale } = i18n_config.global;
const chartLoading = ref(false);
const lineChartLoading = ref(false);
const isLoading = ref(true);
const expData = ref<IOverview | null>(null);
const mounting = ref(false);
const selectedCurrency = ref();
const changeChart = ref(true);
const LineChartStaffData = ref<ILineChartProps | null>(null);
const LineChartOfficeStaffData = ref<ILineChartProps | null>(null);
const router = useRouter();
const route = useRoute();
// const locale = i18n_config.global.locale
const secondData = ref<{
  staff: (string | number)[];
  per_staff: (string | number)[];
  per_staff_aux: (string | number)[];
}>({
  staff: [],
  per_staff: [],
  per_staff_aux: []
});
const savePurposes = ref<string[]>();
const secondDataMulti = ref<ISecondLineDataMulti>({
  purpose: [
    {
      colors: '',
      staff: [],
      per_staff: []
    }
  ],
  types: [
    {
      colors: '',
      staff: [],
      per_staff: []
    }
  ],
  subtypes: [
    {
      colors: '',
      staff: [],
      per_staff: []
    }
  ]
});
const LineChartDownOneLineData = ref<ILineChartProps | null>(null);
const LineChartDownMultilinedata = ref<ILineChartProps[]>([]);
const showInfo = ref(false);
const lineChartTopTypes = ref([
  { title: messages[locale]['number of all employees'], id: 0 },
  { title: messages[locale]['number of employees in the office'], id: 1 }
]);

const selectedLineTypes = ref<string | number>(0);
const paidStatus = [
  { id: 0, name: messages[locale]['paid and scheduled'] },
  { id: 1, name: messages[locale]['paid'] }
];

const selectedChartTab = ref(false);
const showDropdowns = ref(false);
const PieChartData = ref<IPieCHartProps[]>([
  {
    labels: [],
    datasets: [{ backgroundColor: [], data: [], borderColor: [] }]
  },
  {
    labels: [],
    datasets: [{ backgroundColor: [], data: [], borderColor: [] }]
  },
  {
    labels: [],
    datasets: [{ backgroundColor: [], data: [], borderColor: [] }]
  }
]);

const office = ref(
  useUserInfo.userData.value?.location.office_name === 'Saint-Petersburg'
    ? messages[locale]['St. Petersburg']
    : useUserInfo.userData.value?.location.office_name === 'Minsk'
    ? messages[locale]['Minsk']
    : useUserInfo.userData.value?.location.office_name === 'Yerevan'
    ? messages[locale]['Yerevan']
    : useUserInfo.userData.value?.location.office_name === 'Global'
    ? ' Global'
    : useUserInfo.userData.value?.location.office_name === 'Bytex'
    ? ' Bytex'
    : messages[locale]['Loading...']
);
const onlyPaid = ref<string | number>(0);

const currencyInfo = ref([
  {
    id: 0,
    title:
      useUserInfo.userCurrency.value === 'BYN'
        ? messages[locale]['Belarusian ruble BYN']
        : useUserInfo.userCurrency.value === 'AMD'
        ? messages[locale]['Armenian dram ֏']
        : useUserInfo.userCurrency.value == 'USD'
        ? messages[locale]['US dollar $']
        : messages[locale]['Russian ruble ₽']
  },
  { id: 1, title: messages[locale]['US dollar $'] }
]);

const symbol = ref(currencyInfo.value[0].title.slice(-2));

const changeStatus = (stat: 0 | 1 | '0' | '1') => {
  onlyPaid.value = stat;
};
const currencyGenerator = () => {
  if (useUserInfo.userCurrency.value !== 'USD') {
    currencyInfo.value = [
      {
        id: 0,
        title:
          useUserInfo.userCurrency.value === 'BYN'
            ? messages[locale]['Belarusian ruble BYN']
            : useUserInfo.userCurrency.value === 'AMD'
            ? messages[locale]['Armenian dram ֏']
            : useUserInfo.userCurrency.value == 'USD'
            ? messages[locale]['US dollar $']
            : messages[locale]['Russian ruble ₽']
      },
      { id: 1, title: messages[locale]['US dollar $'] }
    ];
  } else {
    currencyInfo.value = [
      {
        id: 0,
        title: messages[locale]['US dollar $']
      }
    ];
  }
};

const purpChartData = () => {
  PieChartData.value[0] = {
    labels: [],
    datasets: [{ backgroundColor: [], data: [], borderColor: [] }]
  };
  usePurposesExp.selectedPurposesExp.value?.map((el) => {
    PieChartData.value[0].labels.push(
      el.name +
        ' ' +
        ((Number(el.price_sum) / Number(usePurposesExp.allPurposesExp.value?.total)) * 100 > 0.01
          ? (Number(el.price_sum) / Number(usePurposesExp.allPurposesExp.value?.total)) * 100
          : 0.01
        )
          .toFixed(1)
          .toString() +
        '%'
    );
    PieChartData.value[0].datasets[0].backgroundColor.push(
      usePieColor.pieColorsPurp.value[
        usePurposesExp.allPurposesExp.value?.data.findIndex((elem) => {
          return elem.name === el.name;
        }) as number
      ]
    );
    PieChartData.value[0].datasets[0].borderColor.push(
      usePieColor.pieColorsPurp.value[
        usePurposesExp.allPurposesExp.value?.data.findIndex((elem) => {
          return elem.name === el.name;
        }) as number
      ]
    );
    PieChartData.value[0].datasets[0].data.push(
      symbol.value !== '$' ? Number(el.price_sum) : Number(el.aux_price_sum)
    );
  });
};

const cashReducer = (el: string, i: number) => {
  usePieCash.removePieCashe(i);
};

const typeChartData = () => {
  PieChartData.value[1] = {
    labels: [],
    datasets: [{ backgroundColor: [], data: [], borderColor: [] }]
  };
  useTypesExp.selectedTypesExp.value?.map((el, i) => {
    PieChartData.value[1].labels.push(
      el.name +
        ' ' +
        ((Number(el.price_sum) / Number(useTypesExp.allTypesExp.value?.total)) * 100 > 0.01
          ? (Number(el.price_sum) / Number(useTypesExp.allTypesExp.value?.total)) * 100
          : 0.01
        )
          .toFixed(1)
          .toString() +
        '%'
    );
    PieChartData.value[1].datasets[0].backgroundColor.push(
      usePieColor.pieColorsType.value[
        useTypesExp.allTypesExp.value?.data.findIndex((elem) => {
          return elem.name === el.name;
        }) as number
      ]
    );
    PieChartData.value[1].datasets[0].borderColor.push(
      usePieColor.pieColorsType.value[
        useTypesExp.allTypesExp.value?.data.findIndex((elem) => {
          return elem.name === el.name;
        }) as number
      ]
    );
    PieChartData.value[1].datasets[0].data.push(
      symbol.value !== '$' ? Number(el.price_sum) : Number(el.aux_price_sum)
    );
  });
};

const subtypeChartData = () => {
  PieChartData.value[2] = {
    labels: [],
    datasets: [{ backgroundColor: [], data: [], borderColor: [] }]
  };
  useSubTypesExp.selectedSubTypesExp.value?.map((el) => {
    PieChartData.value[2].labels.push(
      el.name +
        ' ' +
        ((Number(el.price_sum) / Number(useSubTypesExp.allSubTypesExp.value?.total)) * 100 > 0.01
          ? (Number(el.price_sum) / Number(useSubTypesExp.allSubTypesExp.value?.total)) * 100
          : 0.01
        )
          .toFixed(1)
          .toString() +
        '%'
    );
    PieChartData.value[2].datasets[0].backgroundColor.push(
      usePieColor.pieColorsType.value[
        useSubTypesExp.allSubTypesExp.value?.data.findIndex((elem) => {
          return elem.name === el.name;
        }) as number
      ]
    );
    PieChartData.value[2].datasets[0].borderColor.push(
      usePieColor.pieColorsType.value[
        useSubTypesExp.allSubTypesExp.value?.data.findIndex((elem) => {
          return elem.name === el.name;
        }) as number
      ]
    );
    PieChartData.value[2].datasets[0].data.push(
      symbol.value !== '$' ? Number(el.price_sum) : Number(el.aux_price_sum)
    );
  });
};

const handleGetterMounted = () => {
  isLoading.value = true;
  getBudgetExp().then((res) => useBudgetExp.setAllBudgetExp(res.data));
  getLegalEntities().then((res) => useLegalExp.setAllLegalExp(res.data));

  isLoading.value = false;
};

const handleGetOverwiew = () => {
  getOverviewStatistics({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    onlyPaid: onlyPaid.value,
    legalId: useLegalExp.selectedLegalExp.value,
    budgetId: useBudgetExp.selectedBudgetExp.value,
    purposeIds: usePurposesExp.selectedPurposesExp.value
      ? usePurposesExp.selectedPurposesExp.value.map((el) => el.id)
      : null,
    typeIds: useTypesExp.selectedTypesExp.value
      ? useTypesExp.selectedTypesExp.value.map((el) => el.id)
      : null,
    subtypeIds: useSubTypesExp.selectedSubTypesExp.value
      ? useSubTypesExp.selectedSubTypesExp.value.map((el) => el.id)
      : null
  }).then((res) => {
    expData.value = res.data;
    setTimeout(() => {
      chartLoading.value = false;
    }, 300);
  });
};

const updateChartData = () => {
  purpChartData();
  typeChartData();
  subtypeChartData();
};

const updateLineChartData = async () => {
  lineChartLoading.value = true;
  if (changeChart.value) {
    if (selectedLineTypes.value === 0) {
      await getterOfficeStaffTimeline(useDateFrom.dateFrom.value, useDateTo.dateTo.value)
        .then(({ data }: { data: ILineStaff }) => {
          let dataSet = data.datasets.map((el) => {
            return {
              label: `${el.label}`,
              data: el.data.map((el) => Number(el.staff_count)),
              borderColor: '#C2185B80'
            };
          });
          LineChartOfficeStaffData.value = {
            labels: data.labels,
            datasets: dataSet
          };
        })
        .catch((err) => console.log(err));
    }
    await getterStaffTimeline(useDateFrom.dateFrom.value, useDateTo.dateTo.value)
      .then(({ data }: { data: ILineStaff }) => {
        let dataSet = data.datasets.map((el) => {
          return {
            label: el.label,
            data: el.data.map((el) => Number(el.staff_count)),
            borderColor: '#C2185B80'
          };
        });
        LineChartStaffData.value = {
          labels: data.labels,
          datasets: dataSet
        };
      })
      .catch((err) => console.log(err));

    await getterLineDownOneLine({
      dateFrom: useDateFrom.dateFrom.value,
      dateTo: useDateTo.dateTo.value,
      only_paid: onlyPaid.value,
      legal_id: useLegalExp.selectedLegalExp.value,
      budget_id: useBudgetExp.selectedBudgetExp.value,
      purpose_ids: usePurposesExp.selectedPurposesExp.value
        ? usePurposesExp.selectedPurposesExp.value?.map((el) => el.id)
        : null,
      type_ids: useTypesExp.selectedTypesExp.value
        ? useTypesExp.selectedTypesExp.value.map((el) => el.id)
        : null,
      subtype_ids: useSubTypesExp.selectedSubTypesExp.value
        ? useSubTypesExp.selectedSubTypesExp.value.map((el) => el.id)
        : null,
      staff_mode: selectedLineTypes.value
    })
      .then(({ data }: { data: ILineUnited }) => {
        const dataSet = data.datasets.map((el) => {
          secondData.value.staff = el.data.map((el) => el.staff_count);
          secondData.value.per_staff = el.data.map((el) => el.per_staff_price_sum);
          secondData.value.per_staff_aux = el.data.map((el) => el.per_staff_aux_price_sum);
          return {
            label: `${messages[locale]['total cost']}`,
            data: el.data.map((el) => Number(el.price_sum)),
            borderColor: '#C2185B80',
            aux_data: el.data.map((el) => Number(el.aux_price_sum))
          };
        });
        LineChartDownOneLineData.value = {
          labels: data.labels,
          datasets: dataSet
        };
      })
      .catch((err) => console.log(err));
  } else if (!changeChart.value) {
    lineChartLoading.value = true;
    await getterLineDownMultiline({
      dateFrom: useDateFrom.dateFrom.value,
      dateTo: useDateTo.dateTo.value,
      only_paid: onlyPaid.value,
      legal_id: useLegalExp.selectedLegalExp.value,
      budget_id: useBudgetExp.selectedBudgetExp.value,
      purpose_ids: usePurposesExp.selectedPurposesExp.value
        ? usePurposesExp.selectedPurposesExp.value?.map((el) => el.id)
        : null,
      type_ids: useTypesExp.selectedTypesExp.value
        ? useTypesExp.selectedTypesExp.value.map((el) => el.id)
        : null,
      subtype_ids: useSubTypesExp.selectedSubTypesExp.value
        ? useSubTypesExp.selectedSubTypesExp.value.map((el) => el.id)
        : null,
      staff_mode: selectedLineTypes.value
    })
      .then(({ data }: { data: ILineUnited }) => {
        let dataSet = data.datasets.map((el, i) => {
          secondDataMulti.value.purpose[i] = {
            colors:
              usePieColor.pieColorsPurp.value[
                usePurposesExp.allPurposesExp.value?.data.findIndex((elem) => {
                  return elem.name === el.label;
                }) as number
              ],
            staff: el.data.map((el) => el.staff_count),
            per_staff: [
              el.data.map((el) => el.per_staff_price_sum),
              el.data.map((el) => el.per_staff_aux_price_sum)
            ]
          };
          return {
            label: el.label,
            data: el.data.map((el) => Number(el.price_sum)),
            borderColor:
              usePieColor.pieColorsPurp.value[
                usePurposesExp.allPurposesExp.value?.data.findIndex((elem) => {
                  return elem.name === el.label;
                }) as number
              ],
            aux_data: el.data.map((el) => Number(el.aux_price_sum))
          };
        });
        LineChartDownMultilinedata.value[0] = {
          labels: data.labels,
          datasets: dataSet
        };
      })
      .catch((err) => console.log(err));

    await getterLineDownMultilineTypes({
      dateFrom: useDateFrom.dateFrom.value,
      dateTo: useDateTo.dateTo.value,
      only_paid: onlyPaid.value,
      legal_id: useLegalExp.selectedLegalExp.value,
      budget_id: useBudgetExp.selectedBudgetExp.value,
      purpose_ids: usePurposesExp.selectedPurposesExp.value
        ? usePurposesExp.selectedPurposesExp.value?.map((el) => el.id)
        : null,
      type_ids: useTypesExp.selectedTypesExp.value
        ? useTypesExp.selectedTypesExp.value.map((el) => el.id)
        : null,
      subtype_ids: useSubTypesExp.selectedSubTypesExp.value
        ? useSubTypesExp.selectedSubTypesExp.value.map((el) => el.id)
        : null,
      staff_mode: selectedLineTypes.value
    })
      .then(({ data }: { data: ILineUnited }) => {
        secondDataMulti.value.types;
        let dataSet = data.datasets.map((el, i) => {
          secondDataMulti.value.types[i] = {
            colors:
              usePieColor.pieColorsPurp.value[
                usePurposesExp.allPurposesExp.value?.data.findIndex((elem) => {
                  return elem.name === el.label;
                }) as number
              ],
            staff: el.data.map((el) => el.staff_count),
            per_staff: [
              el.data.map((el) => el.per_staff_price_sum),
              el.data.map((el) => el.per_staff_aux_price_sum)
            ]
          };
          return {
            label: el.label,
            data: el.data.map((el) => Number(el.price_sum)),
            borderColor:
              usePieColor.pieColorsPurp.value[
                useTypesExp.allTypesExp.value?.data.findIndex((elem) => {
                  return elem.name === el.label;
                }) as number
              ],
            aux_data: el.data.map((el) => Number(el.aux_price_sum))
          };
        });
        LineChartDownMultilinedata.value[1] = {
          labels: data.labels,
          datasets: dataSet
        };
      })
      .catch((err) => console.log(err));
    await getterLineDownMultilineSubTypes({
      dateFrom: useDateFrom.dateFrom.value,
      dateTo: useDateTo.dateTo.value,
      only_paid: onlyPaid.value,
      legal_id: useLegalExp.selectedLegalExp.value,
      budget_id: useBudgetExp.selectedBudgetExp.value,
      purpose_ids: usePurposesExp.selectedPurposesExp.value
        ? usePurposesExp.selectedPurposesExp.value?.map((el) => el.id)
        : null,
      type_ids: useTypesExp.selectedTypesExp.value
        ? useTypesExp.selectedTypesExp.value.map((el) => el.id)
        : null,
      subtype_ids: useSubTypesExp.selectedSubTypesExp.value
        ? useSubTypesExp.selectedSubTypesExp.value.map((el) => el.id)
        : null,
      staff_mode: selectedLineTypes.value
    })
      .then(({ data }: { data: ILineUnited }) => {
        let dataSet = data.datasets.map((el, i) => {
          secondDataMulti.value.subtypes[i] = {
            colors:
              usePieColor.pieColorsPurp.value[
                usePurposesExp.allPurposesExp.value?.data.findIndex((elem) => {
                  return elem.name === el.label;
                }) as number
              ],
            staff: el.data.map((el) => el.staff_count),
            per_staff: [
              el.data.map((el) => el.per_staff_price_sum),
              el.data.map((el) => el.per_staff_aux_price_sum)
            ]
          };
          return {
            label: el.label,
            data: el.data.map((el) => Number(el.price_sum)),
            borderColor:
              usePieColor.pieColorsPurp.value[
                useSubTypesExp.allSubTypesExp.value?.data.findIndex((elem) => {
                  return elem.name === el.label;
                }) as number
              ],
            aux_data: el.data.map((el) => Number(el.aux_price_sum))
          };
        });
        LineChartDownMultilinedata.value[2] = {
          labels: data.labels,
          datasets: dataSet
        };
      })
      .catch((err) => console.log(err));
  }

  lineChartLoading.value = false;
};

const debUpdateLineChartData = debounce(function () {
  updateLineChartData();
  chartLoading.value = false;
}, 600);

const debGetterMounted = debounce(function () {
  handleGetterMounted();
}, 300);

const debGetterPurp = debounce(function () {
  getPurposesSummary({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    onlyPaid: onlyPaid.value,
    legalId: useLegalExp.selectedLegalExp.value,
    budgetId: useBudgetExp.selectedBudgetExp.value
  }).then((data) => {
    if (data.data.data.length > 0) {
      usePurposesExp.setAllPurposesExp(data.data);
      usePurposesExp.setSelectedTypesExp(
        data.data.data.filter((el) => el.id === route.query?.purposes)
      );
    } else {
      usePurposesExp.setAllPurposesExp({ data: [], total: '' });
      isLoading.value = false;
      chartLoading.value = false;
    }
    usePurposesExp.setIsmounted(true);
  });
}, 300);

const changeCurrency = (curr: string | number) => {
  selectedCurrency.value = curr;
  symbol.value =
    currencyInfo.value[selectedCurrency.value].title[
      currencyInfo.value[selectedCurrency.value].title.length - 1
    ];
  updateChartData();
};

const changeLegal = (leg: string | number) => {
  useLegalExp.setSelectedLegal(leg);
};

const changeBudget = (bgt: string) => {
  useBudgetExp.selectedBudgetExp.value = bgt;
};

const handleChangePieType = (val: string) => {
  pieChartsDatasets.setChartType(val);
};

onMounted(() => {
  debGetterMounted();
  debGetterPurp();
  useTypesExp.allTypesExp.value = null;
  useSubTypesExp.allSubTypesExp.value = null;
  setTimeout(() => {
    mounting.value = true;
  }, 600);
  pieChartsDatasets.setChartType('purposes');
  updateChartData();
});

debouncedWatch(
  () => selectedLineTypes.value,
  () => {
    if (mounting.value) {
      debUpdateLineChartData();
    }
  },
  { debounce: 400 }
);

watch(
  () => [
    useUserInfo.userCurrency.value,
    useUserInfo.userData.value?.location.currency,
    useOfficeId.officeId.value
  ],
  () => {
    office.value =
      useUserInfo.userData.value?.location.office_name === 'Saint-Petersburg'
        ? messages[locale]['St. Petersburg']
        : useUserInfo.userData.value?.location.office_name === 'Minsk'
        ? messages[locale]['Minsk']
        : useUserInfo.userData.value?.location.office_name === 'Yerevan'
        ? messages[locale]['Yerevan']
        : useUserInfo.userData.value?.location.office_name === 'Global'
        ? ' Global'
        : useUserInfo.userData.value?.location.office_name === 'Bytex'
        ? ' Bytex'
        : '';
    currencyGenerator();
  }
);

debouncedWatch(
  () => useSelectedPieLabel.selectedLabel.value,
  () => {
    updateChartData();
  },
  { debounce: 300 }
);
watch(
  () => symbol.value,
  () => updateChartData()
);

watch(
  () => usePieCash.pieCashe.value.length,
  () => {
    switch (usePieCash.pieCashe.value.length) {
      case 1:
        pieChartsDatasets.setChartType('purposes');
        chartLoading.value = true;
        setTimeout(() => {
          chartLoading.value = false;
        }, 700);

        break;
      case 2:
        pieChartsDatasets.setChartType('types');
        chartLoading.value = true;
        setTimeout(() => {
          chartLoading.value = false;
        }, 1000);

        break;
      case 3:
        pieChartsDatasets.setChartType('subtypes');
        chartLoading.value = true;
        setTimeout(() => {
          chartLoading.value = false;
        }, 700);

        break;
    }
  }
);

watch(
  () => selectedLineTypes.value,
  () => {
    debUpdateLineChartData();
  }
);
watch(
  () => changeChart.value,
  () => {
    if (mounting.value) {
      debUpdateLineChartData();
    }
  }
);

debouncedWatch(
  () => [useOfficeId.officeId.value],
  () => {
    chartLoading.value = true;
    handleGetterMounted();
  }
);

debouncedWatch(
  () => useOfficeId.officeId.value,
  () => {
    getterOfficeStaffTimeline(useDateFrom.dateFrom.value, useDateTo.dateTo.value)
      .then(({ data }: { data: ILineStaff }) => {
        let dataSet = data.datasets.map((el) => {
          return {
            label: `${el.label}`,
            data: el.data.map((el) => Number(el.staff_count)),
            borderColor: '#C2185B80'
          };
        });
        LineChartOfficeStaffData.value = {
          labels: data.labels,
          datasets: dataSet
        };
      })
      .catch((err) => console.log(err));
  }
);
const asyncUpdate = async () => {
  debGetterPurp();
};
debouncedWatch(
  () => [
    useDateFrom.dateFrom.value,
    useDateTo.dateTo.value,
    useOfficeId.officeId.value,
    onlyPaid.value,
    useBudgetExp.selectedBudgetExp.value,
    useLegalExp.selectedLegalExp.value,
    currencyInfo.value
  ],
  async () => {
    if (mounting.value) {
      chartLoading.value = true;
      handleGetterTopUpdata(onlyPaid.value);
    }
    usePieCash.removePieCashe(0);
    updateChartData();
    debUpdateLineChartData(true);
    await asyncUpdate().then(() => {
      debGetterPurp();
    });
  },
  { debounce: 600 }
);

debouncedWatch(
  () => [usePurposesExp, useTypesExp, useSubTypesExp],
  () => {
    if (router.currentRoute.value.fullPath.includes('expenses')) {
      router.push(
        `/analytics/expenses?${
          usePurposesExp?.selectedPurposesExp?.value
            ? '&purposes=' +
              usePurposesExp?.selectedPurposesExp?.value
                .map((el) => encodeURIComponent(el.id))
                .join(',')
            : ''
        }${
          useTypesExp?.selectedTypesExp?.value
            ? '&types=' +
              useTypesExp?.selectedTypesExp?.value.map((el) => encodeURIComponent(el.id)).join(',')
            : ''
        }${
          useSubTypesExp?.selectedSubTypesExp?.value
            ? '&subtypes=' +
              useSubTypesExp?.selectedSubTypesExp?.value
                .map((el) => encodeURIComponent(el.id))
                .join(',')
            : ''
        }&date_from=${encodeURIComponent(dateFrom.dateFrom.value)}&date_to=${encodeURIComponent(
          dateTo.dateTo.value
        )}${
          useLegalExp.selectedLegalExp.value
            ? '&legal=' + encodeURIComponent(useLegalExp.selectedLegalExp.value)
            : ''
        }${
          useBudgetExp.selectedBudgetExp.value
            ? '&budgets=' + encodeURIComponent(useBudgetExp.selectedBudgetExp.value)
            : ''
        }`
      );
    }
  },
  { deep: true, debounce: 600 }
);

debouncedWatch(
  () => [usePurposesExp.selectedPurposesExp.value],
  () => {
    handleGetterPurpChange(onlyPaid.value);
    debUpdateLineChartData();
    updateChartData();
  },
  { debounce: 600 }
);

debouncedWatch(
  () => [useTypesExp.selectedTypesExp.value],
  () => {
    handleGetterTypeChange(onlyPaid.value);
    debUpdateLineChartData();
    updateChartData();
  },
  { debounce: 100 }
);

debouncedWatch(
  () => useSubTypesExp.selectedSubTypesExp.value,
  () => {
    handleGetOverwiew();
    debUpdateLineChartData();
    updateChartData();
  },
  { debounce: 50 }
);

watch(
  () => useUserInfo.userData.value?.location,
  () => {
    currencyInfo.value = [];
    currencyGenerator();
    changeCurrency(0);
  }
);
onBeforeUnmount(() => {});
</script>

<template>
  <div v-if="!isLoading">
    <div class="exp_page_div_topgroup">
      <span
        >{{ $t("costs") }} : &nbsp; {{ office }}
        <img
          v-if="useUserInfo.userData.value?.location.currency === 'RUB'"
          src="../../../components/icons/ru.svg"
          alt="."
          class="exp_page_img_flag"
        />
        <img
          v-else-if="useUserInfo.userData.value?.location.currency === 'BYN'"
          src="../../../components/icons/by.svg"
          class="exp_page_img_flag"
          alt="."
        />
        <img
          v-else-if="useUserInfo.userData.value?.location.currency === 'AMD'"
          src="../../../components/icons/am.svg"
          class="exp_page_img_flag"
          alt="."
        />
        <span
          v-else-if="useUserInfo.userData.value?.location.currency === 'USD'"
          src="../../../components/icons/by.png"
          alt="."
          >&#127758;</span
        >
      </span>
      <button
        class="exp_div_button_show_dropdowns"
        v-if="ScreenParams.screenParams.width < 650"
        @click="showDropdowns = !showDropdowns"
      >
        {{ showDropdowns ? $t("hide filters group") : $t("show filters group") }}
      </button>
      <div
        v-if="showDropdowns || ScreenParams.screenParams.width > 650"
        class="exp_div_dropdown-group"
      >
        <DropdownPrices @change-event="changeStatus" :drop-types="paidStatus">
          <template #icon>
            <img src="../../../components/icons/clock.svg" alt="" />
            <p>&nbsp;&nbsp;{{ $t("payment status") }}&nbsp;</p>
          </template>
        </DropdownPrices>
        <DropdownLegal
          @change-event="changeLegal"
          v-if="useLegalExp.allLegalExp.value"
          :drop-types="useLegalExp.allLegalExp.value"
        >
          <template #icon>
            <img src="../../../components/icons/officeBuild.svg" alt="" />
            <p>&nbsp;&nbsp;{{ $t("legal entities: all") }}&nbsp;</p>
          </template>
        </DropdownLegal>
        <DropdownBudget
          :drop-types="useBudgetExp.allBudgetExp.value"
          v-if="useBudgetExp.allBudgetExp.value"
          @change-event="changeBudget"
        >
          <template #icon>
            <img src="../../../components/icons/coins.svg" alt="" />
            <p>&nbsp;&nbsp;{{ $t("budgets: all") }}&nbsp;</p>
          </template>
        </DropdownBudget>
        <DropdownCurrency @change-event="changeCurrency" :drop-types="currencyInfo">
          <template #icon>
            <img src="../../../components/icons/money.svg" alt="" />
            <p>&nbsp;&nbsp;{{ $t("currency") }}&nbsp;</p>
          </template>
        </DropdownCurrency>
      </div>
    </div>
    <div
      v-if="
        expData?.price_sum.toString().length &&
        useSubTypesExp.selectedSubTypesExp.value?.length &&
        useSubTypesExp.allSubTypesExp.value?.data.length &&
        pieChartsDatasets.pieColorsPurp.value.length &&
        pieChartsDatasets.pieColorsSubType.value.length &&
        pieChartsDatasets.pieColorsType.value.length &&
        usePurposesExp.allPurposesExp.value?.data.length
      "
      class="exp_div_top_datacontainer"
    >
      <infoDisplayer
        :percent="expData.percent_price_sum"
        class="exp_info_displayer"
        :summ="[expData.price_sum, expData.aux_price_sum]"
        :symbol="symbol"
        :font-size-number="
          expData.price_sum && expData.aux_price_sum
            ? String(expData.price_sum).length > 9 ||
              String(expData.aux_price_sum).length > 9
              ? '24px'
              : '30px'
            : '30px'
        "
        :mode="'summ'"
        :title="$t('total')"
      />
      <infoDisplayer
        class="exp_div_second exp_info_displayer"
        :percent="expData.percent_per_staff_price_sum"
        :summ="[expData.per_staff_price_sum, expData.per_staff_aux_price_sum]"
        :font-size-number="
          expData.price_sum && expData.aux_price_sum
            ? String(expData.price_sum).length > 9 ||
              String(expData.aux_price_sum).length > 9
              ? '24px'
              : '30px'
            : '30px'
        "
        :symbol="symbol"
        :mode="'summ'"
        :title="$t('average per employee')"
      />
      <infoDisplayer
        :mode="'customer'"
        class="exp_info_displayer"
        :title="$t('employees on average')"
        :font-size-number="
          expData.price_sum && expData.aux_price_sum
            ? String(expData.price_sum).length > 9 ||
              String(expData.aux_price_sum).length > 9
              ? '24px'
              : '30px'
            : '30px'
        "
        :staff="expData.staff_avg"
        :staff_percent="expData.diff_staff_avg"
      />
      <infoDisplayer
        :mode="'customer'"
        class="exp_info_displayer"
        :title="$t('employees in the office')"
        :font-size-number="
          expData.price_sum && expData.aux_price_sum
            ? String(expData.price_sum).length > 9 ||
              String(expData.aux_price_sum).length > 9
              ? '24px'
              : '30px'
            : '30px'
        "
        :staff="expData.office_staff_avg"
        :staff_percent="expData.diff_office_staff_avg"
      />
    </div>
    <div
      v-else-if="!usePurposesExp.allPurposesExp.value?.data.length"
      style="display: flex; justify-content: center; padding-top: 100px"
    >
      <h1>{{ $t("no data") }}</h1>
    </div>
    <div
      v-else-if="chartLoading && !isLoading"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
      "
    >
      <ProgressSpinner />
    </div>
    <div class="exp_div_chart_block">
      <div class="exp_div_middle-bar">
        <div class="exp_div_middle-bar__drops" style="display: flex; align-items: center">
          <DropdownTypes
            class="exp_dropdown_analyt_types"
            @change-event="handleChangePieType"
            :drop-types="analytTypes"
          >
            <template #icon>
              <img src="../../../components/icons/currencyWallet.svg" alt="$$" />
            </template>
          </DropdownTypes>
          <div
            v-if="
              expData?.price_sum.toString().length &&
              !chartLoading &&
              useSubTypesExp.selectedSubTypesExp.value?.length &&
              useSubTypesExp.allSubTypesExp.value?.data.length &&
              pieChartsDatasets.pieColorsPurp.value.length &&
              pieChartsDatasets.pieColorsSubType.value.length &&
              pieChartsDatasets.pieColorsType.value.length &&
              usePurposesExp.allPurposesExp.value?.data.length &&
              selectedChartTab
            "
            class="exp_div_switcher"
          >
            <InputSwitch
              :style="{ marginTop: '80px', marginLeft: '24px' }"
              v-model="changeChart"
            />
            <div>{{ $t("combine data in 1 curve") }}</div>
          </div>
        </div>
        <div class="exp_div_charts_switcher">
          <button
            class="icon_button"
            @click="
              () => {
                selectedChartTab = true;
                selectedLineTypes = 0;
              }
            "
          >
            <ChartBar :selected="selectedChartTab" />
          </button>
          <button class="icon_button" @click="() => (selectedChartTab = false)">
            <ChartPie :selected="!selectedChartTab" />
          </button>
        </div>
      </div>
      <div
        class="exp_div_cashe_dispatch"
        v-if="!selectedChartTab && usePurposesExp.allPurposesExp.value?.data.length"
      >
        <span
          class="active"
          :key="el"
          v-for="(el, i) in usePieCash.pieCashe.value"
          @click="cashReducer(el, i)"
          >{{ i === 1 || i === 2 ? "<" : "" }}&nbsp;{{ el }} &nbsp;</span
        >
      </div>
      <div
        v-if="
          !chartLoading &&
          !selectedChartTab &&
          usePurposesExp.allPurposesExp.value?.data.length
        "
        class="exp_div_piechart"
      >
        <PieChartExpenses
          v-if="
            PieChartData[0].datasets.length &&
            PieChartData[1].datasets.length &&
            PieChartData[2].datasets.length &&
            pieChartsDatasets.pieColorsPurp.value.length &&
            pieChartsDatasets.pieColorsSubType.value.length &&
            pieChartsDatasets.pieColorsType.value.length &&
            usePurposesExp.allPurposesExp.value?.data.length &&
            !selectedChartTab
          "
          :symbol="symbol"
          :graph-chart="
            pieChartsDatasets.pieChartType.value === 'purposes'
              ? PieChartData[0]
              : pieChartsDatasets.pieChartType.value === 'types'
              ? PieChartData[1]
              : PieChartData[2]
          "
        />
      </div>

      <div
        v-else-if="
          selectedChartTab &&
          PieChartData[0].datasets.length &&
          PieChartData[1].datasets.length &&
          PieChartData[2].datasets.length &&
          pieChartsDatasets.pieColorsPurp.value.length &&
          pieChartsDatasets.pieColorsSubType.value.length &&
          pieChartsDatasets.pieColorsType.value.length &&
          usePurposesExp.allPurposesExp.value?.data.length
        "
      >
        <div class="exp_div_top_chart">
          <Dropdown_noneBorder
            v-if="
              selectedChartTab &&
              PieChartData[0].datasets.length &&
              PieChartData[1].datasets.length &&
              PieChartData[2].datasets.length &&
              pieChartsDatasets.pieColorsPurp.value.length &&
              pieChartsDatasets.pieColorsSubType.value.length &&
              pieChartsDatasets.pieColorsType.value.length &&
              usePurposesExp.allPurposesExp.value?.data.length
            "
            @change-event="
              (val) => {
                selectedLineTypes = val;
              }
            "
            :drop-types="lineChartTopTypes"
          />
          <LineChart
            class="exp_top_chart"
            v-if="
              LineChartStaffData !== null &&
              LineChartOfficeStaffData !== null &&
              !lineChartLoading
            "
            :graph-chart="
              Number(selectedLineTypes) === 0
                ? LineChartStaffData
                : LineChartOfficeStaffData
            "
          />
        </div>
        <div class="exp_div_down_chart">
          <div style="display: flex">
            <span class="exp_span_down_chart"
              >{{ $t("costs by") }}
              {{
                pieChartsDatasets.pieChartType.value === "purposes"
                  ? $t("purposes")
                  : pieChartsDatasets.pieChartType.value === "types"
                  ? $t("on types")
                  : $t("on subtypes")
              }}</span
            >
          </div>
          <div class="exp_div_down_chart_child">
            <LineChartExp
              class="exp_down_chart"
              v-if="LineChartDownOneLineData !== null && !lineChartLoading"
              :graph-chart="
                !changeChart
                  ? pieChartsDatasets.pieChartType.value === 'purposes'
                    ? LineChartDownMultilinedata?.[0]
                    : pieChartsDatasets.pieChartType.value === 'types'
                    ? LineChartDownMultilinedata?.[1]
                    : LineChartDownMultilinedata?.[2]
                  : LineChartDownOneLineData
              "
              :tooltip_data="[
                $t('total cost'),
                $t('employees'),
                $t('per month per employee'),
              ]"
              :staff="secondData.staff.length ? secondData.staff : ['']"
              :per_staff="
                symbol !== '$'
                  ? secondData.per_staff.length
                    ? secondData.per_staff
                    : ['']
                  : secondData.per_staff_aux
              "
              :multi_data="secondDataMulti"
              :one-line="changeChart"
              :symbol="symbol"
              :chart_type="pieChartsDatasets.pieChartType.value"
            />
          </div>
        </div>
      </div>
      <div
        v-else-if="!usePurposesExp.allPurposesExp.value?.data.length"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 100px;
        "
      >
        <h1>{{ $t("no data") }}</h1>
      </div>
      <div
        v-else
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
        "
      >
        <ProgressSpinner />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "./expenses.scss";

// .v-enter-active,
// .v-leave-active {
//   transition: all 0.4s ease-in;
//   transform: translateY(10px) scale(1);
// }

// .v-enter-from,
// .v-leave-to {
//   opacity: 0;
//   transform: translateY(-60px) scale(0.6);
// }
</style>
