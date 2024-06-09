<script setup lang="ts">
import type { IPaymentsData } from '@/api/payments';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getPayingTypes, getPaymentData } from '@/api/payments';
import usePaymentsFilters from '@/store/payments_store/paymentsFilter';
import usePurchDateTo from '@/store/purchases_store/purchDateTo';
import usePurchDateFrom from '@/store/purchases_store/purchDateFrom';
import { FilterMatchMode } from 'primevue/api';
import { curFormatter } from '@/helpers/currencyFormatter';
import useCheckedColumn from '@/store/tablesStore/checkedColumn';
import PaymentFilterOptions from './PaymentsFilterOptions.vue';
import bankImage from '../custom/variableCommons/bankImage.vue';
import payColorize from '../custom/payColorize.vue';
import useCommonsInfo, { type ICommonDefault } from '@/store/purchases_store/commons';
import { useInfiniteScroll } from '@vueuse/core';
import { debounce } from '@/helpers/debounse';
import ProgressSpinner from 'primevue/progressspinner';
import useOfficeId from '@/store/officeId';
import useIncomingFilters from '@/store/purchases_store/incoming_filters';
import useError from '@/store/errorStore';
import { getPurchase } from '@/api/purchases';
import usePurchasesInfo from '@/store/purchases_store/purchases';
import i18n_config from '@/locales/i18n_config';
import ScreenParams from '@/store/screen';
import { getCurrencySignName } from '@/helpers/currencySign';
import { getFiltersParamsNonEmpty } from '@/helpers/queryFilters';
import { useRouter, useRoute, type LocationQuery } from 'vue-router';

const { messages, locale } = i18n_config.global;
const tableData = ref<IPaymentsData | null>(null);
const selectedSort = ref({
  field: '',
  dir: ''
});
const isUpdate = ref(false);

const route = useRoute();
const router = useRouter();
const oldPaymentsFilters = ref<{
  [key: string]: string | number | boolean | (string | number)[];
} | null>(null);

let i = 0;
const el = ref<HTMLElement | null>(null);
const paying_types = ref<{ id: string | number; name: string }[] | null>(null);
const incomingFilters = ref<{
  legal_ids: { id: string | number; name: string }[];
  contragent_ids: { id: string | number; name: string }[];
  payment_type_ids: { id: string | number; name: string }[];
  card_holder_ids: { id: string | number; name: string }[];
}>({
  legal_ids: [],
  contragent_ids: [],
  payment_type_ids: [],
  card_holder_ids: []
});

const filters = ref({
  purchase_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'purchase.description': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'purchase.contragent': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'purchase.legal_entity': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  debited_price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'purchase.payment_status': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'purchase.payment_type': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'purchase.card_holder': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  paying_type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  note: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
});

const columns = ref<{ field: string }[] | undefined>([
  { field: 'purchase_id' },
  { field: 'purchase.description' },
  { field: 'purchase.contragent' },
  { field: 'date' },
  { field: 'purchase.legal_entity' },
  { field: 'price' },
  { field: 'debited_price' },
  { field: 'purchase.payment_status' },
  { field: 'purchase.payment_type' },
  { field: 'purchase.card_holder' },
  { field: 'paying_type' },
  { field: 'note' }
]);

const debScroll = debounce(function () {
  i = 0;
}, 300);

const updateFilters = () => {
  tableData.value?.filters.map((el) => {
    switch (el.name) {
      case 'legal_ids':
        if (
          !route.query?.legal_ids ||
          !route.query.legal_ids.length ||
          !incomingFilters.value.legal_ids.length
        )
          incomingFilters.value[el.name] = el.options;
        if (!incomingFilters.value[el.name].find((item) => item.id === 0))
          incomingFilters.value[el.name].unshift({ id: 0, name: messages[locale].unselected });
        break;
      case 'card_holder_ids':
        if (
          !route.query?.card_holder_ids ||
          !route.query.card_holder_ids.length ||
          !incomingFilters.value.card_holder_ids.length
        )
          incomingFilters.value[el.name] = el.options;
        if (!incomingFilters.value[el.name].find((item) => item.id === 0))
          incomingFilters.value[el.name].unshift({ id: 0, name: messages[locale].unselected });
        break;
      case 'contragent_ids':
        if (
          !route.query?.contragent_ids ||
          !route.query.contragent_ids.length ||
          !incomingFilters.value.contragent_ids.length
        )
          incomingFilters.value[el.name] = el.options;
        if (!incomingFilters.value[el.name].find((item) => item.id === 0))
          incomingFilters.value[el.name].unshift({ id: 0, name: messages[locale].unselected });
        break;
      case 'payment_type_ids':
        if (
          !route.query?.payment_type_ids ||
          !route.query.payment_type_ids.length ||
          !incomingFilters.value.payment_type_ids.length
        )
          incomingFilters.value[el.name] = el.options;
        if (!incomingFilters.value[el.name].find((item) => item.id === 0))
          incomingFilters.value[el.name].unshift({ id: 0, name: messages[locale].unselected });
        break;

      default:
        break;
    }
  });
};

const getTableData = async (with_filters: boolean) => {
  isUpdate.value = true;
  await getPaymentData({
    ...usePaymentsFilters.filters.value,
    with_filters: with_filters,
    date_to: usePurchDateTo.dateTo.value,
    date_from: usePurchDateFrom.dateFrom.value
  }).then((res) => {
    tableData.value = res.data;
    res.data.filters.map((el) => {
      useIncomingFilters.setIncomingFilters(el.name, el.options);
    });
    useIncomingFilters.setIncomingFilters(
      'paying_types',
      paying_types.value ? paying_types.value : []
    );
  });
  updateFilters();
  isUpdate.value = false;
};

const getFilteredTableData = async (with_filters: boolean) => {
  isUpdate.value = true;
  await getPaymentData({
    ...usePaymentsFilters.filters.value,
    with_filters: with_filters,
    date_to: usePurchDateTo.dateTo.value,
    date_from: usePurchDateFrom.dateFrom.value,
    page: 1
  }).then((res) => {
    tableData.value = res.data;
    usePaymentsFilters.setPaymentFilters({ name: 'page', val: 1 });
    res.data.filters.map((el) => {
      useIncomingFilters.setIncomingFilters(el.name, el.options);
    });
    useIncomingFilters.setIncomingFilters(
      'payment_status_ids',
      useCommonsInfo.commons.value.paymentStatuses as any
    );
  });
  updateFilters();
  isUpdate.value = false;
};

const getDebFilteredTableData = debounce(function (with_filters: boolean) {
  getFilteredTableData(with_filters);
}, 300);

const pushTableData = async (with_filters: boolean) => {
  await getPaymentData({
    ...usePaymentsFilters.filters.value,
    with_filters: with_filters,
    date_to: usePurchDateTo.dateTo.value,
    date_from: usePurchDateFrom.dateFrom.value
  }).then((res) => {
    res.data.data.map((el) => {
      tableData.value?.data.push(el);
    });
  });
  updateFilters();
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

const handleDir = (val: { field: string; dir: string }) => {
  selectedSort.value = val;
  usePaymentsFilters.setPaymentFilters({ val: val.field, name: 'order_by' });
  usePaymentsFilters.setPaymentFilters({ val: val.dir, name: 'order_dir' });
};

onMounted(async () => {
  usePaymentsFilters.removePaymentFilters();

  if (route.query) {
    const filters = { ...route.query };

    delete filters.date_to;
    delete filters.date_from;
    delete filters.date;

    if (filters.order_by === 'id' && filters.order_dir === 'desc') {
      delete filters.order_by;
      delete filters.order_dir;
    }

    if (Object.keys(filters).length === 0) {
      await getTableData(false);
    } else await readQueryParamsPayments(route.query);
  } else await getTableData(true);

  await getPayingTypes().then((res) => {
    paying_types.value = res.data;
    useIncomingFilters.setIncomingFilters('paying_types', res.data);
  });
  wrapperWidth();
  el.value = document.querySelector('.p-datatable-wrapper');
});

onBeforeUnmount(() => {
  if (ScreenParams.screenParams.width < 900) {
    const wrapper = document.querySelector('.p-datatable-wrapper') as any;
    if (wrapper?.style) {
      wrapper.style.width = '';
    }
  }
});

watch(
  () => [usePurchDateTo.dateTo.value, usePurchDateFrom.dateFrom.value],
  () => {
    getDebFilteredTableData(true);
  }
);
watch(
  () => [useOfficeId.department.value, useOfficeId.officeId.value],
  () => {
    getDebFilteredTableData(true);
  },
  { deep: true }
);
watch(
  () => route.query,
  () => {
    route.query && readQueryParamsPayments(route.query);
  },
  { deep: true }
);

watch(
  () => [
    usePurchDateFrom.dateFrom.value,
    usePurchDateTo.dateTo.value,
    usePaymentsFilters.filters.value.paying_type_ids,
    usePaymentsFilters.filters.value.payment_type_ids,
    usePaymentsFilters.filters.value.payment_status_ids,
    usePaymentsFilters.filters.value.card_holder_ids,
    usePaymentsFilters.filters.value.legal_ids,
    usePaymentsFilters.filters.value.contragent_ids,
    usePaymentsFilters.filters.value.purchase_id,
    usePaymentsFilters.filters.value.price,
    usePaymentsFilters.filters.value.debited_price,
    usePaymentsFilters.filters.value.note,
    usePaymentsFilters.filters.value.description,
    usePaymentsFilters.filters.value.order_by,
    usePaymentsFilters.filters.value.order_dir
  ],
  async () => {
    if (!oldPaymentsFilters.value) {
      oldPaymentsFilters.value = { ...usePaymentsFilters.filters.value };
    } else if (
      JSON.stringify(oldPaymentsFilters.value) !== JSON.stringify(usePaymentsFilters.filters.value)
    ) {
      const isAllTime = usePurchDateFrom.dateFrom.value === '0001-01-01';
      // alert(usePurchDateFrom.dateFrom.value);
      router.replace({
        query: {
          ...getFiltersParamsNonEmpty(usePaymentsFilters.filters.value),
          date: isAllTime ? 3 : undefined,
          date_from: !isAllTime ? usePurchDateFrom.dateFrom.value : undefined,
          date_to: !isAllTime ? usePurchDateTo.dateTo.value : undefined
        }
      });
    }
  }
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
            usePaymentsFilters.filters.value.page < tableData.value?.last_page.toString()
          ) {
            usePaymentsFilters.setPaymentFilters({
              val: Number(usePaymentsFilters.filters.value.page) + 1,
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
  () => usePaymentsFilters.filters.value.page,
  async () => {
    if (!isUpdate.value) {
      isUpdate.value = true;
      await pushTableData(false);
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

const readQueryParamsPayments = (propsQuery: LocationQuery): void => {
  Object.keys(propsQuery).forEach((el: string) => {
    switch (el) {
      case 'order_dir':
        selectedSort.value.dir = propsQuery![el] as string;

        usePaymentsFilters.setPaymentFilters({ val: propsQuery![el] as string, name: el });
        break;
      case 'order_by':
        selectedSort.value.field = propsQuery![el] as string;
        usePaymentsFilters.setPaymentFilters({ val: propsQuery![el] as string, name: el });
        break;
      case 'date_from':
        usePurchDateFrom.setDateFrom(propsQuery![el] as string);
        break;
      case 'date_to':
        usePurchDateTo.setDateTo(propsQuery![el] as string);
        break;
      case 'card_holder_ids[]':
      case 'contragent_ids[]':
      case 'legal_ids[]':
      case 'paying_type_ids[]':
      case 'payment_status_ids[]':
      case 'payment_type_ids[]':
        usePaymentsFilters.setPaymentFilters({
          val: [propsQuery![el] as string],
          name: el.replace('[]', '')
        });
        break;
      case 'card_holder_ids':
      case 'contragent_ids':
      case 'legal_ids':
      case 'paying_type_ids':
      case 'payment_status_ids':
      case 'payment_type_ids':
        usePaymentsFilters.setPaymentFilters({
          val: Array.isArray(propsQuery![el])
            ? [...(propsQuery![el] as string)]
            : [propsQuery![el] as string],
          name: el
        });
        break;
      default:
        usePaymentsFilters.setPaymentFilters({ val: propsQuery![el] as string, name: el });
        break;
    }
  });

  getDebFilteredTableData(true);
};

const selectedPurchase = async (id: number) => {
  await getPurchase(id).then((res) => {
    usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
  });
};
</script>

<template>
  <div class="payments_table_div_all">
    <div v-if="isUpdate" class="payments_table_div_spinner">
      <div>
        <ProgressSpinner />
      </div>
    </div>
    <DataTable
      v-model:filters="filters"
      :value="tableData?.data"
      :tableClass="'payments_table_table'"
      filterDisplay="row"
      scrollable
      :scroll-height="'84vh'"
      :rowHover="true"
    >
      <Column
        v-for="col in columns"
        :key="col.field"
        :frozen="col.field === 'purchase_id'"
        :headerClass="'header_class_payments'"
        filter
      >
        <template #filter>
          <div style="max-width: 130px; background-color: #fff">
            <PaymentFilterOptions
              :selected_sort="selectedSort"
              :field_name="col.field"
              @sel_sort="(val) => handleDir(val)"
              :options="
                col.field === 'purchase.contragent'
                  ? incomingFilters.contragent_ids
                  : col.field === 'purchase.legal_entity'
                    ? incomingFilters.legal_ids
                    : col.field === 'purchase.payment_type'
                      ? incomingFilters.payment_type_ids
                      : col.field === 'purchase.payment_status'
                        ? (useCommonsInfo.commons.value.paymentStatuses as any)
                        : col.field === 'purchase.card_holder'
                          ? incomingFilters.card_holder_ids
                          : col.field === 'paying_type'
                            ? paying_types
                            : [{ id: 0, name: '' }]
              "
            />
          </div>
        </template>
        <template v-if="col.field === 'purchase_id'" #body="{ data }">
          <div
            :class="'paytable_col_div_' + col.field"
            @click="selectedPurchase(data.purchase_id)"
          >
            {{ data.purchase_id }}
          </div>
        </template>
        <template v-else-if="col.field === 'purchase.description'" #body="{ data }">
          <div
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data.purchase.description ? data.purchase.description : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            :class="'paytable_col_div_' + col.field.split('.')[1]"
          >
            {{ data.purchase.description ? data.purchase.description : "-" }}
          </div>
        </template>
        <template v-else-if="col.field === 'purchase.contragent'" #body="{ data }">
          <div
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data.purchase.contragent ? data.purchase.contragent.name : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            :class="'paytable_col_div_' + col.field.split('.')[1]"
          >
            {{ data.purchase.contragent ? data.purchase.contragent.name : "-" }}
          </div>
        </template>
        <template v-else-if="col.field === 'date'" #body="{ data }">
          <div :class="'paytable_col_div_' + col.field">{{ data.date }}</div>
        </template>
        <template v-else-if="col.field === 'purchase.legal_entity'" #body="{ data }">
          <div
            v-tooltip="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data.purchase.legal_entity ? data.purchase.legal_entity.name : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            :class="'paytable_col_div_' + col.field.split('.')[1]"
          >
            {{ data.purchase.legal_entity ? data.purchase.legal_entity.name : "-" }}
          </div>
        </template>
        <template v-else-if="col.field === 'price'" #body="{ data }">
          <div :class="'paytable_col_div_' + col.field">
            {{
              data?.price
                ? curFormatter(data.price) + " " + getCurrencySignName(data.currency)
                : "-"
            }}
          </div>
        </template>
        <template v-else-if="col.field === 'debited_price'" #body="{ data }">
          <div :class="'paytable_col_div_' + col.field">
            {{
              data?.debited_price
                ? curFormatter(data.debited_price) +
                  " " +
                  getCurrencySignName(data.debited_currency)
                : "-"
            }}
          </div>
        </template>
        <template v-else-if="col.field === 'purchase.payment_status'" #body="{ data }">
          <div
            :class="'paytable_col_div_' + col.field.split('.')[1]"
            style="min-width: 100px; max-width: 100px"
          >
            <payColorize
              v-if="data?.purchase.payment_status"
              :type="'paying'"
              :name="data?.purchase.payment_status.name"
              :id="data?.purchase.payment_status.id"
            />
            <span v-else>-</span>
          </div>
        </template>
        <template v-else-if="col.field === 'purchase.payment_type'" #body="{ data }">
          <div :class="'paytable_col_div_' + col.field.split('.')[1]">
            {{ data?.purchase.payment_type ? data?.purchase.payment_type.name : "-" }}
          </div>
        </template>
        <template v-else-if="col.field === 'purchase.card_holder'" #body="{ data }">
          <div
            :class="
              'paytable_col_div_' +
              (data?.purchase.card_holder
                ? col.field.split('.')[1]
                : col.field.split('.')[1] + '_empty')
            "
            style="display: flex; align-items: center; min-width: 120px; max-width: 120px"
            :style="
              data.card_holder?.name
                ? { justifyContent: 'flex-start' }
                : { justifyContent: 'center' }
            "
          >
            <bankImage
              v-if="data.purchase.card_holder"
              :bank-name="data.purchase.card_holder.bank_id"
            />
            <span style="font-size: 14px; font-weight: 400">
              {{
                data?.purchase.card_holder ? data.purchase.card_holder.name : "-"
              }}</span
            >
          </div>
        </template>
        <template v-else-if="col.field === 'paying_type'" #body="{ data }">
          <div :class="'paytable_col_div_' + col.field">
            {{ data?.paying_type ? data.paying_type.name : "-" }}
          </div>
        </template>
        <template v-else-if="col.field === 'note'" #body="{ data }">
          <div
            v-tooltip.left="{
              value: `<span class='purchtable_tooltip_favourite'>${
                data?.note ? data.note : '-'
              }</span>`,
              escape: true,
              class: 'custom-tooltip-offices',
            }"
            :class="'paytable_col_div_' + (data?.note ? col.field : col.field + '_empty')"
          >
            {{ data?.note ? data.note : "-" }}
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
      {{ $t("list empty") }}
    </div>
  </div>
</template>

<style lang="scss">
@import "./PaymentTable.scss";
@import "./purchTable.scss";
</style>
