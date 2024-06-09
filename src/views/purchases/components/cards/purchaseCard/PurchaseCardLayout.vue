<template>
  <div v-if="loading || !data" class="purchase-card_loading">
    <ProgressSpinner />
  </div>
  <div v-if="data" class="purchase-card">
    <div v-if="ScreenParams.screenParams.width > 650" class="purchase-card_pur-block">
      <PurchaseBlock
        :data="data"
        :type="type"
        :is-generated-description="isGenerated"
        :general-desc="generalDescription"
        :validate-data="validation && validation.purchase_data"
      />
    </div>
    <div v-else>
      <div
        v-if="props.showPurch"
        class="purchase-card_pur-block"
        :class="`purchase-card_pur-block_${props.type}`"
      >
        <button
          @click="$emit('hide')"
          class="purchase-card_pur-block_adaptive_hide_button"
        >
          {{ $t("hide") }}
        </button>
        <PurchaseBlock
          :data="data"
          :type="type"
          :is-generated-description="isGenerated"
          :general-desc="generalDescription"
          :validate-data="validation && validation.purchase_data"
        />
      </div>
    </div>
    <div class="purchase-card_content">
      <div class="purchase-card_tabs">
        <TabView
          class="tabs-purchase"
          @tab-click="
            (e) => {
              activeTab = e.index;
            }
          "
        >
          <TabPanel class="tabs-purchase_item">
            <template #header>
              <span
                :style="{
                  whiteSpace: 'nowrap',
                }"
              >
                {{ $t("item groups") }}
                <span
                  :style="{
                    fontWeight: 600,
                  }"
                  >{{ data.groups.length }}</span
                >
              </span>
            </template>
            <GroupsPositionsTab
              :currency="data.debited_currency"
              :is-generated-description="isGenerated"
              :is-completed-groups="isCompletedGroups"
              :groups="data.groups"
              :commons="commons"
              :type="type"
              :task-id="taskId"
              :payment-status-id="data.payment_status_id"
              :descriptions="groupsDescription"
              @update:descriptions="groupsDescription = $event"
              @completed="$emit('completedGroups', $event)"
            />
          </TabPanel>
          <TabPanel
            class="tabs-purchase_item"
            :disabled="type === 'create' || type === 'create-fav'"
          >
            <template #header>
              <span
                :style="{
                  whiteSpace: 'nowrap',
                }"
              >
                {{ $t("payments") }}
                <span
                  :style="{
                    fontWeight: 600,
                  }"
                  >{{ `${countPaymentsPurchase || ""}` }}</span
                >
              </span>
            </template>
            <PaymentsTab
              v-if="type === 'edit' && data.debited_currency && data.currency"
              :create-closed-doc="isCreatedClosedDoc"
              :is-amount-covered="purchaseAmountCovered"
              :purchase-id="data.id"
              :remainder-payments="remainderPayments"
              :count="countPaymentsPurchase"
              :debited-currency="data.debited_currency"
              :currency="data.currency"
              @update-count="countPaymentsPurchase = $event"
              @update-amount="purchaseAmountCovered = $event"
              @update-remainder="remainderPayments = $event"
            />
          </TabPanel>
          <TabPanel
            class="tabs-purchase_item"
            :disabled="type === 'create' || type === 'create-fav'"
          >
            <template #header>
              <div class="docs-header">
                <span class="docs-header_text">{{ $t("documents") }}</span>
                <div class="docs-header_icons">
                  <Bill_active :active="!!docsTypes[1]" />
                  <Contract_active :active="!!docsTypes[2]" />
                  <Closed_doc_active :active="!!docsTypes[3]" />
                  <Other_doc_active :active="!!docsTypes[6]" />
                </div>
              </div>
            </template>
            <DocsTab
              v-if="
                type === 'edit' && docsTypes && data.debited_currency && data.currency
              "
              :create-closed-doc="isCreatedClosedDoc"
              :groups="data.groups"
              :purchase-id="data.id"
              :is-amount-covered="purchaseAmountCovered"
              :remainder-payments="remainderPayments"
              :docs-purchase-types="docsTypes"
              :commons="commons"
              :debited-currency="data.debited_currency"
              :currency="data.currency"
              @update-docs-purchase-types="docsTypes = $event"
              @update-create-closed-doc="isCreatedClosedDoc = $event"
            />
          </TabPanel>
          <TabPanel
            class="tabs-purchase_item"
            :disabled="type === 'create' || type === 'create-fav'"
          >
            <template #header>
              <p class="comments-header">
                {{ $t("comments") }}
                <span>
                  <span
                    :style="{
                      fontWeight: '600',
                    }"
                    >{{ data.comments_count || "" }}</span
                  >
                  <span
                    :style="{
                      fontWeight: data.unread_comments_count ? '700' : '400',
                    }"
                    >{{
                      `${
                        data.unread_comments_count ? `+${data.unread_comments_count}` : ""
                      }`
                    }}</span
                  >
                </span>
              </p>
            </template>
            <CommentsTab
              v-if="type === 'edit' && activeTab === 3"
              :purchase-id="data.id"
              :count-comments="data.comments_count"
              @update-count-comments="data.comments_count = $event"
              @update-count-unread-comments="data.unread_comments_count = $event"
            />
          </TabPanel>
          <TabPanel
            class="tabs-purchase_item"
            :header="$t('logs')"
            :disabled="type === 'create' || type === 'create-fav'"
          >
            <LogsTab v-if="type === 'edit'" :logs="data.logs" />
          </TabPanel>
        </TabView>
      </div>
      <div
        class="purchase-card_content__actions"
        :style="{
          justifyContent: type === 'edit' ? 'space-between' : 'flex-end',
        }"
      >
        <CurtailedContentPositions v-if="type === 'edit'" />
        <Button
          v-if="type === 'create' || type === 'create-fav'"
          unstyled
          class="purchase-card_btn-create"
          @click="$emit('create')"
          :disabled="!props.isCompletedPurchase"
        >
          {{ $t("create") }}</Button
        >

        <Button
          v-if="type === 'edit'"
          unstyled
          class="purchase-card_btn-create"
          @click="$emit('save')"
          :disabled="!isCompletedPurchase"
          >{{ $t("save") }}</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

import useCommonsInfo from "@/store/purchases_store/commons";
import type { ICommonDefault } from "@/store/purchases_store/commons";
import useBudgetExp from "@/store/expenses_store/budget_exp";

import PurchaseBlock from "./PurchaseBlock.vue";
import CommentsTab from "./tabs/CommentsTab.vue";
import DocsTab from "./tabs/DocsTab.vue";
import PaymentsTab from "./tabs/PaymentsTab.vue";
import GroupsPositionsTab from "./tabs/GroupsPositionsTab.vue";
import LogsTab from "./tabs/LogsTab.vue";
import CurtailedContentPositions from "../CurtailedContentPositions.vue";

import Bill_active from "@/components/icons/bill_active.vue";
import Other_doc_active from "@/components/icons/other_doc_active.vue";
import Closed_doc_active from "@/components/icons/closed_doc_active.vue";
import Contract_active from "@/components/icons/contract_active.vue";
import ProgressSpinner from "primevue/progressspinner";
import useUserInfo from "@/store/user";
import usePurchasesInfo from "@/store/purchases_store/purchases";

import type { PropsCardLayout } from "./types";
import { getAllDataPurchase } from "@/api/purchaseCommons";
import type { IPurchase, IPurchaseNew } from "../../dialogs/types";
import ScreenParams from "@/store/screen";

const props = withDefaults(defineProps<PropsCardLayout>(), {
  type: "create",
  purchase: null,
  validation: null,
  taskId: null,
  isLoading: true,
  showPurch: false,
  isCompletedPurchase: true,
  isCompletedGroups: true,
});

const emit = defineEmits<{
  (e: "update:isLoading", value: boolean): void;
  (e: "update:purchase", value: IPurchase | IPurchaseNew | null): void;
  (e: "hide"): void;
  (e: "create"): void;
  (e: "save"): void;
  (e: "completedGroups", value: boolean): void;
}>();

const commons = ref<{ [key: string]: { [key: number]: string } }>({});
const isGenerated = ref(false);
const purchaseAmountCovered = ref(false);
const loading = ref(true);
const data = ref<IPurchase | IPurchaseNew | null>(props.purchase);
const activeTab = ref(0);
const countPaymentsPurchase = ref(0);
const remainderPayments = ref(0);
const docsTypes = ref<{ [key: number | string]: number }>(
  Object.fromEntries(
    useCommonsInfo.commons.value.document_types_purchase.map((item) => [item.id, 0])
  )
);
const isCreatedClosedDoc = ref(false);
const showPurchase = ref(false);
const toObjectCommon = (arr: ICommonDefault[] | any[]) => {
  if (Array.isArray(arr)) {
    const objCommon: { [key: number]: string } = {};

    for (const item of arr) {
      objCommon[item.id] = item.name;
    }

    return objCommon;
  }
  return [];
};
const generalDescription = ref<string | null>(null);
const groupsDescription = ref<(string | null)[]>([]);

const initInfo = async (location_id?: number) => {
  loading.value = true;
  location_id ? await getAllDataPurchase(location_id) : await getAllDataPurchase();

  commons.value.productStatuses = toObjectCommon(
    useCommonsInfo.commons.value.productStatuses
  );
  commons.value.purposes = toObjectCommon(useCommonsInfo.commons.value.purposes);
  commons.value.warehouses = toObjectCommon(useCommonsInfo.commons.value.warehouses);
  commons.value.docsTypes = toObjectCommon(
    useCommonsInfo.commons.value.document_types_purchase
  );
  if (useBudgetExp.allBudgetExp.value)
    commons.value.budgets = toObjectCommon(useBudgetExp.allBudgetExp.value);

  loading.value = false;
  isGenerated.value = props.type !== "edit";
};

watch(
  () => useUserInfo.userData.value,
  (value) => {
    if (value) {
      if (props.type === "edit") {
        if (value?.location.id === usePurchasesInfo.selectedPurchase.value?.location_id) {
          initInfo();
        } else if (usePurchasesInfo.selectedPurchase.value?.location_id)
          initInfo(usePurchasesInfo.selectedPurchase.value.location_id);
        else {
          initInfo();
        }
      } else initInfo();
    }
  }
);

watch(
  () => props.purchase,
  (value) => {
    data.value = value;
  }
);

watch(
  () => groupsDescription.value,
  (value) => {
    generalDescription.value = value.reduce(
      (acc: string, prev: string | null, index: number): string =>
        (acc += index && prev ? "\n" + prev : prev ? prev : ""),
      ""
    );
  },
  { deep: true }
);

watch(
  () => props.type,
  (value) => {
    if (value === "create") {
      generalDescription.value = "";
    }
  }
);

watch(
  () => data.value,
  (value) => {
    emit(
      "update:purchase",
      props.type === "edit" ? (value as IPurchase) : (value as IPurchaseNew)
    );
  },
  { deep: true }
);

watch(
  () => props.isLoading,
  (value) => {
    loading.value = value;
  }
);

watch(loading, () => {
  emit("update:isLoading", loading.value);
});

onMounted(async () => {
  groupsDescription.value = Array(
    props.purchase?.groups ? props.purchase?.groups.length : 1
  ).fill(null);

  if (props.type === "edit") {
    if (
      useUserInfo.userData.value?.location.id ===
      usePurchasesInfo.selectedPurchase.value?.location_id
    ) {
      initInfo();
    } else if (usePurchasesInfo.selectedPurchase.value?.location_id)
      initInfo(usePurchasesInfo.selectedPurchase.value.location_id);
    else {
      initInfo();
    }
  } else initInfo();
});
</script>

<style lang="scss">
@import "./style.scss";
@import "../../../../../assets/colors.scss";
.p-tabview .p-tabview-panels {
  background: none;
}
.p-tabview .p-tabview-nav {
  background: none;
}

.comments-header {
  display: flex;
  gap: 2px;
}
.purchase-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 94%;
  &_loading {
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    border-radius: 15px;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.582);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &_pur-block {
    height: auto;
    max-height: 100%;
    overflow: auto;
    width: 26%;
    min-width: 320px;
    padding: 16px 10px 24px 10px;
    border-radius: 15px;
    box-shadow: 0px 0px 22px 7px #efefef;
    background: white;
  }
  &_content {
    height: 100%;
    width: 73%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &__actions {
      display: flex;
      align-items: center;
      height: 10%;
      width: 100%;
    }
  }
  &_tabs {
    position: relative;
    height: 90%;
    width: 100%;
    max-width: 1110px;
  }
  &_btn-create {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    height: 50px;
    color: black;
    border: none;
    outline: none;
    border-radius: 10px;
    background-color: #1565c0;
    color: #ffffff;
    font-weight: 600;
    font-size: 16px;
    &:enabled:hover {
      background-color: #256ec2;
    }
    &:disabled {
      cursor: auto;
      background-color: #b6b6b6;
    }
  }
}

@media only screen and (max-width: 650px) {
  .purchase-card {
    overflow: scroll !important;
    max-width: 100vw;
    max-height: 100vh;
    &_pur-block {
      position: fixed;
      z-index: 2;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100vw;
      height: 100vh;
      padding-top: 6vh;
      &_create {
        left: 0vw;
        padding-top: 10vh;
      }
      &_adaptive_hide_button {
        position: fixed;
        right: 10vw;
        top: 7vh;
        z-index: 2;
        background-color: $purch_blue;
        color: white;
        border-radius: 10px;
        width: 80px;
        border: none;
        padding: 2%;
      }
    }
  }
}
</style>
