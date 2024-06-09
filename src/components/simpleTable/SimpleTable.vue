<script setup lang="ts">
import { ref, watch } from "vue";
import type { ISipleTable } from "./types";
import Search from "../icons/Search.vue";
import useCheckedName from "../../store/checkedName";
import {
  readabilityNumber,
  readabilityDotNumbers,
} from "../../helpers/readabilityNumber";
import useTableSelection from "../../store/selectedTableItem";

const props = defineProps<{
  products: Array<ISipleTable>;
  selectedProduct: Array<ISipleTable>;
  currency: string;
}>();

const emit = defineEmits<{
  (e: "select-product", value: ISipleTable[]): void;
}>();
const selectedProduct = ref(props.selectedProduct);
const searchData = ref("");
const tableData = ref<ISipleTable[]>(props.products);
const rowClass = (data: any) => {
  return [{ checkedRow: data.name === useCheckedName.checkedName.value }];
};
watch(selectedProduct, () => {
  emit("select-product", selectedProduct.value);
});
watch(searchData, () => {
  tableData.value = props.products.filter((searchedItem) =>
    searchedItem.name.toLowerCase().includes(searchData.value.toLowerCase())
  );
});
const makeHighlighting = (index: number) => {
  document.getElementById("tableRef")?.scrollTo(0, index * 50);
};
watch(useCheckedName.checkedName, () => {
  makeHighlighting(
    props.products.findIndex((el) => el.name === useCheckedName.checkedName.value)
  );
});
const clickRow = (e: { index: number; data: ISipleTable }) => {
  useTableSelection.setCheckedIndex(e.data.color);
};
</script>
<template>
  <div
    class="card"
    style="max-height: 79vh; overflow-y: auto; padding: 0 20px"
    id="tableRef"
  >
    <DataTable
      v-model:selection="selectedProduct"
      :value="tableData"
      dataKey="id"
      class="suppliers_table"
      :row-class="rowClass"
      v-on:row-click="(e) => clickRow(e)"
      :table-style="{ 'border-spacing': '0rem 1rem' }"
    >
      <Column
        selectionMode="multiple"
        headerStyle="border-radius: 10px 0px 0px 10px"
        :body-style="{
          'border-radius': '10px 0px 0px 10px',
          display: 'flex',
          justifyContent: 'center',
          margin: '15px',
        }"
        body-class="checkboxItem"
        header-class="checkboxItem"
      ></Column>
      <Column
        field="name"
        body-style="
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
          color: var(--vt-c-electric-blue);
        "
        :style="{ padding: '0px !important' }"
      >
        <template #header>
          <div class="filterBox">
            <InputText :placeholder="$t('title')" v-model="searchData" /><Search
              class="searchIcon"
            />
          </div> </template
      ></Column>
      <Column
        field="sum"
        :header="
          props.currency.includes('N') ? $t('br sum') : $t('amount') + props.currency
        "
        #body="{ data }"
        :header-style="{ whiteSpace: 'nowrap', padding: '0px 25px 0px 0px !important' }"
      >
        <p
          :style="{ whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '70px' }"
          v-tooltip="
            String(readabilityNumber(Math.floor(data.sum))).length > 9
              ? {
                  value: `${readabilityNumber(Math.floor(data.sum))}`,
                  escape: true,
                  class: 'custom-note',
                }
              : undefined
          "
        >
          {{ readabilityNumber(Math.floor(data.sum)) }}
        </p></Column
      >
      <Column
        field="count"
        :header="$t('purchases pcs')"
        #body="{ data }"
        :header-style="{ whiteSpace: 'nowrap', padding: '0px 25px 0px 0px !important' }"
        ><p>{{ readabilityNumber(Math.floor(data.count)) }}</p></Column
      >
      <Column
        field="procent"
        header=""
        headerStyle="border-radius: 0px 10px 10px 0px;"
        :body-style="{
          'border-radius': '0px 10px 10px 0px',
          padding: '0px',
          margin: '0px',
        }"
      >
        <template #body="{ data }">
          <div
            :style="{
              background: data.color,
              height: '55px',
              'border-radius': '0px 10px 10px 0px',
              margin: '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px',
              whiteSpace: 'nowrap',
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
.suppliers_table {
  .p-datatable-tbody {
    tr {
      border-radius: 10px;
      box-shadow: 0px 0px 5px 0px #00000014;
      background-color: #fff !important;
      &:focus {
        outline: none !important;
      }
      td {
        padding: 0px !important;
        &:nth-child(1) {
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        &:nth-child(6) {
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
  th {
    border: none !important;
    background: none !important;
    color: var(--vt-c-text-black);
    padding: 0px 5px 0px 15px !important;
    div {
      padding: 0px !important;
      span {
        color: var(--vt-c-bold-gray);
        font-weight: 400;
      }
    }
  }
  td {
    border: none !important;
    color: var(--vt-c-text-black);
    padding: 0px 0 0 20px !important;
  }
  .checkboxItem {
    div {
      padding: 0px !important;
      .p-highlight {
        background: var(--vt-c-electric-blue);
      }
    }
  }
  .filterBox {
    position: relative;
    .searchIcon {
      position: absolute;
      left: 100px;
      top: 12px;
    }
    input {
      border: none;
    }
    input:focus {
      box-shadow: none;
    }
  }
  tr.p-highlight.checkedRow {
    background-color: var(--vt-c-backgroud-gray) !important;
  }
}
</style>
