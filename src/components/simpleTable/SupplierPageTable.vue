<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ISupplierPageTable } from './types'
import useCheckedName from '../../store/checkedName'
import { readabilityNumber, readabilityDotNumbers } from '../../helpers/readabilityNumber'
import useTableSelection from '../../store/selectedTableItem'
import useDateFrom from '../../store/dateFrom'
import useDateTo from '../../store/dateTo'
import { useRoute } from 'vue-router'

const props = defineProps<{
  products: Array<ISupplierPageTable>
  selectedProduct: Array<ISupplierPageTable>
  currency: string
  date_to: string
  date_from: string
}>()

const emit = defineEmits<{
  (e: 'select-product', value: ISupplierPageTable[]): void
}>()
const route = useRoute()
const selectedProduct = ref(props.selectedProduct)
const searchData = ref('')
const tableData = ref<ISupplierPageTable[]>(props.products)

const rowClass = (data: any) => {
  return [{ checkedRow: data.name == useCheckedName.checkedName.value }]
}
watch(selectedProduct, () => {
  emit('select-product', selectedProduct.value)
})
watch(searchData, () => {
  tableData.value = props.products.filter((searchedItem) =>
    searchedItem.name.toLowerCase().includes(searchData.value.toLowerCase())
  )
})
const makeHighlighting = (index: number) => {
  document.getElementById('tableRef')?.scrollTo(0, index * 50)
}
watch(useCheckedName.checkedName, () => {
  makeHighlighting(props.products.findIndex((el) => el.name === useCheckedName.checkedName.value))
})
const clickRow = (e: { index: number; data: ISupplierPageTable }) => {
  useTableSelection.setCheckedIndex(e.data.color)
}
const url_start = import.meta.env.VITE_VUE_OLD_ADDRESS
</script>
<template>
  <div class="supplier-page-table" id="tableRef">
    <DataTable
      v-model:selection="selectedProduct"
      :value="tableData"
      dataKey="id"
      class="supplier-page-tb"
      :row-class="rowClass"
      v-on:row-click="(e) => clickRow(e)"
    >
      <Column
        selectionMode="multiple"
        :body-style="{ margin: '15px' }"
        body-class="checkboxItem"
        header-class="checkboxItem"
      ></Column>
      <Column
        field="name"
        body-style="
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
          color: var(--vt-c-text-black);
        "
        :header="$t('type')"
      >
        <template #body="{ data }">
          <p>{{ data.name }}</p>
        </template> 
      </Column>
      <Column field="count" :header="$t('item items')">
        <template #body="{ data }">
          <a
            target="_blank"
            :href="
              date_from === '0001-01-01'
                ? `${url_start}/#/approver?tab=positions&contragent_id=${route.params.id}&purchase_types=${data.id}&year=1900`
                : `${url_start}/#/approver?tab=positions&contragent_id=${route.params.id}&purchase_types=${data.id}&date_from=${date_from}&date_to=${date_to}`
            "
            style="color: var(--vt-c-electric-blue)"
            >{{ readabilityNumber(data.count) }}</a
          >
        </template>
      </Column>
      <Column field="sum" :header="`${$t('amount')}${currency}`">
        <template #body="{ data }">
          <p>
            {{ readabilityNumber(data.sum) }}
          </p>
        </template>
      </Column>
      <Column
        field="procent"
        header=""
        :body-style="{
          padding: '0px',
          margin: '0px'
        }"
      >
        <template #body="{ data }">
          <div
            :style="{
              background: data.color,
              height: '24px',
              width: '46px',
              'border-radius': '5px',
              margin: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px 10px',
              whiteSpace: 'nowrap'
            }"
          >
            {{ readabilityDotNumbers(data.procent) }}
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<style lang="scss">
.supplier-page-tb {
  th {
    border: none !important;
    background: none !important;
    color: var(--vt-c-text-black);
    .p-column-title {
      color: var(--vt-c-bold-gray);
      font-weight: 400;
      font-size: 14px;
    }
  }
  tr {
    background-color: #fff !important;
  }
  td {
    border: none !important;
    color: var(--vt-c-text-black);
  }
  .checkboxItem {
    div {
      .p-highlight {
        background: var(--vt-c-electric-blue);
      }
    }
  }
}
.supplier-page-table {
  max-height: 280px;
  overflow-y: auto;
  padding: 0 20px;
  .progress_information {
    width: 100px;
    height: 100px;
    background: red;
    position: absolute;
  }
}
tr.p-highlight.checkedRow {
  background-color: var(--vt-c-backgroud-gray) !important;
}
</style>
