<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import FilterOptions from './filterOptions.vue';
import type { emittedValuePurch } from './types';
import {
  getPurchases,
  type IPurchResponse,
  getPurchasesNonFilters,
  getPaymentStatuses,
  type Item
} from '../../api/purchasesTable';
import useIncomingFilters from '@/store/purchases_store/incoming_filters';
import { changeWarehousePurchase, getPurchase } from '@/api/purchases';
import useFilters from '@/store/purchases_store/filters';
import payColorize from '../custom/payColorize.vue';
import Bill_active from '../icons/bill_active.vue';
import Contract_active from '../icons/contract_active.vue';
import Closed_doc_active from '../icons/closed_doc_active.vue';
import Other_doc_active from '../icons/other_doc_active.vue';
import useCheckedColumn from '../../store/tablesStore/checkedColumn';
import { useInfiniteScroll } from '@vueuse/core';
import { debounce } from '../../helpers/debounse';
import { getProductStatuses } from '../../api/purchasesTable';
import usePurchDateTo from '../../store/purchases_store/purchDateTo';
import usePurchDateFrom from '../../store/purchases_store/purchDateFrom';
import useUserInfo from '../../store/user';
import usePurchasesInfo from '@/store/purchases_store/purchases';
import useCommonsInfo, { type IDocTypes } from '../../store/purchases_store/commons';
import ProgressSpinner from 'primevue/progressspinner';
import {
  postFavorite,
  deleteFavouriteArr,
  deleteFavourite,
  getFavourite,
  getFavouriteNonFilters
} from '@/api/favoriteTablePurchases';
import useOffice from '../../store/officesData';
import { curFormatter } from '@/helpers/currencyFormatter';
import { getCurrencySignName } from '@/helpers/currencySign';
import TooltipPurchTable from '../custom/tooltipPurchTable.vue';
import bankImage from '../custom/variableCommons/bankImage.vue';
import type { IPurchase } from '../../views/purchases/components/dialogs/types';
import i18n_config from '@/locales/i18n_config';
import type { LocationQuery } from 'vue-router';
import { useRouter } from 'vue-router';
import { getFiltersParamsNonEmpty } from '@/helpers/queryFilters';

const props = defineProps<{
  tableType: string;
  query?: LocationQuery;
}>();
const tableData = ref<IPurchResponse | null>(null);
const columns = ref<{ field: string }[] | undefined>([
  { field: 'id' },
  { field: 'specialist' },
  { field: 'purchase_date' },
  { field: 'payings' },
  { field: 'comming_date' },
  { field: 'description' },
  { field: 'payment_status' },
  { field: 'info.approve_status' },
  { field: 'info.product_status' },
  { field: 'info.items_sum_price' },
  { field: 'info.payings_sum_price' },
  { field: 'contragent' },
  { field: 'legal_entity' },
  { field: 'payment_type' },
  { field: 'card_holder' },
  { field: 'doc_closing_exists' },
  { field: 'note' }
]);
const selectedRows = ref();
const incomingFilters = ref<{
  specialist_ids: { id: string | number; name: string }[];
  legal_ids: { id: string | number; name: string }[];
  contragent_ids: { id: string | number; name: string }[];
  payment_type_ids: { id: string | number; name: string }[];
  card_holder_ids: { id: string | number; name: string }[];
}>({
  specialist_ids: [],
  legal_ids: [],
  contragent_ids: [],
  payment_type_ids: [],
  card_holder_ids: []
});

const oldFiltersPurch = ref<{
  [key: string]: string | number | boolean | (string | number)[];
} | null>(null);
const oldFiltersFavorite = ref<{
  [key: string]: string | number | boolean | (string | number)[];
} | null>(null);
const router = useRouter();

const { messages, locale } = i18n_config.global;
const isUpdate = ref(false);
const el = ref<HTMLElement | null>(null);
const options = ref<{ id: number | string; name: string }[] | undefined>([]);
const filters = ref({
  id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  specialist: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  purchase_date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  payings: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  comming_date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  payment_status: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  pay: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  delivery: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'info.approve_status': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'info.product_status': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'info.items_sum_price': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'info.payings_sum_price': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  contragent: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  legal_entity: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  payment_type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  card_holder: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  doc_closing_exists: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  note: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
});
const payment_statuses = ref<{ id: string | number; name: string }[]>([]);
const product_statuses = ref<{ id: string | number; name: string }[]>([]);
const isClickPurchase = ref(false);
const document_types = ref<IDocTypes[] | null>(null);
const isLoading = ref(false);
const approve_statuses = [
  { id: 'none', name: messages[locale]['no match'] },
  { id: 'pending', name: messages[locale].pending },
  { id: 'rejected', name: messages[locale].rejected },
  { id: 'accepted', name: messages[locale].accepted }
];
let i = 0;

const updateOptions = async () => {
  product_statuses.value = useCommonsInfo.commons.value.productStatuses as {
    id: string | number;
    name: string;
  }[];
  payment_statuses.value = useCommonsInfo.commons.value.paymentStatuses as {
    id: string | number;
    name: string;
  }[];
  document_types.value = useCommonsInfo.commons.value.document_types_purchase as IDocTypes[];

  useIncomingFilters.setIncomingFilters('approve_statuses', approve_statuses);
  useIncomingFilters.setIncomingFilters(
    'product_statuses',
    useCommonsInfo.commons.value.productStatuses as { id: string | number; name: string }[]
  );
  useIncomingFilters.setIncomingFilters(
    'payment_statuses',
    useCommonsInfo.commons.value.paymentStatuses as { id: string | number; name: string }[]
  );
  useIncomingFilters.setIncomingFilters(
    'document_types',
    useCommonsInfo.commons.value.document_types_purchase as IDocTypes[]
  );
};

const debUpdateDataTable = debounce(function () {
  isUpdate.value = true;
  updateTable();
}, 350);

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

const updateTable = async (mounted?: boolean) => {
  if (props.tableType === 'purchase') {
    useFilters.setFiltersPurch({ val: 1, name: 'page' });
    await getPurchases({
      ...useFilters.filtersPurch.value,
      date_to: usePurchDateTo.dateTo.value,
      date_from: usePurchDateFrom.dateFrom.value
    })
      .then((res) => {
        tableData.value = null;
        tableData.value = res.data;
        emit('update_top_data', {
          summ: res.data.total_price,
          aux_summ: res.data.total_price_usd,
          purch_count: res.data.total,
          activatedTotalPrice: 0,
          activatedTotalUSD: 0
        });
        useIncomingFilters.removeFilters();
        tableData.value.filters.map((el) => {
          useIncomingFilters.setIncomingFilters(el.name, el.options);
          switch (el.name) {
            case 'specialist_ids':
              if (
                !props.query?.specialist_ids ||
                !props.query?.specialist_ids.length ||
                !incomingFilters.value.specialist_ids.length
              ) {
                incomingFilters.value.specialist_ids = el.options;
              }
              break;
            case 'legal_ids':
              if (
                !props.query?.legal_ids ||
                !props.query?.legal_ids.length ||
                !incomingFilters.value.legal_ids.length
              ) {
                incomingFilters.value.legal_ids = el.options;
                incomingFilters.value.legal_ids.unshift({
                  id: 0,
                  name: messages[locale].unselected
                });
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
            case 'payment_type_ids':
              if (
                !props.query?.payment_type_ids ||
                !props.query?.payment_type_ids.length ||
                !incomingFilters.value.payment_type_ids.length
              ) {
                incomingFilters.value.payment_type_ids = el.options;
                incomingFilters.value.payment_type_ids.unshift({
                  id: 0,
                  name: messages[locale].unselected
                });
              }
              break;
            case 'card_holder_ids':
              if (
                !props.query?.card_holder_ids ||
                !props.query?.card_holder_ids.length ||
                !incomingFilters.value.card_holder_ids.length
              ) {
                incomingFilters.value.card_holder_ids = el.options;
                incomingFilters.value.card_holder_ids.unshift({
                  id: 0,
                  name: messages[locale].unselected
                });
              }
              break;
            default:
              break;
          }
        });
      })
      .catch((err) => err);
  } else if (props.tableType === 'favourite') {
    await getFavourite({ ...useFilters.filtersFavourite.value }, mounted)
      .then((res) => {
        tableData.value = null;
        tableData.value = res.data;
        emit('update_top_data', {
          summ: res.data.total_price,
          aux_summ: res.data.total_price_usd,
          purch_count: res.data.total,
          activatedTotalPrice: 0,
          activatedTotalUSD: 0
        });
        tableData.value.filters.map((el) => {
          useIncomingFilters.setIncomingFilters(el.name, el.options);
          switch (el.name) {
            case 'specialist_ids':
              if (
                !props.query?.specialist_ids ||
                !props.query?.specialist_ids.length ||
                !incomingFilters.value.specialist_ids.length
              ) {
                incomingFilters.value.specialist_ids = el.options;
              }
              break;
            case 'legal_ids':
              if (
                !props.query?.legal_ids ||
                !props.query?.legal_ids.length ||
                !incomingFilters.value.legal_ids.length
              ) {
                incomingFilters.value.legal_ids = el.options;
                incomingFilters.value.legal_ids.unshift({
                  id: 0,
                  name: messages[locale].unselected
                });
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
            case 'payment_type_ids':
              if (
                !props.query?.payment_type_ids ||
                !props.query?.payment_type_ids.length ||
                !incomingFilters.value.payment_type_ids.length
              ) {
                incomingFilters.value.payment_type_ids = el.options;
                incomingFilters.value.payment_type_ids.unshift({
                  id: 0,
                  name: messages[locale].unselected
                });
              }
              break;
            case 'card_holder_ids':
              if (
                !props.query?.card_holder_ids ||
                !props.query?.card_holder_ids.length ||
                !incomingFilters.value.card_holder_ids.length
              ) {
                incomingFilters.value.card_holder_ids = el.options;
                incomingFilters.value.card_holder_ids.unshift({
                  id: 0,
                  name: messages[locale].unselected
                });
              }
              break;
            default:
              break;
          }
        });
      })
      .catch((err) => err);
  }
  updateOptions();
  isUpdate.value = false;
};

const debScroll = debounce(function () {
  i = 0;
}, 300);

const handleFilters = (val: { val: string; field_name: string }) => {
  if (props.tableType === 'purchase') {
    useFilters.setFiltersPurch({ val: val.val, name: val.field_name });
  } else if (props.tableType === 'favourite') {
    useFilters.setFiltersFav({ val: val.val, name: val.field_name });
  }
};

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
  (e: 'fav_click', val: string): void;
}>();

const handleDelete = async () => {
  if (selectedRows.value.length >= 2) {
    await deleteFavouriteArr(selectedRows.value.map((el: { id: string | number }) => el.id));
    selectedRows.value = [];
    setTimeout(async () => {
      await updateTable();
    }, 350);
  } else {
    await deleteFavourite(selectedRows.value[0].id);
    selectedRows.value = [];
    setTimeout(async () => {
      await updateTable();
    }, 350);
  }
};

onMounted(async () => {
  if (useCheckedColumn.checkedColumn.value?.length) {
    columns.value = useCheckedColumn.checkedColumn.value?.map((el) => {
      return { field: el.field };
    });
  }
  isLoading.value = true;
  await updateOptions();

  props.query &&
    (props.query.table_type === 'purchase' || props.query.table_type === 'favourite') &&
    props.tableType === props.query.table_type &&
    (await readQueryParamsPurchaseAndFav(props.query, props.tableType));

  el.value = document.querySelector('.p-datatable-wrapper');
  if (props.tableType === 'favourite') {
    const checkbox = document.querySelectorAll('.p-selection-column');
    checkbox.forEach((t) => {
      t.classList.remove('p-selection-column');
      t.classList.add('purchtable_column');
    });
  }
  wrapperWidth();
  isLoading.value = false;
});

watch(
  () => el.value,
  () => {
    if (el.value) {
      if (props.tableType === 'purchase') {
        useInfiniteScroll(
          el,
          () => {
            if (
              i < 1 &&
              tableData.value &&
              useFilters.filtersPurch.value.page < tableData.value?.last_page.toString()
            ) {
              useFilters.setFiltersPurch({
                val: Number(useFilters.filtersPurch.value.page) + 1,
                name: 'page'
              });
              i++;
            } else debScroll();
          },
          { distance: 100 }
        );
      } else {
        useInfiniteScroll(
          el,
          () => {
            if (
              i < 1 &&
              tableData.value &&
              useFilters.filtersFavourite.value.page < tableData.value?.last_page.toString()
            ) {
              useFilters.setFiltersPurch({
                val: Number(useFilters.filtersFavourite.value.page) + 1,
                name: 'page'
              });
              i++;
            } else debScroll();
          },
          { distance: 100 }
        );
      }
    }
  }
);

watch(
  () => usePurchasesInfo.updateTablePurchases.value,
  (value) => {
    if (value) updateTable();
  }
);

watch(
  () => useFilters.filtersPurch.value.page,
  async () => {
    if (props.tableType === 'purchase') {
      if (!isLoading.value) {
        isUpdate.value = true;
        let data: Item[] = [];

        if (tableData.value && useFilters.filtersPurch.value.page !== 1) {
          data = [...tableData.value.data];
        }
        await getPurchasesNonFilters({
          ...useFilters.filtersPurch.value,
          date_to: usePurchDateTo.dateTo.value,
          date_from: usePurchDateFrom.dateFrom.value
        })
          .then((res) => {
            res.data.data.forEach((el) => {
              data.push(el);
            });

            if (tableData.value) tableData.value.data = JSON.parse(JSON.stringify(data)) as Item[];

            emit('update_top_data', {
              summ: res.data.total_price,
              aux_summ: res.data.total_price_usd,
              purch_count: res.data.total,
              activatedTotalPrice: 0,
              activatedTotalUSD: 0
            });
          })
          .finally(() => {
            isUpdate.value = false;
          });
      } else {
        useFilters.setFiltersPurch({ val: 1, name: 'page' });
      }
    }
  }
);

watch(
  () => useFilters.filtersFavourite.value.page,
  async () => {
    if (props.tableType === 'favourite') {
      if (!isLoading.value) {
        isUpdate.value = true;
        let data: Item[] = [];

        if (tableData.value && useFilters.filtersPurch.value.page !== 1) {
          data = [...tableData.value.data];
        }
        await getFavouriteNonFilters({ ...useFilters.filtersFavourite.value })
          .then((res) => {
            res.data.data.forEach((el) => {
              data.push(el);
            });

            if (tableData.value) tableData.value.data = JSON.parse(JSON.stringify(data)) as Item[];

            emit('update_top_data', {
              summ: res.data.total_price,
              aux_summ: res.data.total_price_usd,
              purch_count: res.data.total,
              activatedTotalPrice: 0,
              activatedTotalUSD: 0
            });
          })
          .finally(() => {
            isUpdate.value = false;
          });
      } else {
        useFilters.setFiltersFav({ val: 1, name: 'page' });
      }
    }
  }
);

watch(
  () => [usePurchDateTo.dateTo.value, usePurchDateFrom.dateFrom.value],
  () => {
    if (props.tableType !== 'favourite') {
      if (!isLoading.value) {
        debUpdateDataTable();
      }
    }
  }
);

watch(
  () => [useOffice.selectedOffice.value, useUserInfo.userData.value?.location.department],
  () => {
    if (!isLoading.value) {
      debUpdateDataTable();
    }
  },
  { deep: true }
);

watch(
  () => [
    useFilters.filtersPurch.value.price,
    useFilters.filtersPurch.value.paying_sum,
    useFilters.filtersPurch.value.purchase_id,
    useFilters.filtersPurch.value.note,
    useFilters.filtersPurch.value.description,
    useFilters.filtersPurch.value.payment_type_ids,
    useFilters.filtersPurch.value.card_holder_ids,
    useFilters.filtersPurch.value.type_document_ids,
    useFilters.filtersPurch.value.approve_statuses,
    useFilters.filtersPurch.value.payment_status_ids,
    useFilters.filtersPurch.value.specialist_ids,
    useFilters.filtersPurch.value.contragent_ids,
    useFilters.filtersPurch.value.product_status_ids,
    useFilters.filtersPurch.value.legal_ids,
    useFilters.filtersPurch.value.delivered_from,
    useFilters.filtersPurch.value.delivered_to,
    useFilters.filtersPurch.value.paid_from,
    useFilters.filtersPurch.value.paid_to,
    useFilters.filtersPurch.value.types_ids
  ],
  () => {
    if (props.tableType === 'purchase') {
      if (props.query?.table_type === 'purchase') {
        if (!oldFiltersPurch.value) {
          oldFiltersPurch.value = { ...useFilters.filtersPurch.value };
        } else if (
          JSON.stringify(oldFiltersPurch.value) !== JSON.stringify(useFilters.filtersPurch.value)
        ) {
          router.replace({
            query: {
              ...getFiltersParamsNonEmpty(useFilters.filtersPurch.value),
              table_type: props.tableType,
              date_to: props.query?.date_to,
              date_from: props.query?.date_from,
              date: props.query?.date
            }
          });
        }
      }
    }
  },
  { deep: true }
);

watch(
  () => [
    useFilters.filtersFavourite.value.price,
    useFilters.filtersFavourite.value.paying_sum,
    useFilters.filtersFavourite.value.purchase_id,
    useFilters.filtersFavourite.value.note,
    useFilters.filtersFavourite.value.description,
    useFilters.filtersFavourite.value.payment_type_ids,
    useFilters.filtersFavourite.value.card_holder_ids,
    useFilters.filtersFavourite.value.type_document_ids,
    useFilters.filtersFavourite.value.approve_statuses,
    useFilters.filtersFavourite.value.payment_status_ids,
    useFilters.filtersFavourite.value.specialist_ids,
    useFilters.filtersFavourite.value.contragent_ids,
    useFilters.filtersFavourite.value.product_status_ids,
    useFilters.filtersFavourite.value.legal_ids,
    useFilters.filtersFavourite.value.delivered_from,
    useFilters.filtersFavourite.value.delivered_to,
    useFilters.filtersFavourite.value.paid_from,
    useFilters.filtersFavourite.value.paid_to,
    useFilters.filtersFavourite.value.types_ids
  ],
  () => {
    if (props.tableType === 'favourite') {
      if (props.query?.table_type === 'favourite') {
        if (!oldFiltersFavorite.value) {
          oldFiltersFavorite.value = { ...useFilters.filtersFavourite.value };
        } else if (
          JSON.stringify(oldFiltersFavorite.value) !==
          JSON.stringify(useFilters.filtersFavourite.value)
        ) {
          router.replace({
            query: {
              ...getFiltersParamsNonEmpty(useFilters.filtersFavourite.value),
              table_type: props.tableType,
              date_to: props.query?.date_to,
              date_from: props.query?.date_from,
              date: props.query?.date
            }
          });
        }
      }
    }
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

watch(
  () => props.query,
  (value) => {
    if (!isClickPurchase.value) {
      value &&
        (value.table_type === 'purchase' || value.table_type === 'favourite') &&
        props.tableType === value.table_type &&
        readQueryParamsPurchaseAndFav(value, props.tableType);
    } else if (!usePurchasesInfo.selectedPurchase.value) {
      isClickPurchase.value = false;
    }
  }
);

onBeforeUnmount(() => {
  const wrapper = document.querySelector('.p-datatable-wrapper') as any;
  if (wrapper?.style) {
    wrapper.style.width = '';
  }
});

const selectedPurchase = async (value: IPurchase) => {
  isClickPurchase.value = true;
  if (value?.id) {
    await getPurchase(value.id).then((res) => {
      usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
    });
  }
};

const readQueryParamsPurchaseAndFav = (propsQuery: LocationQuery, table: string): void => {
  Object.keys(propsQuery).forEach((el: string) => {
    switch (el) {
      case 'date_from':
        usePurchDateFrom.setDateFrom(propsQuery![el] as string);
        break;
      case 'date_to':
        usePurchDateTo.setDateTo(propsQuery![el] as string);
        break;
      case 'table_type':
        null;
        break;
      case 'specialist_ids[]':
      case 'payment_status_ids[]':
      case 'approve_statuses[]':
      case 'product_status_ids[]':
      case 'contragent_ids[]':
      case 'legal_ids[]':
      case 'payment_type_ids[]':
      case 'card_holder_ids[]':
      case 'type_document_ids[]':
        table === 'purchase'
          ? useFilters.setFiltersPurch({
              val: [propsQuery![el] as string],
              name: el.replace('[]', '')
            })
          : useFilters.setFiltersFav({
              val: [propsQuery![el] as string],
              name: el.replace('[]', '')
            });
        break;
      case 'specialist_ids':
      case 'payment_status_ids':
      case 'approve_statuses':
      case 'product_status_ids':
      case 'contragent_ids':
      case 'legal_ids':
      case 'payment_type_ids':
      case 'card_holder_ids':
      case 'type_document_ids':
        table === 'purchase'
          ? useFilters.setFiltersPurch({
              val: Array.isArray(propsQuery![el])
                ? [...(propsQuery![el] as string)]
                : [propsQuery![el] as string],
              name: el
            })
          : useFilters.setFiltersFav({
              val: Array.isArray(propsQuery![el])
                ? [...(propsQuery![el] as string)]
                : [propsQuery![el] as string],
              name: el
            });
        break;
      default:
        table === 'purchase'
          ? useFilters.setFiltersPurch({ val: propsQuery![el] as string, name: el })
          : useFilters.setFiltersFav({ val: propsQuery![el] as string, name: el });
        break;
    }
  });

  if (table === 'purchase') {
    oldFiltersPurch.value = { ...useFilters.filtersPurch.value };
  } else {
    oldFiltersFavorite.value = { ...useFilters.filtersFavourite.value };
  }

  debUpdateDataTable();
  wrapperWidth();
};
</script>

<template>
  <div
    :class="[
      'purchtable_div_all',
      {
        'purchtable_div_all--curtailed': usePurchasesInfo.curtailedPurchases.value.length
      }
    ]"
  >
    <div v-if="isUpdate" class="purchtable_div_spinner">
      <div>
        <ProgressSpinner />
      </div>
    </div>
    <DataTable
      v-model:selection="selectedRows"
      v-model:filters="filters"
      :value="tableData?.data"
      filterDisplay="row"
      :rowHover="false"
      @row-click="selectedPurchase($event.data)"
      scrollable
      :column-resize-mode="'fit'"
      :scroll-height="usePurchasesInfo.curtailedPurchases.value.length ? '68vh' : '82vh'"
      tableClass="purchtable_table"
    >
      <Column
        v-if="tableType === 'favourite'"
        selectionMode="multiple"
        header-class="header_class_purch_favourite"
        body-class="body_class_purch_favourite"
        filter-header-class="filter_class_purch_favourite"
        style="box-sizing: border-box; max-width: 50px; margin-left: 0px"
      >
        <template #header>
          <button
            :disabled="selectedRows?.length ? false : true"
            class="favtable_button_remove"
            @click="handleDelete"
            :style="selectedRows?.length ? { opacity: '1' } : { opacity: '0.6' }"
          >
            <img
              style="margin-right: 4px; margin-left: 10px"
              src="../icons/trash-icon.svg"
              alt="X"
            />
            {{ $t('delete') }}
          </button>
        </template>
      </Column>
      <Column
        v-for="col of columns"
        class="purchtable_column"
        :key="col.field"
        :frozen="col.field === 'id' && tableType !== 'favourite'"
        :headerClass="
          tableType === 'favourite' ? 'header_class_purch_favourite' : 'header_class_purch'
        "
        :field="col.field"
        :style="
          col.field === 'id'
            ? { maxWidth: '80px' }
            : col.field === 'specialist'
            ? { width: '72px' }
            : ''
        "
        filter
      >
        <template
          #filter
          v-if="
            col.field !== 'info.approve_status' ||
            (col.field === 'info.approve_status' &&
              (useUserInfo.userData.value?.permissions.control_approve ||
                useUserInfo.userData.value?.permissions.view_approves))
          "
        >
          <div
            style="
              display: flex;
              justify-content: flex-start;
              align-items: center;
              max-width: 120px;
            "
          >
            <FilterOptions
              :options="options && options?.length ? options : [{ id: 0, name: 'name' }]"
              :placeholder="col.field"
              :field_name="col.field"
              :table_type="tableType"
              :specialist="
                col.field === 'specialist'
                  ? incomingFilters?.specialist_ids
                  : col.field === 'contragent'
                  ? incomingFilters?.contragent_ids
                  : col.field === 'legal_entity'
                  ? incomingFilters.legal_ids
                  : undefined
              "
              :dropdown_options="
                col.field === 'payment_type'
                  ? incomingFilters.payment_type_ids
                  : col.field === 'card_holder'
                  ? incomingFilters.card_holder_ids
                  : col.field === 'payment_status'
                  ? payment_statuses
                  : col.field === 'info.product_status'
                  ? product_statuses
                  : col.field === 'doc_closing_exists'
                  ? document_types
                  : col.field === 'info.approve_status'
                  ? approve_statuses
                  : null
              "
              @update="
                (val) => {
                  handleFilters(val);
                }
              "
            />
          </div>
        </template>
        <template v-if="col.field === 'id' && tableData" #body="{ data }">
          <div style="max-width: 55px; min-width: 55px; z-index: 10">
            {{ data.id }}
            <img
              v-if="tableType !== 'favourite' && !data.is_favourite"
              v-tooltip="{
                value: `<span class='purchtable_tooltip_favourite'>${$t(
                  'add to favorites'
                )}</span>`,
                escape: true,
                class: 'custom-tooltip'
              }"
              @click="
                (e) => {
                  e.stopPropagation();
                  data.is_favourite = true;
                  postFavorite(data.id);
                  $emit('fav_click', `add ${Math.random()}`);
                }
              "
              src="../icons/star.svg"
              style="width: 14px; cursor: pointer; margin-left: -2px; margin-right: 30px"
              alt=""
            />
            <img
              v-else-if="tableType !== 'favourite' && data.is_favourite"
              v-tooltip="{
                value: `<span class='purchtable_tooltip_favourite'>${$t('unfavorite')}</span>`,
                escape: true,
                class: 'custom-tooltip'
              }"
              @click="
                (e) => {
                  e.stopPropagation();
                  deleteFavourite(data.id);
                  data.is_favourite = false;
                  $emit('fav_click', `delete ${Math.random()}`);
                }
              "
              src="../icons/star-active.svg"
              style="width: 14px; cursor: pointer; margin-left: -2px; margin-right: 30px"
              alt=""
            />
          </div>
        </template>
        <template v-else-if="col.field === 'specialist'" #body="{ data }">
          <div
            :style="tableType === 'favourite' ? { margin: 0 } : ''"
            style="max-width: 30px; min-width: 30px"
          >
            <TooltipPurchTable
              :accountname="data.specialist.samaccountname"
              :name="locale === 'ru' ? data.specialist.description : data.specialist.displayname"
            />
          </div>
        </template>
        <template v-else-if="col.field === 'purchase_date'" #body="{ data }">
          <div
            style="display: flex; font-size: 14px; width: 60px !important; padding: 0 !important"
          >
            {{ data.purchase_date ? data.purchase_date + ' ' : '—' }}
          </div>
        </template>
        <template v-else-if="col.field === 'payings'" #body="{ data }">
          <div style="display: flex; font-size: 14px; min-width: 62px; max-width: 75px">
            <div v-if="data.payings.length">
              <div style="display: flex; flex-direction: column">
                <span v-for="(element, index) in data.payings" :key="index">{{
                  element.date ? element.date : '—'
                }}</span>
              </div>
            </div>
            <span v-else style="font-size: 14px">—</span>
          </div>
        </template>
        <template v-else-if="col.field === 'comming_date'" #body="data">
          <div style="display: flex; min-width: 68px; font-size: 14px; max-width: 68px">
            <span>{{ data.data.comming_date ? data.data.comming_date : '—' }}</span>
          </div>
        </template>
        <template v-else-if="col.field === 'description'" #body="{ data }">
          <div style="margin-top: -5px; line-height: 1">
            <TooltipPurchTable :array="data.description.split('\n')">
              <template #description>
                <div
                  :style="columns.length < 10 ? { maxWidth: '250px' } : { width: '160px' }"
                  class="purchtable_div_description"
                >
                  {{ data.description.split('\n')[0] }}
                </div>
              </template>
            </TooltipPurchTable>
          </div>
        </template>
        <template v-else-if="col.field === 'payment_status'" #body="{ data }">
          <div style="min-width: 100px; max-width: 100px">
            <payColorize
              :type="'paying'"
              :name="data.payment_status.name"
              :id="data.payment_status.id"
            />
          </div>
        </template>
        <template
          v-else-if="
            col.field === 'info.approve_status' &&
            (useUserInfo.userData.value?.permissions.control_approve ||
              useUserInfo.userData.value?.permissions.view_approves)
          "
          #body="{ data }"
        >
          <div style="min-width: 114px; max-width: 114px; margin-bottom: -16px">
            <payColorize
              :type="'info.approve_status'"
              :items_count="{
                accepted_items_count: data.accepted_items_count,
                no_approve_items_count: data.no_approve_items_count,
                rejected_items_count: data.rejected_items_count,
                pending_items_count: data.pending_items_count
              }"
              :approve_status="data.info.approve_status"
            />
          </div>
        </template>
        <template v-else-if="col.field === 'info.product_status'" #body="{ data }">
          <div
            style="
              min-width: 114px;
              max-width: 114px;
              display: flex;
              margin-top: 8px;
              margin-bottom: -10px;
            "
          >
            <payColorize
              :type="'info.product_status'"
              :items_count="{
                new_items_count: data.new_items_count,
                cancelled_items_count: data.cancelled_items_count,
                deleted_items_count: data.deleted_items_count,
                in_process_items_count: data.in_process_items_count,
                received_items_count: data.received_items_count
              }"
              :product_status="data.info.product_status"
            />
          </div>
        </template>
        <template v-else-if="col.field === 'info.items_sum_price'" #body="{ data }">
          <p style="font-size: 14px; font-weight: 400; text-align: right">
            {{ curFormatter(data.info.items_sum_price) }}
            {{ getCurrencySignName(data.currency) }}
          </p>
        </template>
        <template v-else-if="col.field === 'info.payings_sum_price'" #body="{ data }">
          <p style="font-size: 14px; font-weight: 400; text-align: right">
            {{ data.info?.payings_sum_price ? curFormatter(data.info?.payings_sum_price) : 0 }}
            {{ getCurrencySignName(data.debited_currency) }}
          </p>
        </template>
        <template v-else-if="col.field === 'contragent'" #body="{ data }">
          <TooltipPurchTable :array="[data.contragent?.name]">
            <template #description>
              <div
                :style="columns.length < 10 ? { width: '180px' } : { width: '100px' }"
                class="purchtable_div_description"
                style="max-width: 60px; white-space: wrap"
              >
                {{ data.contragent?.name || '—' }}
              </div>
            </template>
          </TooltipPurchTable>
        </template>
        <template v-else-if="col.field === 'legal_entity'" #body="{ data }">
          <div style="font-size: 14px; font-weight: 400; max-width: 60px; white-space: wrap">
            {{ data.legal_entity?.name || '—' }}
          </div>
        </template>
        <template v-else-if="col.field === 'payment_type'" #body="{ data }">
          <div style="margin-bottom: -3px; margin-top: 0px">
            <span style="font-size: 14px; font-weight: 400; min-width: 90px; max-width: 90px">{{
              data.payment_type?.name || '—'
            }}</span>
          </div>
        </template>
        <template v-else-if="col.field === 'card_holder'" #body="{ data }">
          <div
            style="display: flex; align-items: center; min-width: 120px; max-width: 120px"
            :style="{ justifyContent: 'flex-start' }"
          >
            <bankImage :bank-name="data.card_holder?.bank_id" />
            <span style="font-size: 14px; font-weight: 400">
              {{ data.card_holder?.name ? data.card_holder?.name : '—' }}</span
            >
          </div>
        </template>
        <template v-else-if="col.field === 'doc_closing_exists'" #body="{ data }">
          <div
            style="
              display: flex;
              justify-content: space-between;
              padding-right: 10px;
              min-width: 84px;
              max-width: 84px;
            "
          >
            <Bill_active :active="data.doc_invoices_exists" />
            <Contract_active style="margin-left: 4px" :active="data.doc_contract_exists" />
            <Closed_doc_active style="margin-left: 4px" :active="data.doc_closing_exists" />
            <Other_doc_active style="margin-left: 4px" :active="data.doc_other_exists" />
          </div>
        </template>
        <template v-else-if="col.field === 'note'" #body="{ data }">
          <div
            :style="columns.length < 10 ? { width: '180px' } : { width: '100px' }"
            v-tooltip.left="{
              value: `<span class='purchtable_tooltip_favourite'>${data.note}</span>`,
              escape: true,
              class: 'custom-tooltip-offices'
            }"
            class="purchtable_div_description"
          >
            {{ data.note }}
          </div>
        </template>
      </Column>
    </DataTable>
    <div
      v-if="!isUpdate && !isLoading && tableData && tableData.data.length < 1"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 48px;
        color: #999999;
        font-size: 16px;
      "
    >
      {{ $t('list empty') }}
    </div>
  </div>
</template>

<style lang="scss">
@import './purchTable.scss';
</style>
