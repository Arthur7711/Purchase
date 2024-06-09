<script lang="ts" setup>
import {
  colorizePayingStatus,
  colorizeApproveStatus,
  colorizeProductStatus
} from '@/helpers/colorize_paying_status'

defineProps<{
  name: string | number
  type: string
  id?: string | number
  product_status?: { id: number; name: string }
  approve_status?: string
  items_count?: {
    deleted_items_count: string | number
    cancelled_items_count: string | number
    new_items_count: string | number
    in_process_items_count: string | number
    approving_items_count: string | number
    received_items_count: string | number
    rejected_items_count: string | number
    accepted_items_count: string | number
    pending_items_count: string | number
    no_approve_items_count: string | number
  }
}>()
</script>

<template>
  <div
    v-if="type === 'paying'"
    class="paycolorize_div_all"
    :style="{ color: colorizePayingStatus(id ? id : '') }"
  >
    {{ name }}
  </div>
  <div v-else-if="type === 'info.approve_status'">
    <span
      class="paycolorize_div_all"
      :style="{ color: colorizeApproveStatus(approve_status ? approve_status : '').color }"
      >{{ colorizeApproveStatus(approve_status ? approve_status : '').name }}
    </span>
    <div style="display: flex; flex-direction: row">
      <div
        v-show="items_count?.accepted_items_count != 0"
        class="paycolorize_div_count_acc paycolorize_div_count"
      >
        {{ items_count?.accepted_items_count }}
      </div>
      <div
        v-show="items_count?.rejected_items_count != 0"
        class="paycolorize_div_count_can paycolorize_div_count"
      >
        {{ items_count?.rejected_items_count }}
      </div>
      <div
        v-show="items_count?.pending_items_count != 0"
        class="paycolorize_div_count_pend paycolorize_div_count"
      >
        {{ items_count?.pending_items_count }}
      </div>
      <div
        v-show="items_count?.no_approve_items_count != 0"
        class="paycolorize_div_count_no paycolorize_div_count"
      >
        {{ items_count?.no_approve_items_count }}
      </div>
      <div
        v-show="
          !items_count?.no_approve_items_count &&
          !items_count?.accepted_items_count &&
          !items_count?.pending_items_count &&
          !items_count?.rejected_items_count
        "
        class="paycolorize_div_count_empty paycolorize_div_count"
      ></div>
    </div>
  </div>
  <div v-else-if="type === 'info.product_status'" style="margin-bottom: 2px">
    <span
      class="paycolorize_div_all"
      :style="{ color: colorizeProductStatus(product_status?.id ? product_status.id : '').color }"
      >{{ colorizeProductStatus(product_status?.id ? product_status.id : '').name }}</span
    >
    <div style="display: flex; flex-direction: row">
      <div
        v-show="items_count?.received_items_count != 0"
        class="paycolorize_div_count_acc paycolorize_div_count"
      >
        {{ items_count?.received_items_count }}
      </div>
      <div
        v-show="items_count?.cancelled_items_count != 0"
        class="paycolorize_div_count_can paycolorize_div_count"
      >
        {{ items_count?.cancelled_items_count }}
      </div>
      <div
        v-show="items_count?.in_process_items_count != 0"
        class="paycolorize_div_count_pend paycolorize_div_count"
      >
        {{ items_count?.in_process_items_count }}
      </div>
      <div
        v-show="items_count?.new_items_count != 0"
        class="paycolorize_div_count_no paycolorize_div_count"
      >
        {{ items_count?.new_items_count }}
      </div>
      <div
        v-show="items_count?.deleted_items_count != 0"
        class="paycolorize_div_count_del paycolorize_div_count"
      >
        {{ items_count?.deleted_items_count }}
      </div>
      <div class="paycolorize_div_count_empty paycolorize_div_count"></div>
    </div>
  </div>
</template>

<style>
.paycolorize_div_all {
  font-weight: 400;
  font-size: 14px;
}

.paycolorize_div_count {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 18px;
  padding: 0px 6px 1px 6px;
  border-radius: 3px;
  border: 1px #b6b6b699 solid;
  font-size: 12px;
  margin-left: 4px;
}

.paycolorize_div_count_acc {
  border-color: #689f384d;
  background-color: #689f380d;
}

.paycolorize_div_count_no {
  border-color: #b6b6b699;
  background-color: #99999914;
}

.paycolorize_div_count_pend {
  border-color: #1565c04d;
  background-color: #1565c00d;
}

.paycolorize_div_count_app {
  border-color: #689f384d;
  background-color: #689f380d;
}

.paycolorize_div_count_del {
  border-color: #f57c004d;
  background-color: #f57c0008;
}

.paycolorize_div_count_empty {
  background: none;
  border: none;
}
/* #F57C00 */
</style>
