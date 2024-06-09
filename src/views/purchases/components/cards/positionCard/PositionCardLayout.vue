<template>
  <div class="position-card">
    <TabView class="tabs-purchase">
      <TabPanel class="tabs-purchase_item" :header="$t('item group data')">
        <PositionData
          v-if="positionData"
          :group="positionData"
          @data-changed="positionData = $event"
        />
      </TabPanel>
      <TabPanel class="tabs-purchase_item" :header="$t('logs')">
        <LogsTab
          class="position-card_logs"
          :logs="usePurchasesInfo.selectedPosition.value?.logs"
        />
      </TabPanel>
      <TabPanel class="tabs-purchase_item" :header="$t('transfers')">
        <TransfersTab :transfers="usePurchasesInfo.selectedPosition.value?.transfers" />
      </TabPanel>
    </TabView>
    <div class="position-card_actions">
      <button
        :class="['position-card_actions__submit', { active: isChanged }]"
        :disabled="!isChanged"
        @click="$emit('save')"
      >
        {{ $t("save") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import LogsTab from "@/views/purchases/components/cards/purchaseCard/tabs/LogsTab.vue";
import TransfersTab from "./tabs/TransfersTab.vue";
import usePurchasesInfo from "@/store/purchases_store/purchases";
import PositionData from "./tabs/PositionData.vue";

import type { IPosition } from "../../dialogs/types";

const props = defineProps<{
  data: IPosition | null;
  isChanged: boolean;
}>();

const emit = defineEmits<{
  (e: "save"): void;
}>();

const positionData = ref<IPosition | null>(null);

watch(
  () => props.data,

  (value) => {
    positionData.value = value;
  }
);
</script>

<style lang="scss">
@import "../purchaseCard/style.scss";

.position-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 936px;
  min-width: 936px;
  height: 68vh;
  &_logs {
    padding: 0;
  }
  &_actions {
    display: flex;
    justify-content: flex-end;
    &__submit {
      cursor: auto;
      border: none;
      outline: none;
      padding: 10px;
      border-radius: 10px;
      background: #b6b6b6;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      &.active {
        cursor: pointer;
        background: #1565c0;
        color: white;
        margin: 0;
      }
    }
  }
}
</style>
