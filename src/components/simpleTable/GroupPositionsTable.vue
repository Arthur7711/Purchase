<template>
  <DataTable
    scrollHeight="400px"
    v-model:selection="selectedProduct"
    scrollable
    :class="['group-table', { overflow: data.length <= 4 }]"
    :value="data"
    @row-click="selectPosition($event)"
  >
    <Column selectionMode="multiple" headerStyle="width: 2rem"></Column>
    <Column v-if="type !== 'create' && type !== 'create-fav'" field="ID">
      <template #header>
        <div class="group-table_header no-active">
          <div class="group-table_header__title--text">
            <p>ID</p>
          </div>
        </div>
      </template>
      <template #body="{ data }">
        {{ !data.is_new ? data.id : "—" }}
      </template></Column
    >
    <Column field="task_id">
      <template #header>
        <TaskIDGroup
          v-if="
            (paymentStatusId !== 3 ||
              useUserInfo.userData.value?.permissions.edit_paid_purchase) &&
            selectedProduct.length
          "
          :value="selectedTaskID"
          @data-change="selectedTaskID = $event"
        />
        <div v-else class="group-table_header">
          <div class="group-table_header__title">
            <p>{{ $t("task ID") }}</p>
          </div>
        </div>
      </template>
      <template #body="{ data }">
        {{ data.task_id || "—" }}
      </template>
    </Column>
    <Column
      v-if="
        type !== 'create' &&
        type !== 'create-fav' &&
        (useUserInfo.userData.value?.permissions.control_approve ||
          useUserInfo.userData.value?.permissions.view_approves)
      "
      field="approval"
    >
      <template #header>
        <div
          v-show="
            selectedProduct.length &&
            useUserInfo.userData.value?.permissions.control_approve
          "
          class="group-table_header"
        >
          <Approvals
            :approval="selectedApproval"
            @data-change="selectedApproval = $event"
            :selected-positions="selectedProduct"
          />
        </div>
        <div
          v-if="
            !selectedProduct.length ||
            (useUserInfo.userData.value?.permissions.view_approves &&
              !useUserInfo.userData.value?.permissions.control_approve)
          "
          class="group-table_header no-active"
        >
          <div class="group-table_header__title">
            <p>{{ $t("agreement") }}</p>
          </div>
        </div>
      </template>
      <template #body="{ data }">
        <div v-if="data.approval" class="group-table_cell">
          <p
            class="group-table_cell__label"
            v-if="data.approval.type === 'purchase'"
            :style="{
              background: `${
                colorizeApproveStatus(data.approval.status.toLowerCase()).color
              }`,
            }"
          >
            pur
          </p>
          <TooltipPurchTable
            class="group-table_cell__avatar"
            :accountname="data.approval.user.samaccountname"
            :name="
              i18n_config.global.locale === 'en'
                ? data.approval.user.displayname
                : data.approval.user.description
            "
            :style="{
              border: `4px solid ${
                colorizeApproveStatus(data.approval.status.toLowerCase()).color
              }`,
            }"
          />
        </div>
        <span v-else>—</span>
      </template></Column
    >
    <Column field="status_id">
      <template #header>
        <ListOptionsGroup
          v-if="selectedProduct.length"
          :name="$t('status')"
          :is-colored="true"
          :list="useCommonsInfo.commons.value.productStatuses"
          :value="selectedStatus"
          @data-change="selectedStatus = $event"
        />
        <div v-else class="group-table_header">
          <div class="group-table_header__title">
            <p>{{ $t("status") }}</p>
          </div>
        </div>
      </template>
      <template #body="{ data }">
        <span
          v-if="commons?.productStatuses && commons.productStatuses[data.status_id]"
          :style="{
            color:
              commons?.productStatuses && commons.productStatuses[data.status_id]
                ? colorizeProductStatus(data.status_id).color
                : colorizeProductStatus(1).color,
          }"
        >
          <i class="mdi mdi-circle"></i
        ></span>
        <span v-else>—</span>
      </template></Column
    >
    <Column field="purpose_id">
      <template #header>
        <ListOptionsGroup
          v-if="
            (paymentStatusId !== 3 ||
              useUserInfo.userData.value?.permissions.edit_paid_purchase) &&
            selectedProduct.length
          "
          :clearable="true"
          :name="$t('purpose')"
          :list="useCommonsInfo.commons.value.purposes"
          :value="selectedPurpose"
          @data-change="selectedPurpose = $event"
        />
        <div v-else class="group-table_header">
          <div class="group-table_header__title">
            <p>{{ $t("purpose") }}</p>
          </div>
        </div>
      </template>
      <template #body="{ data }">
        {{
          (commons?.purposes && commons.purposes[data.purpose_id])?.toLowerCase() || "—"
        }}
      </template></Column
    >
    <Column field="warehouse_id">
      <template #header>
        <ListOptionsGroup
          v-if="selectedProduct.length"
          :clearable="true"
          :name="$t('warehouse')"
          :list="useCommonsInfo.commons.value.warehouses"
          :value="selectedWarehouse"
          @data-change="selectedWarehouse = $event"
        />
        <div v-else class="group-table_header">
          <div class="group-table_header__title">
            <p>{{ $t("warehouse") }}</p>
          </div>
        </div>
      </template>

      <template #body="{ data }">
        {{
          (commons?.warehouses && commons.warehouses[data.warehouse_id])?.toLowerCase() ||
          "—"
        }}
      </template></Column
    >
    <Column field="budget_id">
      <template #header>
        <ListOptionsGroup
          v-if="
            (paymentStatusId !== 3 ||
              useUserInfo.userData.value?.permissions.edit_paid_purchase) &&
            selectedProduct.length
          "
          :name="$t('budget')"
          :list="useBudgetExp.allBudgetExp.value"
          :clearable="true"
          :value="selectedBudget"
          @data-change="selectedBudget = $event"
        />
        <div v-else class="group-table_header">
          <div class="group-table_header__title">
            <p>{{ $t("budget") }}</p>
          </div>
        </div>
      </template>
      <template #body="{ data }">
        {{ (commons?.budgets && commons.budgets[data.budget_id])?.toLowerCase() || "—" }}
      </template></Column
    >
    <Column v-if="type !== 'create' && type !== 'create-fav'" field="sn">
      <template #header>
        <div class="group-table_header no-active">
          <div class="group-table_header__title--text">
            <p>{{ $t("serial number short") }}</p>
          </div>
        </div>
      </template>
      <template #body="{ data }">
        <p
          class="group-table_cell overflow"
          v-tooltip="{
            value: `${data.sn}`,
            escape: true,
            class: 'custom-note',
          }"
        >
          {{ data.sn || "—" }}
        </p>
      </template>
    </Column>
    <Column field="note">
      <template #header>
        <NoteGroup
          v-if="
            (paymentStatusId !== 3 ||
              useUserInfo.userData.value?.permissions.edit_paid_purchase) &&
            selectedProduct.length
          "
          :value="selectedNote"
          @data-change="selectedNote = $event"
        />
        <div v-else class="group-table_header no-active">
          <div class="group-table_header__title--text">
            <p>{{ $t("note short") }}</p>
          </div>
        </div>
      </template>
      <template #body="{ data }">
        <Button
          unstyled
          class="note-btn"
          v-if="data.note"
          v-tooltip="{
            value: `${data.note}`,
            escape: true,
            class: 'custom-note',
          }"
        >
          <EyeIcon />
        </Button>
        <span v-else> —</span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import i18n_config from "@/locales/i18n_config";

import ListOptionsGroup from "@/views/purchases/components/cards/purchaseCard/tabs/components/positions/ListOptionsGroup.vue";
import TaskIDGroup from "@/views/purchases/components/cards/purchaseCard/tabs/components/positions/TaskIDGroup.vue";
import NoteGroup from "@/views/purchases/components/cards/purchaseCard/tabs/components/positions/NoteGroup.vue";
import Approvals from "@/views/purchases/components/cards/purchaseCard/tabs/components/positions/Approvals.vue";
import TooltipPurchTable from "@/components/custom/tooltipPurchTable.vue";
import EyeIcon from "../icons/Eye.vue";

import type { IItemGroup, IApproval } from "@/views/purchases/components/dialogs/types";
import useCommonsInfo from "@/store/purchases_store/commons";
import useBudgetExp from "@/store/expenses_store/budget_exp";
import useUserInfo from "@/store/user";
import { getPosition } from "@/api/positions";
import {
  colorizeApproveStatus,
  colorizeProductStatus,
} from "@/helpers/colorize_paying_status";
import usePurchasesInfo from "@/store/purchases_store/purchases";
import type { IPosition } from "../../views/purchases/components/dialogs/types";
import type { IPurposesOffices } from "@/api/offices";

const props = defineProps<{
  data: IItemGroup[];
  commons: { [key: string]: { [key: number]: string } } | null;
  type: string;
  paymentStatusId: number | null;
}>();
const emit = defineEmits<{
  (e: "update:data", value: IItemGroup[]): void;
}>();

const dataPositions = ref(props.data);
const selectedProduct = ref<IItemGroup[]>([]);
const selectedApproval = ref<IApproval | null>(null);
const selectedStatus = ref<number | null>(null);
const selectedPurpose = ref<number | null>(null);
const purposesCommons = ref<IPurposesOffices[]>(
  useCommonsInfo.commons.value.purposes as IPurposesOffices[]
);
const selectedWarehouse = ref<number | null>(null);
const selectedBudget = ref<number | null>(null);
const selectedTaskID = ref<number | null>(null);
const selectedNote = ref<string | null>(null);
const selectedFactDate = ref<string | null>(null);

watch(dataPositions, () => {
  emit("update:data", dataPositions.value);
});

watch(
  () => props.data,
  () => {
    dataPositions.value = props.data;
  }
);

watch(
  () => useCommonsInfo.commons.value.purposes,
  (value) => {
    purposesCommons.value = value as IPurposesOffices[];
  }
);

watch(
  () => selectedApproval.value,
  (value: IApproval | null) => {
    selectedProduct.value.forEach((item: IItemGroup) => {
      item.approval = value;
    });
  },
  { deep: true }
);

watch(
  () => selectedStatus.value,
  (value) => {
    if (value) {
      selectedProduct.value.forEach((item: IItemGroup) => {
        item.status_id = value;
      });
    }
  }
);

watch(
  () => selectedTaskID.value,
  (value) => {
    selectedProduct.value.forEach((item: IItemGroup) => {
      item.task_id = value;
    });
  }
);

watch(
  () => selectedNote.value,
  (value) => {
    selectedProduct.value.forEach((item: IItemGroup) => {
      item.note = value;
    });
  }
);

watch(
  () => selectedPurpose.value,
  (value) => {
    const purpose: IPurposesOffices | null =
      purposesCommons.value.find((el) => el.id === value) || null;

    selectedProduct.value.forEach((item: IItemGroup) => {
      item.purpose_id = value;

      if (purpose && purpose.default_budget) {
        item.budget_id = purpose.default_budget.id;
      }
    });
  }
);

watch(
  () => selectedWarehouse.value,
  (value) => {
    selectedProduct.value.forEach((item: IItemGroup) => {
      item.warehouse_id = value;
    });
  }
);

watch(
  () => selectedBudget.value,
  (value) => {
    selectedProduct.value.forEach((item: IItemGroup) => {
      if (item.purpose_id) {
        const purpose: IPurposesOffices | null =
          purposesCommons.value.find((el) => el.id === item.purpose_id) || null;

        if (!purpose || (purpose && !purpose.default_budget)) item.budget_id = value;
      } else {
        item.budget_id = value;
      }
    });
  }
);

watch(
  () => selectedFactDate.value,
  (value) => {
    selectedProduct.value.forEach((item: IItemGroup) => {
      item.activated_at = value;
    });
  }
);

const selectPosition = async (event: {
  originalEvent: Event;
  data: IItemGroup;
  index: number;
}) => {
  if (props.type === "edit") {
    if (
      (event.originalEvent.target as HTMLInputElement).dataset.pcSection !==
      "checkboxicon"
    )
      if (event.data.id) {
        await getPosition(event.data.id).then((res: IPosition) => {
          usePurchasesInfo.setSelectedPosition({ ...res, is_changed: false });
        });
      }
  }
};
</script>

<style lang="scss">
.group-table {
  &.group-table.p-datatable > .p-datatable-wrapper {
    //overflow: auto !important;
  }
  &_header {
    cursor: pointer;
    &.no-active {
      cursor: auto;
    }
    &__title {
      display: flex;
      align-items: center;
      border-radius: 5px;
      background: #e3e3e3;
      padding: 0 5px;
      height: 23px;
      &--text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 5px;
        & > p {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          white-space: nowrap;
          color: #999;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
        }
      }
      &_icon {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 10px;
      }
      & > p {
        color: #999;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        white-space: nowrap;
      }
    }
    &__menu {
      display: flex;
      border-radius: 10px;
      max-height: 300px;
      border: 1px solid #e3e3e3;
      box-shadow: 0px 0px 22px 7px rgba(129, 131, 136, 0.2),
        0px 0px 22px 7px rgba(129, 131, 136, 0.2) !important;
      // backdrop-filter: blur(2.5px);
      &.menu-list {
        padding: 10px 0;
        overflow: auto;
        & > ul {
          height: 100%;
          width: 100% !important;
        }
      }
      .menu-list {
        &_item {
          display: flex;
          align-items: center;
          cursor: pointer;
          width: 100%;
          height: 42px;
          padding: 7px 16px;
          font-size: 16px;
          font-weight: 400;
        }
      }
    }
  }

  &_cell {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 65px;
    z-index: 0;
    &.overflow {
      overflow: hidden;
      justify-content: flex-start;
    }
    &__label {
      top: -6px;
      right: 12px;
      z-index: 9;
      position: absolute;
      padding: 0px 5px 2px 5px;
      border-radius: 5px;
      color: white;
      font-size: 13px;
      font-weight: 400;
    }
    &__avatar {
      display: flex;
      align-content: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      & > img {
        width: 37px;
        height: 37px;
      }
    }
  }

  &.p-datatable > .p-datatable-wrapper {
    overflow: hidden auto !important;
    & > .p-datatable-table {
      & > .p-datatable-thead {
        background: white !important;
        & > tr {
          & > th {
            background: none !important;
            border: none;
          }
        }
      }
      & .p-datatable-tbody {
        overflow: auto !important;
        max-height: 200px !important;
        & > tr {
          cursor: pointer;
          &.p-highlight > td {
            color: #495057 !important;
          }
        }
      }
    }
  }

  .p-checkbox .p-checkbox-box.p-highlight {
    border-color: #1565c0;
    background: #1565c0;
  }
  .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover {
    border-color: #1565c0;
    background: #1565c0;
  }
  .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus {
    border-color: #1565c0;
  }
  .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover {
    border-color: #1565c0;
  }
}

.overflow {
  &.p-datatable > .p-datatable-wrapper {
    overflow: visible !important;
    max-height: none !important;
  }
}

.p-tooltip {
  z-index: 2000 !important;
}

.custom-note .p-tooltip-text {
  background-color: white;
  color: #666666;
  padding-bottom: 5px;
  padding-top: 1px;
  font-size: 14px;
}

.note-btn {
  background: none;
  outline: none;
  border: none;
  height: 20px;
}
</style>
