<script setup lang="ts">
import { ref, watch } from 'vue';
import type { INomenclatureTable } from './types';
import useCheckedName from '../../store/checkedName';
import { readabilityNumber } from '../../helpers/readabilityNumber';
import TableSelectedIcon from '../../components/icons/TableSelectedIcon.vue';
import ScreenParams from '@/store/screen';

const props = defineProps<{
  products: Array<INomenclatureTable>;
  markedText?: string;
  nomenclatureSelectedDataTable: Array<INomenclatureTable>;
}>();

const emit = defineEmits<{
  (e: 'select-product', value: INomenclatureTable[]): void;
}>();
const selectedProduct = ref<INomenclatureTable[]>([]);
const clickedRow = ref(Infinity);
watch(selectedProduct, () => {
  emit('select-product', selectedProduct.value);
});
watch(
  () => props.nomenclatureSelectedDataTable,
  () => {
    selectedProduct.value = props.nomenclatureSelectedDataTable;
  }
);
const rowClicker = (info: INomenclatureTable) => {
  if (selectedProduct.value.find((el) => el.id === info.id)) {
    selectedProduct.value = selectedProduct.value.filter((el) => el.id !== info.id);
  } else {
    selectedProduct.value = [...selectedProduct.value, info];
  }
  clickedRow.value = info.id;
};
const url = import.meta.env.VITE_VUE_PROJECT;
</script>
<template>
  <div class="card" id="tableRef" style="max-width: 1100px; overflow: hidden">
    <DataTable
      v-model:selection="selectedProduct"
      :value="props.products"
      dataKey="id"
      class="nomenclature_table"
      v-on:row-click="(e) => rowClicker(e.data)"
      table-class="nomenclature_datatable"
    >
      <Column selectionMode="multiple" body-class="checkboxItem" header-class="checkboxItem">
        <template #rowcheckboxicon="{ checked }">
          <TableSelectedIcon :style="{ display: checked ? 'block' : 'none' }" />
        </template>
      </Column>
      <Column
        field="name"
        :body-style="
          ScreenParams.screenParams.width > 650
            ? {
                fontWeight: '400',
                fontSize: '14px',
                lineHeight: '20px',
                maxWidth: '400px',
                overflow: 'hidden'
              }
            : {
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                maxWidth: '100px',
                maxHeight: '90px',
                overflow: 'hidden',
                textWrap: 'balance',
                textOverflow: 'clip'
              }
        "
        :header="$t('name')"
        #body="{ data }"
      >
        <p>
          <mark v-if="markedText" style="background: var(--vt-c-marked-text)">{{ markedText }}</mark
          >{{ markedText ? data.name.split(markedText)[0] : data.name }}
        </p>
      </Column>
      <Column
        field="items_count"
        :header="$t('positions')"
        #body="{ data }"
        :header-style="{ whiteSpace: 'nowrap' }"
        body-style=" line-height:24px;           
        max-width: 120px;
        overflow:hidden;"
        ><a
          :href="`${url}#/purchases?table_type=position&date=3&name_id=${data.id}`"
          target="_blank"
          style="font-size: 14px; color: var(--vt-c-electric-blue)"
        >
          {{ readabilityNumber(Math.floor(data.items_count)) }}
        </a></Column
      >
      <Column
        field="types"
        :header="$t('types_2')"
        :header-style="{ whiteSpace: 'nowrap' }"
        #body="{ data }"
      >
        <span v-for="(info, index) in data.types" style="font-size: 14px" :key="info.id"
          >{{ index === 0 ? info.name : `, &nbsp; ${info.name}` }}
          <a
            :href="`${url}#/purchases?table_type=position&date=3&name_id=${data.id}&type_ids[]=${info.id}`"
            target="_blank"
            style="color: var(--vt-c-electric-blue); margin-right: 5px"
            >{{ info.items_count }}</a
          >
        </span>
      </Column>
      <Column field="sub_types" :header="$t('subtypes_2')" #body="{ data }">
        <span v-for="info in data.sub_types" style="font-size: 14px" :key="info.id"
          >{{ info.name }}
          <a
            :href="`${url}#/purchases?table_type=position&date=3&name_id=${data.id}&subtype_ids[]=${info.id}`"
            target="_blank"
            style="color: var(--vt-c-electric-blue); margin-right: 5px"
            >{{ info.items_count }}</a
          >
        </span>
      </Column>
    </DataTable>
  </div>
</template>
<style lang="scss">
.nomenclature_datatable {
  border-collapse: collapse !important;
  border-collapse: separate !important;
  border-spacing: 0 16px !important;
}
.nomenclature_table {
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
  tr:nth-child(odd) {
    background-color: var(--vt-c-backgroud-gray) !important;
  }
  tr:hover {
    td {
      cursor: pointer;
      background: var(--vt-c-border-gray);
    }
  }
  tr:focus {
    outline: none !important;
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
  .p-highlight {
    td {
      background: var(--vt-c-marked_table-background) !important;
    }
  }
}
</style>
