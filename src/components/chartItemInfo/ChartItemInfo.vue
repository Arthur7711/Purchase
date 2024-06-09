<script setup lang="ts">
import type { ISipleTable } from '../simpleTable/types'
import { readabilityNumber } from '../../helpers/readabilityNumber'

const props = defineProps<{
  data: ISipleTable
  currency: string
  name?:string
}>()
</script>
<template>
  <div class="chartItem">
    <div
      :style="{ width: '12px', height: '12px', background: props.data.color, marginTop: '5px' }"
    ></div>
    <div class="textBox">
      <p class="title">{{ props.data.name }}</p>
      <p class="amount">
        {{ name ? readabilityNumber(Number(props.data.approved)) : readabilityNumber(Number(props.data.sum.toFixed(0))) }}
        {{ name ? 'одобрено' : props.currency.includes('N') ? 'Br' : props.currency }}
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chartItem {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.textBox {
  .title {
    color: var(--vt-c-text-black);
    font-size: 16px;
    line-height: 24px;
  }
  .amount {
    color: var(--vt-c-text-black);
    font-weight: 700;
    white-space: nowrap;
  }
}
</style>
