<script setup lang="ts">
import { ref, watch } from 'vue';
import type { INomenclatureTable } from './types';
import { readabilityNumber } from '../../helpers/readabilityNumber';
import XRemove from '../../components/icons/XRemove.vue';

const props = defineProps<{
  products: Array<INomenclatureTable>;
  highlightMode?: boolean;
  linkMode?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-product', value: INomenclatureTable[]): void;
}>();

const removeFromList = (id: number) => {
  emit(
    'select-product',
    props.products.filter((el) => el.id !== id)
  );
};
</script>
<template>
  <div class="card" id="tableRef">
    <DataTable
      :value="props.products"
      dataKey="id"
      class="nomenclature_small_table"
      table-class="small-table"
    >
      <Column
        body-class="checkboxItem"
        header-class="checkboxItem"
        header="№"
        #body="{ index, data }"
      >
        <p
          :style="{
            color:
              highlightMode && data.items_count ? 'var(--vt-c-orange)' : 'var(--vt-c-text-black)'
          }"
        >
          {{ index + 1 }}
        </p></Column
      >
      <Column
        field="name"
        body-style="
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
        "
        class="selected_nomenclature_column_name"
        :header="$t('name')"
        #body="{ data }"
        header-style="padding-left:20px"
      >
        <p
          :style="{
            color:
              highlightMode && data.items_count ? 'var(--vt-c-orange)' : 'var(--vt-c-text-black)'
          }"
        >
          {{ data.name }}
        </p>
      </Column>
      <Column
        field="items_count"
        :header="$t('number of items')"
        #body="{ data }"
        :header-style="{ whiteSpace: 'nowrap' }"
        body-style=" line-height:24px"
        class="selected_nomenclature_column_count"
        ><p
          :style="{
            'font-size': '14px',
            color:
              highlightMode && data.items_count
                ? 'var(--vt-c-orange)'
                : linkMode
                ? 'var(--vt-c-electric-blue)'
                : 'var(--vt-c-text-black)',
            textAlign: 'right'
          }"
        >
          {{ readabilityNumber(Math.floor(data.items_count)) }}
        </p></Column
      >
      <Column field="id" #body="{ data }">
        <span style="cursor: pointer; padding-right: 10px" @click="() => removeFromList(data.id)">
          <XRemove />
        </span>
      </Column>
    </DataTable>
  </div>
</template>
<style lang="scss">
.nomenclature_small_table {
  .p-column-header-content {
    padding-left: 10px;
  }
  th {
    border: none !important;
    background: var(--vt-c-white) !important;
    color: var(--vt-c-text-black);
    padding: 0px !important;
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

@media only screen and (max-width: 650px) {
  .selected_nomenclature_column_name {
    max-width: 60px;
    white-space: nowrap;
    overflow: hidden;
  }
  .selected_nomenclature_column_count {
    max-width: 50px;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
