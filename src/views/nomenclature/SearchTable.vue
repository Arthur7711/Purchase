<script setup lang="ts">
import { ref, watch } from 'vue'
import useCheckedName from '../../store/checkedName'
import { readabilityNumber } from '../../helpers/readabilityNumber'
interface IIncomingData {
  id: number
  items_count: number
  name: string
}
const props = defineProps<{
  products: Array<{}>
}>()

const emit = defineEmits<{
  (e: 'selected-product', value: IIncomingData): void
}>()
const rowClicker = (info: IIncomingData) => {
  emit('selected-product', info)
}
</script>
<template>
  <div class="card" id="tableRef">
    <DataTable
      :value="props.products"
      dataKey="id"
      class="search_table"
      v-on:row-click="(e) => rowClicker(e.data)"
      scrollable
      scroll-height="300px"
    >
      <Column
        field="name"
        body-style="
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
        "
        header="наименование"
      >
      </Column>
      <Column
        field="items_count"
        header="позиций"
        #body="{ data }"
        :header-style="{ whiteSpace: 'nowrap' }"
        body-style="color:var(--vt-c-electric-blue); line-height:24px"
        ><p style="font-size: 14px">
          {{ readabilityNumber(Math.floor(data.items_count)) }}
        </p></Column
      >
    </DataTable>
  </div>
</template>
<style lang="scss">
.search_table {
  th {
    border: none !important;
    background: var(--vt-c-white) !important;
    color: var(--vt-c-text-black);
    div {
      span {
        color: var(--vt-c-bold-gray);
        font-weight: 400;
      }
    }
  }
  tr {
    // backdrop-filter: blur(2.5px);
    background-color: var(--vt-c-white) !important;
  }
  td {
    border: none !important;
    color: var(--vt-c-text-black);
    padding: 5px 0 5px 20px !important;
  }
  .checkboxItem {
    div {
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
}
</style>
