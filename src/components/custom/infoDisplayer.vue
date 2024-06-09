<script lang="ts" setup>
import { curFormatter } from "../../helpers/currencyFormatter";

const props = defineProps<{
  symbol?: string;
  summ?: (string | number)[];
  percent?: string | number;
  title: string;
  staff_percent?: string | number;
  staff?: string | number;
  mode: "summ" | "customer";
  fontSizeNumber?: string;
}>();
</script>

<template>
  <div class="exp_div_top_data" v-if="mode === 'summ' && props.summ && props.percent">
    <span> {{ title }} </span>
    <h3
      :style="{
        fontSize: fontSizeNumber || '30px',
      }"
    >
      {{ symbol !== "$" ? curFormatter(props.summ[0]) : curFormatter(props.summ[1]) }}
      {{ symbol }}
    </h3>
    <hr />
    <h4 class="exp_span_top_data">
      <img
        v-if="Number(props.percent) > 0"
        class="exp_img_stonks"
        src="../icons/stonksRedDown.svg"
        alt="stonks"
      />
      <img
        v-if="Number(props.percent) < 0"
        class="exp_img_stonks"
        src="../icons/stonksGreenDown.svg"
        alt="stonks"
      />
      {{ Number(props.percent).toFixed(1) }}% {{ $t("than in the last period") }}
    </h4>
  </div>
  <div class="exp_div_top_data exp_div_second" v-else-if="mode === 'customer'">
    <span> {{ title }} </span>
    <h3
      :style="{
        fontSize: fontSizeNumber || '30px',
      }"
    >
      {{ Number(props.staff).toFixed(0) }}
    </h3>
    <hr />
    <h4 class="exp_span_top_data">
      <img
        v-if="Number(props.staff_percent) >= 0"
        src="../icons/stonksUpGray.svg"
        alt="^"
      />
      <img
        v-else-if="Number(props.staff_percent) < 0"
        src="../icons/stonksDownGray.svg"
        alt="v"
      />
      {{
        Number.isNaN(props.staff_percent)
          ? "нет данных"
          : Number(props.staff_percent).toFixed(0)
      }}
      {{ $t("person(s) per period") }}
    </h4>
  </div>
</template>

<style>
@import "./displayers.scss";
</style>
