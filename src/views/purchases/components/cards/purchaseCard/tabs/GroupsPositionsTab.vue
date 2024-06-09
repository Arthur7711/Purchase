<template>
  <Simplebar data-simplebar-auto-hide="false" :style="{ height: '95%' }">
    <div :class="$style['groups-tab']">
      <div :class="$style['groups-tab_wrapper']">
        <GroupPositions
          v-for="(group, index) in groupsPositions"
          :currency="currency"
          :is-generated-description="isGeneratedDescription"
          :key="group.hash || `${new Date()}`"
          :index-group="index + 1"
          :group="group"
          :is-once-group="groupsPositions.length === 1"
          :commons="commons"
          :type="type"
          :task-id="taskId"
          :payment-status-id="paymentStatusId"
          @copy="copyGroup($event)"
          @delete="deleteGroup($event)"
          @completed="isCompletedValues[index] = $event"
          :style="{
            zIndex: `${groupsPositions ? groupsPositions.length * 10 - index * 10 : 0}`,
          }"
          :description="descriptionsGroup[index]"
          @update:description="descriptionsGroup[index] = $event"
        />
      </div>

      <div :class="$style['groups-tab_add-action']">
        <button
          :class="$style['groups-tab_add-action__btn']"
          @click="addGroup"
          :disabled="paymentStatusId === 3"
        >
          {{ $t("add a group") }} <SquarePlus />
        </button>
      </div>
    </div>
  </Simplebar>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import type { IGroup } from "@/views/purchases/components/dialogs/types";

import Simplebar from "simplebar-vue";
import "simplebar-vue/dist/simplebar.min.css";

import GroupPositions from "@/views/purchases/components/cards/purchaseCard/tabs/components/positions/GroupPositions.vue";
import SquarePlus from "@/components/icons/SquarePlus.vue";

const props = defineProps<{
  groups: IGroup[];
  currency: string | null;
  commons?: { [key: string]: { [key: number]: string } };
  type: string;
  isGeneratedDescription: boolean;
  taskId: string | null;
  paymentStatusId: number | null;
  descriptions: (string | null)[];
}>();
const emit = defineEmits<{
  (e: "update:groups", value: IGroup[] | null): void;
  (e: "update:descriptions", value: (string | null)[]): void;
  (e: "completed", value: boolean): void;
}>();

const groupsPositions = ref<IGroup[]>(props.groups);
const descriptionsGroup = ref<(string | null)[]>([]);
const isCompletedValues = ref<boolean[]>([]);

watch(
  () => groupsPositions.value,
  (value) => {
    emit("update:groups", value);
  },
  { deep: true }
);

watch(
  () => props.groups,
  () => {
    groupsPositions.value = props.groups;
  }
);

watch(
  () => isCompletedValues.value,
  (value) => {
    emit("completed", !value.some((item) => !item));
  },
  { deep: true }
);

watch(
  () => descriptionsGroup.value,
  (value) => {
    emit("update:descriptions", value);
  },
  { deep: true }
);

const emptyGroup = ref<IGroup>({
  name_id: null,
  type_id: null,
  sub_type_id: null,
  quantity: 1,
  unit_id: 1,
  debited_price: 0,
  items: [
    {
      status_id: 1,
      purpose_id: null,
      budget_id: null,
      task_id: props.taskId !== null ? +props.taskId : null,
      warehouse_id: null,
      activated_at: null,
      note: null,
      approval: null,
    },
  ],
});

const addGroup = (): void => {
  if (Array.isArray(groupsPositions.value)) {
    groupsPositions.value.push({
      ...emptyGroup.value,
    });
  }
};

const copyGroup = (group: { info: IGroup; ind: number }): void => {
  if (group && groupsPositions.value) {
    const copiedGroup: IGroup = { ...group.info };

    groupsPositions.value.splice(group.ind, 0, copiedGroup);
  }
};

const deleteGroup = (index: number): void => {
  if (groupsPositions.value) {
    groupsPositions.value.splice(index, 1);
  }
};

onMounted(() => {
  descriptionsGroup.value = props.descriptions;

  isCompletedValues.value = Array(props.groups.length).fill(props.type === "edit");
});
</script>

<style lang="scss" module>
.groups-tab {
  position: relative;
  height: 90%;
  width: 100%;
  padding: 15px;
  &_wrapper {
    width: 100%;
    gap: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &_add-action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px 0;
    &__btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 10px 10px 12px 10px;
      border-radius: 10px;
      gap: 8px;
      color: #1565c0;
      background: none;
      border: none;
      outline: none;
      font-size: 14px;
      font-weight: 600;
      &:disabled {
        cursor: auto;
        opacity: 0.5;
        &:hover {
          background: none;
        }
      }
      &:hover {
        background: #1565c011;
      }
    }
  }
}
</style>
