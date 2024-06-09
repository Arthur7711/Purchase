<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import TableSetup from '../tableSetup.vue';
import useCheckedColumn from '../../../store/tablesStore/checkedColumn';
import i18n_config from '@/locales/i18n_config';
import useUser from '@/store/user';
import type { IColumns } from './types';
const props = defineProps<{
  table_type: string;
}>();
const { locale, messages } = i18n_config.global;
const op = ref();
const toggle = (event: any) => {
  op.value.toggle(event);
};
const defaultAllColumns = [
  { id: 0, field: 'id', name: 'ID', active: true },
  { id: 1, field: 'specialist', name: messages[locale].purchaser, active: true },
  { id: 2, field: 'purchase_date', name: messages[locale].order, active: true },
  { id: 3, field: 'payings', name: messages[locale].payment, active: true },
  { id: 4, field: 'comming_date', name: messages[locale].delivery, active: true },
  { id: 5, field: 'description', name: messages[locale].description, active: true },
  { id: 6, field: 'payment_status', name: messages[locale]['payment(status)'], active: true },
  { id: 7, field: 'info.approve_status', name: messages[locale].agreement, active: true },
  { id: 8, field: 'info.product_status', name: messages[locale]['item status'], active: true },
  { id: 9, field: 'info.items_sum_price', name: messages[locale].price, active: true },
  {
    id: 10,
    field: 'info.payings_sum_price',
    name: messages[locale]['payment amount'],
    active: true
  },
  { id: 11, field: 'contragent', name: messages[locale].supplier, active: true },
  { id: 12, field: 'legal_entity', name: messages[locale]['legal entity'], active: true },
  { id: 13, field: 'payment_type', name: messages[locale]['payment type'], active: true },
  { id: 14, field: 'card_holder', name: messages[locale].cardholder, active: true },
  { id: 15, field: 'doc_closing_exists', name: messages[locale].documents, active: true },
  { id: 16, field: 'note', name: messages[locale].note, active: true }
];
const defaultPositionsColumns = [
  { id: 0, field: 'id', name: 'ID', active: true },
  { id: 1, field: 'purchase_id', name: messages[locale]['purchase ID'], active: true },
  { id: 2, field: 'task_id', name: messages[locale]['task ID'], active: true },
  { id: 3, field: 'approval', name: messages[locale].approval, active: true },
  { id: 4, field: 'status', name: messages[locale].status, active: true },
  { id: 5, field: 'purchase.purchase_date', name: messages[locale].order, active: true },
  { id: 6, field: 'document.document_date', name: messages[locale].document, active: true },
  { id: 7, field: 'document.delivery_date', name: messages[locale].delivery, active: true },
  { id: 8, field: 'price', name: messages[locale].price, active: true },
  { id: 9, field: 'aux_price', name: messages[locale]['currency price'], active: true },
  { id: 10, field: 'contragent', name: messages[locale].supplier, active: true },
  {
    id: 11,
    field: 'purchase.legal_entity',
    name: messages[locale]['legal entity'],
    active: true
  },
  { id: 12, field: 'type', name: messages[locale].type, active: true },
  { id: 13, field: 'subtype', name: messages[locale].subtype, active: true },
  { id: 14, field: 'item_name', name: messages[locale].name, active: true },
  { id: 15, field: 'quantity', name: messages[locale].quantity, active: true },
  { id: 16, field: 'purpose', name: messages[locale].purpose, active: true },
  { id: 17, field: 'warehouse', name: messages[locale].warehouse, active: true },
  { id: 18, field: 'budget', name: messages[locale].budget, active: true },
  { id: 19, field: 'activated_at', name: messages[locale].fact, active: true },
  { id: 20, field: 'sn', name: messages[locale]['serial number'], active: true },
  { id: 21, field: 'note', name: messages[locale].note, active: true }
];
const defaultPaymentsColumns = [
  { id: 0, field: 'purchase_id', name: messages[locale]['purchase ID'], active: true },
  {
    id: 1,
    field: 'purchase.description',
    name: messages[locale]['purchase description'],
    active: true
  },
  { id: 2, field: 'purchase.contragent', name: messages[locale].supplier, active: true },
  { id: 3, field: 'date', name: messages[locale].date, active: true },
  {
    id: 4,
    field: 'purchase.legal_entity',
    name: messages[locale]['legal entity'],
    active: true
  },
  { id: 6, field: 'price', name: messages[locale].amount, active: true },
  { id: 5, field: 'debited_price', name: messages[locale]['currency amount'], active: true },
  {
    id: 7,
    field: 'purchase.payment_status',
    name: messages[locale]['payment status'],
    active: true
  },
  {
    id: 8,
    field: 'purchase.payment_type',
    name: messages[locale]['payment type'],
    active: true
  },
  { id: 9, field: 'purchase.card_holder', name: messages[locale].cardholder, active: true },
  { id: 10, field: 'paying_type', name: messages[locale]['payment method'], active: true },
  { id: 11, field: 'note', name: messages[locale]['payment data'], active: true }
];

const fillerColumns = (
  type: 'purchase_columns' | 'positions_columns' | 'payments_columns'
): IColumns[] => {
  const savedColumns = JSON.parse(localStorage.getItem(type) as string) as IColumns[];
  switch (type) {
    case 'purchase_columns':
      return savedColumns.map((el, i) => {
        return {
          id: el.id,
          field: el.field,
          name: defaultAllColumns.filter((elem) => elem.id === el.id)[0].name,
          active: el.active
        };
      });
    case 'positions_columns':
      return savedColumns.map((el, i) => {
        return {
          id: el.id,
          field: el.field,
          name: defaultPositionsColumns.filter((elem) => elem.id === el.id)[0].name,
          active: el.active
        };
      });
    case 'payments_columns':
      return savedColumns.map((el, i) => {
        return {
          id: el.id,
          field: el.field,
          name: defaultPaymentsColumns.filter((elem) => elem.id === el.id)[0].name,
          active: el.active
        };
      });
  }
};
const allColumns = ref(
  localStorage.getItem('purchase_columns')
    ? fillerColumns('purchase_columns')
    : [
        { id: 0, field: 'id', name: 'ID', active: true },
        { id: 1, field: 'specialist', name: messages[locale].purchaser, active: true },
        { id: 2, field: 'purchase_date', name: messages[locale].order, active: true },
        { id: 3, field: 'payings', name: messages[locale].payment, active: true },
        { id: 4, field: 'comming_date', name: messages[locale].delivery, active: true },
        { id: 5, field: 'description', name: messages[locale].description, active: true },
        { id: 6, field: 'payment_status', name: messages[locale]['payment(status)'], active: true },
        { id: 7, field: 'info.approve_status', name: messages[locale].agreement, active: true },
        {
          id: 8,
          field: 'info.product_status',
          name: messages[locale]['item status'],
          active: true
        },
        { id: 9, field: 'info.items_sum_price', name: messages[locale].price, active: true },
        {
          id: 10,
          field: 'info.payings_sum_price',
          name: messages[locale]['payment amount'],
          active: true
        },
        { id: 11, field: 'contragent', name: messages[locale].supplier, active: true },
        { id: 12, field: 'legal_entity', name: messages[locale]['legal entity'], active: true },
        { id: 13, field: 'payment_type', name: messages[locale]['payment type'], active: true },
        { id: 14, field: 'card_holder', name: messages[locale].cardholder, active: true },
        { id: 15, field: 'doc_closing_exists', name: messages[locale].documents, active: true },
        { id: 16, field: 'note', name: messages[locale].note, active: true }
      ]
);

const positionsAllColumns = ref(
  localStorage.getItem('positions_columns')
    ? fillerColumns('positions_columns')
    : [
        { id: 0, field: 'id', name: 'ID', active: true },
        { id: 1, field: 'purchase_id', name: messages[locale]['purchase ID'], active: true },
        { id: 2, field: 'task_id', name: messages[locale]['task ID'], active: true },
        { id: 3, field: 'approval', name: messages[locale].approval, active: true },
        { id: 4, field: 'status', name: messages[locale].status, active: true },
        { id: 5, field: 'purchase.purchase_date', name: messages[locale].order, active: true },
        { id: 6, field: 'document.document_date', name: messages[locale].document, active: true },
        { id: 7, field: 'document.delivery_date', name: messages[locale].delivery, active: true },
        { id: 8, field: 'price', name: messages[locale].price, active: true },
        { id: 9, field: 'aux_price', name: messages[locale]['currency price'], active: true },
        { id: 10, field: 'contragent', name: messages[locale].supplier, active: true },
        {
          id: 11,
          field: 'purchase.legal_entity',
          name: messages[locale]['legal entity'],
          active: true
        },
        { id: 12, field: 'type', name: messages[locale].type, active: true },
        { id: 13, field: 'subtype', name: messages[locale].subtype, active: true },
        { id: 14, field: 'item_name', name: messages[locale].name, active: true },
        { id: 15, field: 'quantity', name: messages[locale].quantity, active: true },
        { id: 16, field: 'purpose', name: messages[locale].purpose, active: true },
        { id: 17, field: 'warehouse', name: messages[locale].warehouse, active: true },
        { id: 18, field: 'budget', name: messages[locale].budget, active: true },
        { id: 19, field: 'activated_at', name: messages[locale].fact, active: true },
        { id: 20, field: 'sn', name: messages[locale]['serial number'], active: true },
        { id: 21, field: 'note', name: messages[locale].note, active: true }
      ]
);

const paymentsAllColumns = ref(
  localStorage.getItem('payments_columns')
    ? fillerColumns('payments_columns')
    : [
        { id: 0, field: 'purchase_id', name: messages[locale]['purchase ID'], active: true },
        {
          id: 1,
          field: 'purchase.description',
          name: messages[locale]['purchase description'],
          active: true
        },
        { id: 2, field: 'purchase.contragent', name: messages[locale].supplier, active: true },
        { id: 3, field: 'date', name: messages[locale].date, active: true },
        {
          id: 4,
          field: 'purchase.legal_entity',
          name: messages[locale]['legal entity'],
          active: true
        },
        { id: 6, field: 'price', name: messages[locale].amount, active: true },
        { id: 5, field: 'debited_price', name: messages[locale]['currency amount'], active: true },
        {
          id: 7,
          field: 'purchase.payment_status',
          name: messages[locale]['payment status'],
          active: true
        },
        {
          id: 8,
          field: 'purchase.payment_type',
          name: messages[locale]['payment type'],
          active: true
        },
        { id: 9, field: 'purchase.card_holder', name: messages[locale].cardholder, active: true },
        { id: 10, field: 'paying_type', name: messages[locale]['payment method'], active: true },
        { id: 11, field: 'note', name: messages[locale]['payment data'], active: true }
      ]
);

const columns = ref<IColumns[] | []>([]);

onMounted(() => {
  switch (props.table_type) {
    case 'position':
      if (useUser.userCurrency.value === 'USD') {
        columns.value = positionsAllColumns.value.filter((el) => el.field !== 'aux_price');
      } else {
        columns.value = positionsAllColumns.value;
      }
      useCheckedColumn.setCheckedColumn(columns.value.filter((el) => el.active));
      break;
    case 'purchase':
      columns.value = allColumns.value;
      useCheckedColumn.setCheckedColumn(allColumns.value.filter((el) => el.active));
      break;
    case 'favourite':
      columns.value = allColumns.value;
      useCheckedColumn.setCheckedColumn(allColumns.value.filter((el) => el.active));
      break;
    case 'payments':
      columns.value = paymentsAllColumns.value;
      useCheckedColumn.setCheckedColumn(paymentsAllColumns.value.filter((el) => el.active));
      break;
    default:
      break;
  }
});

watch(
  () => [props.table_type, useUser.userCurrency.value],
  () => {
    allColumns.value = localStorage.getItem('purchase_columns')
      ? fillerColumns('purchase_columns')
      : defaultAllColumns;
    positionsAllColumns.value = localStorage.getItem('positions_columns')
      ? fillerColumns('positions_columns')
      : defaultPositionsColumns;
    paymentsAllColumns.value = localStorage.getItem('payments_columns')
      ? fillerColumns('payments_columns')
      : defaultPaymentsColumns;
    switch (props.table_type) {
      case 'position':
        if (useUser.userCurrency.value === 'USD') {
          columns.value = positionsAllColumns.value.filter((el) => el.field !== 'aux_price');
        } else {
          columns.value = positionsAllColumns.value;
        }
        useCheckedColumn.setCheckedColumn(columns.value.filter((el) => el.active));
        break;
      case 'purchase':
        columns.value = allColumns.value;
        useCheckedColumn.setCheckedColumn(allColumns.value.filter((el) => el.active));
        break;
      case 'favourite':
        columns.value = allColumns.value;
        useCheckedColumn.setCheckedColumn(allColumns.value.filter((el) => el.active));
        break;
      case 'payments':
        columns.value = paymentsAllColumns.value;
        useCheckedColumn.setCheckedColumn(paymentsAllColumns.value.filter((el) => el.active));
        break;
      default:
        break;
    }
  }
);
</script>

<template>
  <button class="headerpurch_button_open_overlay" type="button" @click="toggle">
    <img src="../../icons/gear.svg" alt="" />&nbsp;{{ $t('table') }}
  </button>
  <OverlayPanel :class="'headerpurch_overlay_overlay_setup'" ref="op">
    <!-- <span v-for="q in defaultPaymentsColumns">{{ q }}</span> -->
    <TableSetup
      :table_type="table_type"
      @change-col-number="(val) => (columns = val)"
      @columns-change="
        (val) => {
          useCheckedColumn.setCheckedColumn(val);
        }
      "
      :default-columns="
        table_type === 'position'
          ? defaultPositionsColumns
          : table_type === 'favourite'
            ? defaultAllColumns
            : table_type === 'purchase'
              ? defaultAllColumns
              : defaultPaymentsColumns
      "
      :all-columns="columns"
      :checked-columns="
        useCheckedColumn.checkedColumn.value.length ? useCheckedColumn.checkedColumn.value : columns
      "
    />
  </OverlayPanel>
</template>

<style lang="scss">
@import '../../header/purchHeader.scss';
</style>
