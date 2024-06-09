<script setup lang="ts">
import { ref } from "vue";
import CustomDropdownContainer from "../../../components/customDropdownContainer/CustomDropdownContainer.vue";
import CoinVertical from "../../../components/icons/CoinVertical.vue";
import SumLineChart from "../../../components/charts/SumLineChart.vue";
import type { ILineChartProps } from "../../../components/charts/types";
import { curFormatter } from "@/helpers/currencyFormatter";

defineProps<{ sum: string; graphtData: ILineChartProps }>();

const showChart = ref(false);
</script>
<template>
  <CustomDropdownContainer :is-open="showChart" @dropdown_control="showChart = $event">
    <template #head>
      <div>
        <p
          style="
            color: var(--vt-c-tabs-gray);
            font-size: 18px;
            font-weight: 600;
            line-height: 20px;
          "
        >
          {{ $t("total amount of purchases") }}
        </p>
        <div style="display: flex; gap: 14px; align-items: center; margin-top: 10px">
          <CoinVertical />
          <p style="font-weight: 600; font-size: 28px; line-height: 30px">
            {{ curFormatter(sum) }}
          </p>
        </div>
      </div>
    </template>
    <template #body>
      <div style="margin-top: 10px">
        <SumLineChart :graph-chart="graphtData" />
      </div>
    </template>
  </CustomDropdownContainer>
</template>
<style scoped lang="scss"></style>
