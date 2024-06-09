<script lang="ts" setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onMounted, ref, watch } from 'vue';
import type { IDataItem, ICurrencyInfo } from '@/views/analistic/positionPage/types';
import useUserInfo from '../../store/user';
import useCheckedName from '../../store/checkedName';
import { curFormatter } from '@/helpers/currencyFormatter';
const props = defineProps({
  defProducts: {
    type: Array<IDataItem>,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  currencyInfo: {
    type: Array<ICurrencyInfo>,
    required: true
  },
  currency: {
    type: Number,
    required: false
  }
});

onMounted(() => {
  (products.value = props.defProducts),
    (total.value = props.totalCount),
    (selectedProduct.value = props.defProducts);
});
const defCurrency = ref<boolean>(true);
const products = ref<IDataItem[]>([]);
const total = ref(0);
const selectedProduct = ref<IDataItem[]>([]);

watch(
  () => [props.defProducts, props.totalCount],
  () => {
    products.value = props.defProducts;
    total.value = props.totalCount;
  }
);

watch(
  () => props.defProducts,
  () => {
    selectedProduct.value = props.defProducts;
  }
);

watch(
  () => useUserInfo.userCurrency.value,
  () => {
    if (Number(useUserInfo.userCurrency.value) === 0) {
      defCurrency.value = true;
    } else if (Number(useUserInfo.userCurrency.value) === 1) {
      defCurrency.value = false;
    }
  }
);
const emit = defineEmits<{
  (e: 'selectProduct', value: IDataItem[]): void;
}>();

watch(
  () => selectedProduct.value,
  () => {
    emit('selectProduct', selectedProduct.value);
  }
);

watch(
  () => props.currency,
  () => {}
);

const rowClass = (data: any) => {
  return [{ checkedRow: data.name === useCheckedName.checkedName.value }];
};
</script>

<template>
  <div>
    <DataTable
      class="datatable_position"
      :value="products"
      dataKey="id"
      tableStyle="max-width: 50vw; max-width: 50vw"
      bodyClass="table_position_header"
      scrollable
      scrollHeight="60vh"
      v-model:selection="selectedProduct"
      :row-class="rowClass"
    >
      <Column
        selectionMode="multiple"
        headerClass="table_position_header"
        bodyClass="table_position_header"
      ></Column>
      <Column
        headerClass="table_position_header"
        bodyClass="table_position_header"
        :header="$t('supplier')"
      >
        <template #body="{ data }"
          ><div>{{ data.name }}</div></template
        ></Column
      >
      <Column
        v-if="currency?.toString() === '0'"
        bodyClass="table_position_header"
        headerClass="table_position_header"
        :header="$t('best price')"
      >
        <template #body="{ data }"
          ><img src="../icons/arrowUp.svg" alt="^" /> {{ curFormatter(data.price_min) }}
          {{
            currencyInfo[0].title.slice(-2) != 'YN'
              ? currencyInfo[0].title.slice(-2)
              : currencyInfo[0].title.slice(-3)
          }}</template
        ></Column
      >
      <Column
        v-else
        bodyClass="table_position_header"
        headerClass="table_position_header"
        :header="$t('best price')"
      >
        <template #body="{ data }"
          ><img src="../icons/arrowUp.svg" alt="^" /> {{ curFormatter(data.aux_price_min) }}
          {{ currencyInfo[1].title.slice(-2) }}</template
        ></Column
      >
      <Column
        v-if="currency?.toString() === '0'"
        bodyClass="table_position_header"
        headerClass="table_position_header"
        :header="$t('worse price')"
        ><template #body="{ data }">
          <div>
            <img src="../icons/arrowDown.svg" alt="v" /> {{ curFormatter(data.price_max) }}
            {{
              currencyInfo[0].title.slice(-2) != 'YN'
                ? currencyInfo[0].title.slice(-2)
                : currencyInfo[0].title.slice(-3)
            }}
          </div></template
        ></Column
      >
      <Column
        v-else
        bodyClass="table_position_header"
        headerClass="table_position_header"
        :header="$t('worse price')"
        ><template #body="{ data }">
          <div>
            <img src="../icons/arrowDown.svg" alt="v" /> {{ curFormatter(data.aux_price_max) }}
            {{ currencyInfo[1].title.slice(-2) }}
          </div>
        </template></Column
      >
      <Column
        headerClass="table_position_header"
        field="delivery_avg"
        :header="$t('average delivery')"
        ><template #body="{ data }">
          <div>{{ data.delivery_avg || 0 }} {{ $t('days') }}</div></template
        ></Column
      >
      <Column headerClass="table_position_header" field="delivery_avg" header=" "
        ><template #body="{ data }">
          <div
            class="position_div_procent"
            style="font-weight: 600"
            :style="{
              background: data.color
            }"
          >
            {{ data.procent }}
          </div></template
        ></Column
      >
    </DataTable>
  </div>
</template>

<style lang="scss">
@import './dataTablePosition.scss';
</style>
