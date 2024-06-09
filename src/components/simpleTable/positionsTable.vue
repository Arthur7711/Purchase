<script lang="ts" setup>
import { getPositions, type IPositionResponse } from '@/api/positionsTable';
import DataTable from 'primevue/datatable';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import useOffice from '@/store/officesData';
import usePositionsFilters from '../../store/purchases_store/positionsFilter';
import ProgressSpinner from 'primevue/progressspinner';
import { debounce } from '@/helpers/debounse';
import { useInfiniteScroll } from '@vueuse/core';
import usePurchDateTo from '../../store/purchases_store/purchDateTo';
import usePurchDateFrom from '../../store/purchases_store/purchDateFrom';
import TooltipPurchTable from '../custom/tooltipPurchTable.vue';
import ApprovalImage from '../custom/position_table_filters/ApprovalImage.vue';
import useCheckedColumn from '../../store/tablesStore/checkedColumn';
import PositionFilterOptions from './PositionFilterOptions.vue';
import { getProductStatuses } from '@/api/purchasesTable';
import useIncomingFilters from '@/store/purchases_store/incoming_filters';
import { curFormatter } from '@/helpers/currencyFormatter';
import { getCurrencySignName } from '@/helpers/currencySign';
import useUserInfo from '@/store/user';
import type { LocationQuery } from 'vue-router';
import dateFrom from '@/store/dateFrom';
import i18n_config from '@/locales/i18n_config';
import type { IPosition, IPurchase } from '@/views/purchases/components/dialogs/types';
import { getPurchase } from '@/api/purchases';
import { getPosition } from '@/api/positions';
import type { IPositionData } from '@/api/positionsTable';
import usePurchasesInfo from '@/store/purchases_store/purchases';
import ScreenParams from '@/store/screen';
import { colorizeProductStatus } from '@/helpers/colorize_paying_status';
import { useRouter } from 'vue-router';
import { getFiltersParamsNonEmpty } from '@/helpers/queryFilters';

const props = defineProps<{
  query?: LocationQuery;
  tableType: string;
}>();

const { messages, locale } = i18n_config.global;
const isUpdate = ref(true);
const product_statuses = ref<{ id: string | number; name: string }[]>();
const columns = ref<{ field: string }[] | undefined>([
  { field: 'id' },
  { field: 'purchase_id' },
  { field: 'task_id' },
  { field: 'approval' },
  { field: 'status' },
  { field: 'purchase.purchase_date' },
  { field: 'document.document_date' },
  { field: 'document.delivery_date' },
  { field: 'price' },
  { field: 'aux_price' },
  { field: 'contragent' },
  { field: 'purchase.legal_entity' },
  { field: 'type' },
  { field: 'subtype' },
  { field: 'item_name' },
  { field: 'quantity' },
  { field: 'purpose' },
  { field: 'warehouse' },
  { field: 'budget' },
  { field: 'activated_at' },
  { field: 'sn' },
  { field: 'note' }
]);
const router = useRouter();

const selectedSort = ref({
  field: '',
  dir: ''
});
const API_URL_HD = import.meta.env.VITE_VUE_HD;
const emit = defineEmits<{
  (
    e: 'update_top_data',
    value: {
      summ: string | number;
      aux_summ: string | number;
      purch_count: string | number;
      activatedTotalPrice: string | number;
      activatedTotalUSD: string | number;
    }
  ): void;
}>();
let i = 0;
const priority = [
  { id: 1, name: messages[locale].week },
  { id: 2, name: messages[locale]['up to a month'] },
  { id: 3, name: messages[locale]['1-2 months'] }
];
const oldFilters = ref<{ [key: string]: string | number | boolean | (string | number)[] } | null>(
  null
);
const tableData = ref<IPositionResponse>();
const isClickPosition = ref(false);
const el = ref<HTMLElement | null>(null);
const incomingFilters = ref<{
  type_ids: { id: string | number; name: string }[];
  subtype_ids: { id: string | number; name: string }[];
  contragent_ids: { id: string | number; name: string }[];
  warehouse_ids: { id: string | number; name: string }[];
  purpose_ids: { id: string | number; name: string }[];
  budget_ids: { id: string | number; name: string }[];
  legal_ids: { id: string | number; name: string }[];
}>({
  type_ids: [],
  subtype_ids: [],
  contragent_ids: [],
  warehouse_ids: [],
  purpose_ids: [],
  budget_ids: [],
  legal_ids: []
});
const debScroll = debounce(function () {
  i = 0;
}, 300);

const pushTableData = async () => {
  let data: IPositionData[] = [];

  if (tableData.value && usePositionsFilters.filters.value.page !== 1) {
    data = [...tableData.value.data];
  }

  await getPositions({
    ...usePositionsFilters.filters.value,
    date_to: usePurchDateTo.dateTo.value,
    date_from: usePurchDateFrom.dateFrom.value,
    with_filters: true
  }).then((res) => {
    res.data.data.forEach((el) => {
      data.push(el);
    });

    if (tableData.value) tableData.value.data = JSON.parse(JSON.stringify(data)) as IPositionData[];
  });
};

const wrapperWidth = () => {
  if (useCheckedColumn.checkedColumn.value.length < 10) {
    const wrapper = document.querySelector('.p-datatable-wrapper') as any;
    if (wrapper?.style) {
      wrapper.style.paddingRight = useCheckedColumn.checkedColumn.value.length * 120 + 'px';
    }
  } else {
    const wrapper = document.querySelector('.p-datatable-wrapper') as any;
    if (wrapper?.style) {
      wrapper.style.paddingRight = '';
    }
  }
};

const debUpdateTable = debounce(async function () {
  isUpdate.value = true;
  await getPositions({
    ...usePositionsFilters.filters.value,
    date_to: usePurchDateTo.dateTo.value,
    date_from: usePurchDateFrom.dateFrom.value,
    with_filters: true
  }).then((res) => {
    tableData.value = res.data;
    tableData.value?.filters.map((el) => {
      emit('update_top_data', {
        summ: res.data.total_price,
        aux_summ: res.data.total_price_usd,
        purch_count: res.data.total,
        activatedTotalPrice: res.data.activated_total_price,
        activatedTotalUSD: res.data.activated_total_price_usd
      });
      switch (el.name) {
        case 'type_ids':
          if (
            !props.query?.type_ids ||
            !props.query.type_ids.length ||
            !incomingFilters.value.type_ids.length
          ) {
            incomingFilters.value.type_ids = el.options;
          }
          break;
        case 'subtype_ids':
          if (
            !props.query?.subtype_ids ||
            !props.query?.subtype_ids.length ||
            !incomingFilters.value.subtype_ids.length
          ) {
            incomingFilters.value.subtype_ids = el.options;
            incomingFilters.value.subtype_ids.unshift({ id: 0, name: messages[locale].unselected });
          }
          break;
        case 'contragent_ids':
          if (
            !props.query?.contragent_ids ||
            !props.query?.contragent_ids.length ||
            !incomingFilters.value.contragent_ids.length
          ) {
            incomingFilters.value.contragent_ids = el.options;
            incomingFilters.value.contragent_ids.unshift({
              id: 0,
              name: messages[locale].unselected
            });
          }
          break;

        case 'warehouse_ids':
          if (
            !props.query?.warehouse_ids ||
            !props.query?.warehouse_ids.length ||
            !incomingFilters.value.warehouse_ids.length
          ) {
            incomingFilters.value.warehouse_ids = el.options;

            incomingFilters.value.warehouse_ids.unshift({
              id: 0,
              name: messages[locale].unselected
            });
          }
          break;
        case 'purpose_ids':
          if (
            !props.query?.purpose_ids ||
            !props.query?.purpose_ids.length ||
            !incomingFilters.value.purpose_ids.length
          ) {
            incomingFilters.value.purpose_ids = el.options;
            incomingFilters.value.purpose_ids.unshift({ id: 0, name: messages[locale].unselected });
          }
          break;
        case 'budget_ids':
          if (
            !props.query?.budget_ids ||
            !props.query?.budget_ids.length ||
            !incomingFilters.value.budget_ids.length
          ) {
            incomingFilters.value.budget_ids = el.options;
            incomingFilters.value.budget_ids.unshift({ id: 0, name: messages[locale].unselected });
          }
          break;
        case 'legal_ids':
          if (
            !props.query?.legal_ids ||
            !props.query?.legal_ids.length ||
            !incomingFilters.value.legal_ids.length
          ) {
            incomingFilters.value.legal_ids = el.options;
            incomingFilters.value.legal_ids.unshift({ id: 0, name: messages[locale].unselected });
          }
          break;
        default:
          break;
      }
    });
    res.data.filters.map((el) => {
      useIncomingFilters.setIncomingFilters(el.name, el.options);
    });
    useIncomingFilters.setIncomingFilters('priority', priority);
  });
  setTimeout(() => {
    isUpdate.value = false;
  }, 450);
}, 350);

watch(
  () => props.query,
  (value) => {
    if (!isClickPosition.value) {
      value && value.table_type === 'position' && readQueryParamsPositions(value);
    } else if (!usePurchasesInfo.selectedPurchase.value) {
      isClickPosition.value = false;
    }
  }
);

onMounted(async () => {
  props.query && props.query.table_type === 'position' && readQueryParamsPositions(props.query);

  await getProductStatuses().then((res) => {
    product_statuses.value = res.data;
  });

  if (useCheckedColumn.checkedColumn.value?.length) {
    columns.value = useCheckedColumn.checkedColumn.value?.map((el) => {
      return { field: el.field };
    });
  }

  el.value = document.querySelector('.p-datatable-wrapper');

  setTimeout(() => {
    isUpdate.value = false;
  }, 450);
});

watch(
  () => usePurchasesInfo.updateTablePositions.value,
  (value) => {
    if (value) {
      debUpdateTable();
    }
  }
);

watch(
  () => [useOffice.selectedOffice.value, useUserInfo.userData.value?.location.department],
  () => {
    debUpdateTable();
  },
  { deep: true }
);

watch(
  () => [
    usePurchDateFrom.dateFrom.value,
    usePurchDateTo.dateTo.value,
    usePositionsFilters.filters.value.item_id,
    usePositionsFilters.filters.value.purchase_id,
    usePositionsFilters.filters.value.task_id,
    usePositionsFilters.filters.value.note,
    usePositionsFilters.filters.value.name,
    usePositionsFilters.filters.value.name_id,
    usePositionsFilters.filters.value.document_date_from,
    usePositionsFilters.filters.value.document_date_to,
    usePositionsFilters.filters.value.delivered_from,
    usePositionsFilters.filters.value.delivered_to,
    usePositionsFilters.filters.value.price,
    usePositionsFilters.filters.value.aux_price,
    usePositionsFilters.filters.value.priority_ids,
    usePositionsFilters.filters.value.approve_statuses,
    usePositionsFilters.filters.value.product_status_ids,
    usePositionsFilters.filters.value.contragent_ids,
    usePositionsFilters.filters.value.legal_ids,
    usePositionsFilters.filters.value.type_ids,
    usePositionsFilters.filters.value.subtype_ids,
    usePositionsFilters.filters.value.purpose_ids,
    usePositionsFilters.filters.value.budget_ids,
    usePositionsFilters.filters.value.warehouse_ids,
    usePositionsFilters.filters.value.sn,
    usePositionsFilters.filters.value.order_by,
    usePositionsFilters.filters.value.order_dir
  ],
  async () => {
    usePositionsFilters.setPositionsFilters({ val: 1, name: 'page' });

    if (!oldFilters.value) {
      oldFilters.value = { ...usePositionsFilters.filters.value };
    } else if (
      JSON.stringify(oldFilters.value) !== JSON.stringify(usePositionsFilters.filters.value)
    ) {
      if (props.query?.table_type === 'position' && props.tableType === 'position') {
        router.replace({
          query: {
            ...getFiltersParamsNonEmpty(usePositionsFilters.filters.value),
            table_type: 'position',
            date_to: props.query?.date_to,
            date_from: props.query?.date_from,
            date: props.query?.date
          }
        });

        oldFilters.value = { ...usePositionsFilters.filters.value };
      }
    }
    tableData.value?.filters.map((el) => {
      switch (el.name) {
        case 'type_ids':
          if (
            !props.query?.type_ids ||
            !props.query.type_ids.length ||
            !incomingFilters.value.type_ids.length
          ) {
            incomingFilters.value.type_ids = el.options;
          }
          break;
        case 'subtype_ids':
          if (
            !props.query?.subtype_ids ||
            !props.query?.subtype_ids.length ||
            !incomingFilters.value.subtype_ids.length
          ) {
            incomingFilters.value.subtype_ids = el.options;
          }
          break;
        case 'contragent_ids':
          if (
            !props.query?.contragent_ids ||
            !props.query?.contragent_ids.length ||
            !incomingFilters.value.contragent_ids.length
          ) {
            incomingFilters.value.contragent_ids = el.options;
          }
          break;

        case 'warehouse_ids':
          if (
            !props.query?.warehouse_ids ||
            !props.query?.warehouse_ids.length ||
            !incomingFilters.value.warehouse_ids.length
          ) {
            incomingFilters.value.warehouse_ids = el.options;
          }
          break;
        case 'purpose_ids':
          if (
            !props.query?.purpose_ids ||
            !props.query?.purpose_ids.length ||
            !incomingFilters.value.purpose_ids.length
          ) {
            incomingFilters.value.purpose_ids = el.options;
          }
          break;
        case 'budget_ids':
          if (
            !props.query?.budget_ids ||
            !props.query?.budget_ids.length ||
            !incomingFilters.value.budget_ids.length
          ) {
            incomingFilters.value.budget_ids = el.options;
          }
          break;
        case 'legal_ids':
          if (
            !props.query?.legal_ids ||
            !props.query?.legal_ids.length ||
            !incomingFilters.value.legal_ids.length
          ) {
            incomingFilters.value.legal_ids = el.options;
          }
          break;
        default:
          break;
      }
    });
  },
  { deep: true }
);

watch(
  () => el.value,
  () => {
    if (el.value) {
      useInfiniteScroll(
        el,
        () => {
          if (
            i < 1 &&
            tableData.value &&
            usePositionsFilters.filters.value.page < tableData.value?.last_page.toString()
          ) {
            usePositionsFilters.setPositionsFilters({
              val: Number(usePositionsFilters.filters.value.page) + 1,
              name: 'page'
            });
            i++;
          } else debScroll();
        },
        { distance: 100 }
      );
    }
  }
);

watch(
  () => usePositionsFilters.filters.value.page,
  async () => {
    if (!isUpdate.value) {
      isUpdate.value = true;
      await pushTableData();
    } else {
      usePositionsFilters.setPositionsFilters({ val: 1, name: 'page' });
    }
    isUpdate.value = false;
  }
);

watch(
  () => useCheckedColumn.checkedColumn.value,
  () => {
    columns.value = useCheckedColumn.checkedColumn.value?.map((el) => {
      return { field: el.field };
    });
    wrapperWidth();
  }
);

onBeforeUnmount(() => {
  if (ScreenParams.screenParams.width < 900) {
    const wrapper = document.querySelector('.p-datatable-wrapper') as any;
    if (wrapper?.style) {
      wrapper.style.width = '';
    }
  }
});

const handleDir = (val: { field: string; dir: string }) => {
  selectedSort.value = val;
  usePositionsFilters.setPositionsFilters({ val: val.field, name: 'order_by' });
  usePositionsFilters.setPositionsFilters({ val: val.dir, name: 'order_dir' });
};

const readQueryParamsPositions = (propsQuery: LocationQuery): void => {
  Object.keys(propsQuery).forEach((el: string) => {
    switch (el) {
      case 'order_dir':
        selectedSort.value.dir = propsQuery![el] as string;
        usePositionsFilters.setPositionsFilters({ val: propsQuery![el] as string, name: el });
        break;
      case 'order_by':
        selectedSort.value.field = propsQuery![el] as string;
        usePositionsFilters.setPositionsFilters({ val: propsQuery![el] as string, name: el });
        break;
      case 'date_from':
        usePurchDateFrom.setDateFrom(propsQuery![el] as string);
        break;
      case 'date_to':
        usePurchDateTo.setDateTo(propsQuery![el] as string);
        break;
      case 'table_type':
        null;
        break;
      case 'type_ids[]':
      case 'subtype_ids[]':
      case 'warehouse_ids[]':
      case 'contragent_ids[]':
      case 'purpose_ids[]':
      case 'product_status_ids[]':
      case 'budget_ids[]':
      case 'legal_ids[]':
      case 'approve_statuses[]':
        usePositionsFilters.setPositionsFilters({
          val: [propsQuery![el] as string],
          name: el.replace('[]', '')
        });
        break;
      case 'type_ids':
      case 'subtype_ids':
      case 'warehouse_ids':
      case 'contragent_ids':
      case 'purpose_ids':
      case 'budget_ids':
      case 'legal_ids':
      case 'product_status_ids':
      case 'approve_statuses':
        usePositionsFilters.setPositionsFilters({
          val: Array.isArray(props.query![el])
            ? [...(propsQuery![el] as string)]
            : [propsQuery![el] as string],
          name: el
        });
        break;
      default:
        usePositionsFilters.setPositionsFilters({ val: propsQuery![el] as string, name: el });
        break;
    }
  });

  debUpdateTable();
  wrapperWidth();
};

const selectedPosition = async (data: IPosition) => {
  isClickPosition.value = true;
  if (data?.purchase_id) {
    await getPurchase(data.purchase_id).then(async (res: IPurchase) => {
      usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
      await getPosition(data.id).then((ans: IPosition) => {
        usePurchasesInfo.setSelectedPosition(ans);
      });
    });
  }
};
</script>

<template>
  <div
    :class="[
      'positiontable_div_all',
      {
        'positiontable_div_all--curtailed':
          usePurchasesInfo.curtailedPurchases.value.length,
      },
    ]"
  >
    <div
      v-if="isUpdate"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        background-color: rgba(112, 112, 112, 0.281);
        z-index: 1000;
        width: 100vw;
        height: 100vh;
      "
    >
      <div>
        <ProgressSpinner />
      </div>
    </div>
    <DataTable
      :value="tableData?.data"
      :tableClass="'position_table_table'"
      filterDisplay="row"
      scrollable
      @row-click="selectedPosition($event.data)"
      :scroll-height="usePurchasesInfo.curtailedPurchases.value.length ? '68vh' : '82vh'"
      :rowHover="true"
    >
      <Column
        filter
        v-for="(col, i) of columns"
        :frozen="i === 0"
        class="purchtable_column"
        :key="col.field"
      >
        <template #filter>
          <div
            style="
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              font-size: 10px;
            "
          >
            <PositionFilterOptions
              v-if="product_statuses"
              :selected_sort="selectedSort"
              @sel_sort="(val) => handleDir(val)"
              :options="
                col.field === 'status'
                  ? product_statuses
                  : col.field === 'contragent'
                  ? incomingFilters.contragent_ids
                  : col.field === 'budget'
                  ? incomingFilters.budget_ids
                  : col.field === 'purchase.legal_entity'
                  ? incomingFilters.legal_ids
                  : col.field === 'type'
                  ? incomingFilters.type_ids
                  : col.field === 'subtype'
                  ? incomingFilters.subtype_ids
                  : col.field === 'warehouse'
                  ? incomingFilters.warehouse_ids
                  : col.field === 'purpose'
                  ? incomingFilters.purpose_ids
                  : [{ id: 0, name: '' }]
              "
              :field_name="col.field"
            /></div
        ></template>
        <template v-if="col.field === 'id'" #body="{ data }">
          <span
            class="positiontable_div_column"
            style="min-width: 35px; max-width: 35px"
            >{{ data.id }}</span
          >
        </template>
        <template v-else-if="col.field === 'purchase_id'" #body="{ data }">
          <div style="width: 55px" class="positiontable_div_column">
            <span>{{ data.purchase_id }}</span>
          </div>
        </template>
        <template v-else-if="col.field === 'task_id'" #body="{ data }">
          <div
            class="positiontable_div_column"
            style="width: 90px"
            v-tooltip="
              data?.task && {
                value: `<span class='purchtable_tooltip_favourite'>${data.task.body}</span>`,
                escape: true,
                class: 'custom-tooltip-offices',
              }
            "
          >
            <TooltipPurchTable
              :accountname="data?.task ? data.task.user.samaccountname : ' '"
              :is-short="true"
              :name="
                data?.task
                  ? locale === 'ru'
                    ? data.task.user.description
                    : data.task.user.displayname
                  : ''
              "
            />

            <span v-if="!data.task_id">{{ "" }}</span>
            <a
              style="color: black"
              v-else
              :href="`${API_URL_HD}#/?id=${data.task_id}`"
              target="_blank"
              >{{ data.task_id }}</a
            >
          </div>
        </template>
        <template v-else-if="col.field === 'approval'" #body="{ data }">
          <div
            v-if="
              useUserInfo.userData.value?.permissions.control_approve ||
              useUserInfo.userData.value?.permissions.view_approves
            "
            :class="'positiontable_div_column'"
            style="width: 50px"
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data.approval
                  ? locale === 'ru'
                    ? data.approval.user.description
                    : data.approval.user.displayname
                  : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
          >
            <div
              v-if="data.approval"
              style="display: flex"
              :class="
                locale === 'en'
                  ? 'positiontable_div_agreement'
                  : 'positiontable_div_column'
              "
            >
              <ApprovalImage
                :accountname="data.approval ? data.approval.user.samaccountname : ''"
                :status="data.approval.status ? data.approval.status.toLowerCase() : ''"
              />
              <span
                v-if="data?.approval?.purchase_priority !== undefined"
                style="font-size: 12px"
              >
                {{
                  data.approval.purchase_priority === 1
                    ? $t("week")
                    : data.approval.purchase_priority === 2
                    ? $t("up to a month")
                    : $t("1-2 months")
                }}</span
              >
            </div>
            <div v-else style="display: flex">
              <ApprovalImage style="" :accountname="null" :status="''" />
            </div>
          </div>
        </template>
        <template v-else-if="col.field === 'status'" #body="{ data }">
          <div
            class="positiontable_div_column"
            :class="$i18n.locale === 'en' ? 'positiontable_div_status' : ''"
            style="width: 70px; overflow: hidden"
            :style="
              data.status.id ? { color: colorizeProductStatus(data.status.id).color } : ''
            "
          >
            {{ data.status.name }}
          </div>
        </template>
        <template v-else-if="col.field === 'purchase.purchase_date'" #body="{ data }">
          <div class="positiontable_div_column" style="width: 70px">
            {{ data.purchase.purchase_date }}
          </div>
        </template>
        <template v-else-if="col.field === 'document.document_date'" #body="{ data }">
          <div
            :class="
              data?.document?.document_date
                ? 'positiontable_div_column'
                : 'positiontable_div_column_empty'
            "
            style="width: 70px"
          >
            {{ data?.document?.document_date ? data.document.document_date : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'document.delivery_date'" #body="{ data }">
          <div
            :class="
              data?.document?.delivery_date
                ? 'positiontable_div_column'
                : 'positiontable_div_column_empty'
            "
            style="width: 70px"
          >
            {{ data?.document?.delivery_date ? data.document.delivery_date : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'price'" #body="{ data }">
          <div
            class="positiontable_div_column"
            :style="
              data?.price
                ? { justifyContent: 'flex-end', textAlign: 'right' }
                : { justifyContent: 'center', textAlign: 'center', alignItems: 'center' }
            "
          >
            {{
              data?.price
                ? curFormatter(data.price) +
                  " " +
                  getCurrencySignName(data.debited_currency)
                : "—"
            }}
          </div>
        </template>
        <template v-else-if="col.field === 'aux_price'" #body="{ data }">
          <div
            class="positiontable_div_column"
            :style="
              data?.aux_price
                ? { justifyContent: 'flex-end', textAlign: 'right' }
                : { justifyContent: 'center', textAlign: 'center', alignItems: 'center' }
            "
          >
            {{
              data?.aux_price
                ? curFormatter(data.aux_price) +
                  " " +
                  getCurrencySignName(data.aux_currency)
                : "—"
            }}
          </div>
        </template>
        <template v-else-if="col.field === 'contragent'" #body="{ data }">
          <div
            :class="
              data?.purchase?.contragent_id
                ? 'positiontable_div_column'
                : 'positiontable_div_column_empty'
            "
          >
            {{ data?.purchase?.contragent_id ? data.purchase?.contragent.name : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'purchase.legal_entity'" #body="{ data }">
          <div
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data?.purchase.legal_entity ? data.purchase.legal_entity.name : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            :class="
              data?.purchase.legal_entity
                ? 'positiontable_div_column'
                : 'positiontable_div_column_empty'
            "
            style="max-width: 90px; overflow: hidden"
          >
            {{ data?.purchase.legal_entity ? data.purchase.legal_entity.name : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'type'" #body="{ data }">
          <div
            :style="{ width: '80px' }"
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data?.type ? data.type.name : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            :class="
              data?.type ? 'positiontable_div_column' : 'positiontable_div_column_empty'
            "
          >
            {{ data?.type ? data.type.name : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'subtype'" #body="{ data }">
          <div
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data?.subtype ? data.subtype.name : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            style="width: 80px; overflow: hidden; text-overflow: ellipsis"
            :class="
              data?.subtype
                ? 'positiontable_div_column'
                : 'positiontable_div_column_empty'
            "
          >
            {{ data?.subtype ? data.subtype.name : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'item_name'" #body="{ data }">
          <div
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data?.item_name ? data.item_name.name : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            :style="columns?.length < 10 ? { maxWidth: '250px' } : { width: '150px' }"
            :class="
              data?.item_name
                ? 'position_table_div_column'
                : 'position_table_div_column_empty'
            "
            class="positiontable_div_itemname"
          >
            {{ data?.item_name ? data.item_name.name : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'quantity'" #body="{ data }">
          <div class="positiontable_div_column" style="width: 45px">
            {{
              data?.quantity
                ? data.quantity +
                  " " +
                  (data.unit.name === "килограмм" ? "kg" : data.unit.name)
                : "—"
            }}
          </div>
        </template>
        <template v-else-if="col.field === 'purpose'" #body="{ data }">
          <div
            :class="
              data?.purpose
                ? 'position_table_div_column'
                : 'position_table_div_column_empty'
            "
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data?.purpose ? data.purpose.name : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            style="
              width: 80px;
              overflow: hidden;
              display: flex;
              white-space: wrap;
              justify-content: start;
              align-items: start;
            "
          >
            {{ data?.purpose ? data.purpose.name.split(".").join(" ") : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'warehouse'" #body="{ data }">
          <div
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data?.warehouse ? data.warehouse.name : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            :class="
              data?.warehouse
                ? 'position_table_div_column'
                : 'position_table_div_column_empty'
            "
            style="
              max-width: 100%;
              overflow-x: hidden;
              display: flex;
              white-space: wrap;
              justify-content: start;
              align-items: start;
            "
          >
            {{ data?.warehouse ? data.warehouse.name : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'budget'" #body="{ data }">
          <div
            :class="
              data?.budget
                ? 'position_table_div_column'
                : 'position_table_div_column_empty'
            "
            style="
              max-width: 64px;
              overflow-x: hidden;
              display: flex;
              white-space: wrap;
              justify-content: start;
              align-items: start;
            "
          >
            {{ data?.budget ? data.budget.name : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'activated_at'" #body="{ data }">
          <div
            style="max-width: 100%; overflow: hidden; white-space: nowrap"
            :class="
              data?.activated_at
                ? 'position_table_div_column'
                : 'position_table_div_column_empty'
            "
          >
            {{ data?.activated_at ? data.activated_at : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'sn'" #body="{ data }">
          <div
            style="max-width: 100px; overflow: hidden"
            :class="
              data?.sn ? 'position_table_div_column' : 'position_table_div_column_empty'
            "
            v-tooltip="
              data?.sn && {
                value: `<span class='purchtable_tooltip_favourite'>${data.sn}</span>`,
                escape: true,
                class: 'custom-tooltip-offices',
              }
            "
          >
            {{ data?.sn ? data.sn : "—" }}
          </div>
        </template>
        <template v-else-if="col.field === 'note'" #body="{ data }">
          <div
            :class="
              data?.note
                ? 'positiontable_div_column_comment'
                : 'positiontable_div_column_empty'
            "
            v-tooltip="
              data?.note && {
                value: `<span class='purchtable_tooltip_favourite'>${data.note}</span>`,
                escape: true,
                class: 'custom-tooltip-offices',
              }
            "
            style="width: 100%"
            :style="columns?.length < 10 ? { width: '180px' } : { width: '100px' }"
          >
            {{ data?.note ? data.note : "—" }}
          </div>
        </template>
      </Column>
    </DataTable>
    <div
      v-if="!tableData?.data.length"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 48px;
        color: #999999;
        font-size: 16px;
      "
    >
      список пуст
    </div>
  </div>
</template>

<style lang="scss">
@import "./purchTable.scss";
@import "./positionTable.scss";
</style>
