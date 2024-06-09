<script lang="ts" setup>
import type { Dataset } from '@/api/offices';
import { onMounted, ref, watch } from 'vue';
import { curFormatter } from '../../helpers/currencyFormatter';

const props = defineProps<{
  index: string | number;
  label: string;
  tableData: Dataset[];
  label_id: string | number;
}>();

const officePrices = ref({ min: '', max: '' });
const prices = ref({ min: '', max: '' });

const setOffisePrices = () => {
  let res: any = [];
  props.tableData.map((el) => {
    res.push(Number(el.data[Number(props.index)].per_office_staff_aux_price_sum));
  });
  officePrices.value.max = res.sort((a: number, b: number) => b - a)[0];
  officePrices.value.min = res.sort((a: number, b: number) => a - b)[0];
};
const setPrices = () => {
  let res: any = [];
  props.tableData.map((el) => {
    res.push(Number(el.data[Number(props.index)].per_office_staff_aux_price_sum));
  });
  prices.value.max = res.sort((a: number, b: number) => b - a)[0];
  prices.value.min = res.sort((a: number, b: number) => a - b)[0];
};
onMounted(() => {
  setOffisePrices();
  setPrices();
});

watch(
  () => props.tableData,
  () => {
    setOffisePrices();
    setPrices();
  }
);
</script>

<template>
  <div class="officestable_div_all" :style="{ width: 360 + tableData.length * 107 + 'px' }">
    <div class="officestable_div_row">
      <div style="display: flex; justify-content: center; align-items: center; padding: 5px">
        <span style="width: 165px; font-size: 14px">{{ label }}</span>
      </div>
      <div style="min-width: 165px; display: flex; flex-direction: column">
        <div class="officetable_div_span_descr">
          <span> {{ $t('per employee in the office') }}</span>
        </div>
        <div class="officetable_div_span_descr" style="margin-top: 1px">
          <span>{{ $t('per employee') }}</span>
        </div>
      </div>
      <div
        v-for="data in tableData"
        :key="data.label.id"
        style="display: flex; flex-direction: column; width: 107px"
      >
        <span
          :style="
            label_id == '2' || label_id == '7' || label_id == '11'
              ? Number(data.data[Number(index)].per_office_staff_aux_price_sum) ==
                Number(officePrices.max)
                ? { backgroundColor: 'rgba(198, 40, 40, 0.50)' }
                : String(data.data[Number(index)].per_office_staff_aux_price_sum) ==
                  officePrices.min
                ? { backgroundColor: 'rgba(104, 159, 56, 0.30)' }
                : { backgroundColor: 'rgba(245, 124, 0, 0.30)' }
              : { backgroundColor: '#B6B6B6' }
          "
          class="officetable_div_span_price"
          >{{ curFormatter(Number(data.data[Number(index)].per_office_staff_aux_price_sum)) }}
          <span v-if="label_id == '2' || label_id == '7' || label_id == '11'">
            <img
              v-if="Number(data.data[Number(index)].percent_per_office_staff_aux_price_sum) <= 0"
              src="../icons/stonksGreenDown.svg"
              alt="v"
            />
            <img v-else src="../icons/stonksRedDown.svg" alt="^" />
            {{
              Number(data.data[Number(index)].percent_per_office_staff_aux_price_sum).toFixed(0)
            }}%</span
          ></span
        >
        <span
          :style="
            label_id == '2' || label_id == '7' || label_id == '11'
              ? { backgroundColor: '#B6B6B6' }
              : String(data.data[Number(index)].per_office_staff_aux_price_sum) == officePrices.max
              ? { backgroundColor: 'rgba(198, 40, 40, 0.50)' }
              : String(data.data[Number(index)].per_office_staff_aux_price_sum) == officePrices.min
              ? { backgroundColor: 'rgba(104, 159, 56, 0.30)' }
              : { backgroundColor: 'rgba(245, 124, 0, 0.30)' }
          "
          style="margin-top: 1px"
          class="officetable_div_span_price"
          >{{ curFormatter(Number(data.data[Number(index)].per_staff_aux_price_sum).toFixed(0)) }}
          <span v-if="label_id !== '2' && label_id !== '7' && label_id !== '11'">
            <img
              v-if="Number(data.data[Number(index)].percent_per_staff_aux_price_sum) < 0"
              src="../icons/stonksGreenDown.svg"
              alt="v"
            />
            <img v-else src="../icons/stonksRedDown.svg" alt="^" />
            {{ Number(data.data[Number(index)].percent_per_staff_aux_price_sum).toFixed(0) }}%</span
          >
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.officestable_div_all {
  display: flex;
  flex-direction: column;
  margin-top: 0px;
  overflow: hidden;
  padding: 10px;
}

.officestable_div_row {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border-radius: 10px 10px 10px 10px;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.253);
  // backdrop-filter: blur(2.5px);
  padding: 12px 16px;
  height: 42px;
  flex-shrink: 0;
  padding: 0;
  padding-left: 10px;
}

.officetable_div_span_descr {
  background-color: #e3e3e3;
  height: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1px;
}

.officetable_div_span_price {
  height: 21px;
  font-size: 14px;
  display: flex;
  margin-left: 1px;
  justify-content: space-between;
  padding-left: 5px;
  padding-right: 5px;
  align-items: center;
  span {
    font-size: 13px;
    color: #666666;
  }
}
</style>
