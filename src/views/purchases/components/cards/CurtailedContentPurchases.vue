<template>
  <div class="curtailed-data_wrapper">
    <div class="curtailed-data">
      <div
        class="curtailed-data_item"
        v-for="(purchase, index) in usePurchasesInfo.curtailedPurchases.value"
        :key="purchase.id"
        :style="{
          border: `1px solid rgba(${
            purchase.info?.product_status
              ? setProductStatusColor(purchase.info.product_status.id)
              : setProductStatusColor(1)
          }, 0.5)`,
          background: `linear-gradient(0deg, rgba(${
            purchase.info?.product_status
              ? setProductStatusColor(purchase.info.product_status.id)
              : setProductStatusColor(1)
          }, 0.05) 0%, rgba(${
            purchase.info?.product_status
              ? setProductStatusColor(purchase.info.product_status.id)
              : setProductStatusColor(1)
          }, 0.05) 100%), rgba(255, 255, 255, 0.90)`,
        }"
        @click="
          (e) => {
            e.stopPropagation();

            selectedPurchase(purchase);
            usePurchasesInfo.deleteCurtailedPurchase(index);
          }
        "
      >
        <div class="curtailed-data_item__header">
          <p class="text">
            {{ purchase?.id ? purchase.id : null }}
            <span
              :style="{
                color: purchase.info?.product_status
                  ? colorizeProductStatus(purchase.info.product_status.id).color
                  : colorizeProductStatus(1).color,
              }"
            >
              {{
                purchase?.id && purchase?.info
                  ? purchase.info.product_status?.name.toLocaleLowerCase()
                  : $t("new") + " " + $t("purchase") + " " + newPurchaseID(purchase)
              }}</span
            >
          </p>
          <div class="curtailed-data_item__actions">
            <button
              v-if="purchase && purchase?.id && purchase?.isChanged"
              class="edit-position_actions__close"
            >
              <img
                :src="saveIcon"
                alt="save"
                @click="
                  (e) => {
                    e.stopPropagation();
                    savePurchase(purchase);
                    usePurchasesInfo.deleteCurtailedPurchase(index);
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
                    usePurchasesInfo.deleteCurtailedPurchase(index);

                    usePurchasesInfo.curtailedPositions.value.forEach((item, ind) => {
                      if (item.purchase_id === purchase.id) {
                        usePurchasesInfo.deleteCurtailedPosition(ind);
                      }
                    });
                  }
                "
              />
            </button>
          </div>
        </div>
        <p class="text description">
          {{ purchase.description || $t("no description") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import usePurchasesInfo from "@/store/purchases_store/purchases";
import { colorizeProductStatus } from "@/helpers/colorize_paying_status";

import CrossMark from "@/components/icons/xmark.svg";
import saveIcon from "@/components/icons/saveIcon.svg";
import type { IPurchase, IPurchaseNew } from "../dialogs/types";
import { changePurchase, createPurchase } from "@/api/purchases";

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

const newPurchaseID = (purch: IPurchaseNew | IPurchase): string => {
  const data = purch as IPurchaseNew;

  if (data.id_new) {
    return data.id_new.split(" ")[1];
  }

  return "";
};

const selectedPurchase = (purch: IPurchase | IPurchaseNew): void => {
  if (purch.id) {
    usePurchasesInfo.setSelectedPurchase({ ...purch } as IPurchase);
  } else {
    usePurchasesInfo.setSelectedNewPurchase(purch as IPurchaseNew);
  }
};

const savePurchase = (purch: IPurchase | IPurchaseNew): void => {
  if (purch.id) {
    changePurchase(purch as IPurchase)
      .then((res: IPurchase) => {
        usePurchasesInfo.setSelectedPurchase(null);
        usePurchasesInfo.setUpdateTable(true);

        setTimeout(() => {
          usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
        });
      })
      .finally(() => {
        usePurchasesInfo.setUpdateTable(false);
      });
  } else {
    createPurchase(purch as IPurchaseNew)
      .then((res) => {
        usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
        usePurchasesInfo.setUpdateTable(true);
      })
      .finally(() => {
        usePurchasesInfo.setUpdateTable(false);
      });
  }
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
    width: 100%;
    position: fixed;
    z-index: 1000;
    bottom: 0;
  }
  &_item {
    cursor: pointer;
    min-width: 240px;
    width: 240px;
    min-height: 76px;
    padding: 12px 16px;
    border-radius: 10px;
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
