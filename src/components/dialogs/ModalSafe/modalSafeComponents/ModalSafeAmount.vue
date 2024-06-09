<script lang="ts" setup>
import { curFormatter } from "@/helpers/currencyFormatter";

const props = defineProps<{
  amount: string | number;
  is_active: boolean;
  currency: string;
  entity_id: number;
}>();

const colorValidator = () => {
  let color = !props.is_active
    ? "#999"
    : Number(props.amount) > 0
    ? "#689F38"
    : "#1A1A1A";
  return color;
};
</script>

<template>
  <div
    class="amount-price"
    v-tooltip="
      amount && String(amount).length > 7
        ? {
            value: `${Number(amount) > 0 ? '+' : ''}${curFormatter(amount)} ${currency}`,
            escape: true,
            class: 'custom-note',
          }
        : undefined
    "
  >
    <img
      v-if="!is_active && entity_id !== 2"
      style="margin-right: 5px"
      src="../../../icons/watchApprove.svg"
      alt=""
    />
    <span :style="{ color: colorValidator() }"
      >{{ Number(amount) > 0 ? "+" : "" }}{{ curFormatter(amount) }} {{ currency }}</span
    >
  </div>
</template>

<style lang="scss">
.amount-price {
  white-space: nowrap;
  overflow: hidden;
}
</style>
