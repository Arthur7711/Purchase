<template>
  <div class="curtailed-data_wrapper" v-if="usePurchasesInfo.selectedPurchase.value">
    <div class="curtailed-data">
      <div
        class="curtailed-data_item"
        v-for="(position, index) in usePurchasesInfo.curtailedPositions.value.filter(
          (item) =>
            usePurchasesInfo.selectedPurchase.value &&
            item.purchase_id === usePurchasesInfo.selectedPurchase.value.id
        )"
        :style="{
          border: `1px solid rgba(${
            position?.status_id
              ? setProductStatusColor(position?.status_id)
              : setProductStatusColor(1)
          }, 0.5)`,
          background: `linear-gradient(0deg, rgba(${
            position?.status_id
              ? setProductStatusColor(position.status_id)
              : setProductStatusColor(1)
          }, 0.05) 0%, rgba(${
            position?.status_id
              ? setProductStatusColor(position.status_id)
              : setProductStatusColor(1)
          }, 0.05) 100%), rgba(255, 255, 255, 0.90)`,
        }"
        :key="position.id"
        @click="
          (e) => {
            e.stopPropagation();

            selectedPosition(position);
            usePurchasesInfo.deleteCurtailedPosition(index);
          }
        "
      >
        <div class="curtailed-data_item__header">
          <p class="text">
            {{ position?.id ? position.id : null }}
            <span
              :style="{
                color: position?.status_id
                  ? colorizeProductStatus(position.status_id).color
                  : colorizeProductStatus(1).color,
              }"
            >
              {{
                position?.status_id
                  ? colorizeProductStatus(position.status_id).name
                  : colorizeProductStatus(1).name
              }}</span
            >
          </p>
          <div class="curtailed-data_item__actions">
            <button v-if="position.is_changed" class="edit-position_actions__close">
              <img
                :src="saveIcon"
                alt="save"
                @click="
                  (e) => {
                    e.stopPropagation();
                    savePosition(position);
                    usePurchasesInfo.deleteCurtailedPosition(index);
                  }
                "
              />
            </button>
            <button class="edit-position_actions__close">
              <img
                :src="CrossMark"
                alt="X"
                @click="
                  (e) => {
                    e.stopPropagation();
                    usePurchasesInfo.deleteCurtailedPosition(index);
                  }
                "
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import usePurchasesInfo from "@/store/purchases_store/purchases";
import { colorizeProductStatus } from "@/helpers/colorize_paying_status";

import CrossMark from "@/components/icons/xmark.svg";
import saveIcon from "@/components/icons/saveIcon.svg";
import type { IPosition, IPurchase } from "../dialogs/types";
import { changePosition } from "@/api/positions";
import { getPurchase } from "@/api/purchases";

const setProductStatusColor = (id: number) => {
  switch (id) {
    case 2:
      return "21, 101, 192";
    case 4:
      return "194, 24, 91";
    case 3:
      return "104, 159, 56";
    case 7:
      return "198, 40, 40";
    case 8:
      return "245, 124, 0";
    default:
      return "102, 102, 102";
  }
};
const selectedPosition = (position: IPosition): void => {
  usePurchasesInfo.setSelectedPosition(position);
};

const savePosition = async (position: IPosition): Promise<void> => {
  await changePosition(position).then(async (res: IPosition) => {
    usePurchasesInfo.setSelectedPosition({ ...res, is_changed: false });

    await getPurchase(res.purchase_id).then(async (ans: IPurchase) => {
      usePurchasesInfo.setSelectedPurchase({ ...ans, isChanged: false });
    });
  });

  usePurchasesInfo.setUpdatePositionTable(true);

  setTimeout(() => {
    usePurchasesInfo.setUpdatePositionTable(false);
  });
};
</script>

<style lang="scss" scoped>
.curtailed-data {
  &::-webkit-scrollbar {
    width: 0;
    height: 5px;
  }
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  overflow: auto;
  width: 98%;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 5px 0;
  &_wrapper {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
  }
  &_item {
    box-sizing: border-box;
    cursor: pointer;
    min-width: 200px;
    width: 200px;
    height: 50px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid rgba(171, 171, 171, 0.16);
    box-shadow: 9px 0px 5px 0px rgba(171, 171, 171, 0.16);
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > .text {
        color: #000;
        font-size: 16px;
        font-weight: 400;
        white-space: nowrap;
      }
    }
    &__actions {
      display: flex;
      gap: 20px;
    }
    .description {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
