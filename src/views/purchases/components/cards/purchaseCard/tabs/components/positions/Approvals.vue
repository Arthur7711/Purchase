<template>
  <div class="group-table_header">
    <div class="group-table_header__title">
      <p @click="toggle">{{ $t("agreement") }}</p>
      <div class="menu-action">
        <div @click="toggle" class="group-table_header__title_icon">
          <img alt="triangle" :src="btnTriangle" class="menu-action_btn" />
        </div>

        <div v-show="menu" class="menu-action_content approvals">
          <div class="approvals-modal">
            <div class="approvals-modal_wrapper">
              <TextLabelIcon
                :value="searchApprovalPurchase"
                :placeholder="$t('search by name')"
                @data-change="searchApprovalPurchase = $event"
              >
                <template #rightIcon>
                  <img :src="searchIcon" alt="search" />
                </template>
              </TextLabelIcon>
              <div class="approvals-modal_wrapper__actions">
                <button
                  v-if="isApproval"
                  class="approvals-modal_wrapper__actions_btn"
                  @click="deleteApprover"
                >
                  {{ $t("Reset") }}
                </button>
                <button
                  v-if="
                    (selectedApprovalPurchase &&
                      useUserInfo.userData.value?.permissions.create_accepted_approve) ||
                    selectedApprovalTask
                  "
                  class="approvals-modal_wrapper__actions_btn"
                  @click="
                    selectedApprovalTask
                      ? assignedTaskApprover()
                      : assignedPurchaseApprover()
                  "
                >
                  {{ $t("assign") }}
                </button>
                <button
                  class="approvals-modal_wrapper__actions_btn"
                  v-if="selectedApprovalPurchase"
                  @click="toggleDialogDescription = true"
                >
                  {{ $t("submit review") }}
                </button>
              </div>
            </div>

            <template v-if="taskID">
              <p class="approvals-modal_title">{{ $t("task approvers") }}</p>
              <div class="approvals-modal_wrapper">
                <p class="approvals-modal_description" v-if="tasksApprovals.length === 0">
                  {{ $t("no t.a.") }}
                </p>
                <ul v-else class="approvals-modal_list">
                  <li
                    v-for="approvalTask in tasksApprovals"
                    :key="approvalTask.id"
                    :class="[
                      'approvals-modal_list__item approval',
                      {
                        selected:
                          selectedApprovalTask &&
                          selectedApprovalTask.id === approvalTask.id,
                      },
                    ]"
                    @click="selectTaskApprover(approvalTask)"
                  >
                    <p
                      class="approval_name"
                      :style="{
                        color: `${
                          colorizeApproveStatus(approvalTask.status.toLowerCase()).color
                        }`,
                      }"
                    >
                      {{ approvalTask.user.displayname }}
                    </p>
                    <p class="approval_occupation">{{ approvalTask.user.title }}</p>
                  </li>
                </ul>
              </div>
            </template>

            <p v-if="searchApprovalPurchase" class="approvals-modal_title">
              {{ $t("search results") }}
            </p>
            <div v-if="purchaseApprovals.length" class="approvals-modal_wrapper">
              <ul class="approvals-modal_list">
                <li
                  v-for="approvalPurchase in purchaseApprovals"
                  :key="approvalPurchase.id"
                  :class="[
                    'approvals-modal_list__item approval',
                    {
                      selected:
                        selectedApprovalPurchase &&
                        selectedApprovalPurchase.id === approvalPurchase.id &&
                        !approvalPurchase.vacation,
                    },
                    {
                      vacation: approvalPurchase.vacation,
                    },
                  ]"
                  @click="selectPurchaseApprover(approvalPurchase)"
                >
                  <p class="approval_name" v-if="approvalPurchase.vacation">
                    <span>{{ approvalPurchase.displayname }}</span>
                    <span>{{
                      approvalPurchase.vacation &&
                      approvalPurchase.vacation.type &&
                      approvalPurchase.vacation.type.name
                    }}</span>
                  </p>
                  <p v-else class="approval_name">
                    {{
                      i18n_config.global.locale === "en"
                        ? approvalPurchase.displayname
                        : approvalPurchase.description
                    }}
                  </p>
                  <p class="approval_occupation">{{ approvalPurchase.title }}</p>
                </li>
              </ul>
            </div>
            <p v-else class="approvals-modal_description">
              {{
                searchApprovalPurchase &&
                (searchApprovalPurchase.length < 2 || !purchaseApprovals.length)
                  ? $t("nothing was found")
                  : ""
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ApprovalsDescriptionDialog
    :title="$t('description approver')"
    :is-open="toggleDialogDescription"
    :positions-ids="selectedIDs"
    :purchase-id="usePurchasesInfo.selectedPurchase.value?.id"
    :approval-id="selectedApprovalPurchase?.id"
    @close="toggleDialogDescription = $event"
    @send="isSendReq = $event"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import i18n_config from "@/locales/i18n_config";

import type { IItemGroup } from "@/views/purchases/components/dialogs/types";
import type { IApproval } from "@/views/purchases/components/dialogs/types";
import type { ISpecialist } from "@/store/purchases_store/commons";
import ApprovalsDescriptionDialog from "./ApprovalsDescriptionDialog.vue";
import {
  getApprovalsTask,
  getApprovalsPurchase,
  deleteApprovals,
  setTaskApprover,
  setPurchaseApprover,
} from "@/api/approvals";
import { colorizeApproveStatus } from "@/helpers/colorize_paying_status";
import usePurchasesInfo from "@/store/purchases_store/purchases";
import useUserInfo from "@/store/user";

import btnTriangle from "@/components/icons/triangleDownGrey.svg";
import searchIcon from "@/components/icons/search.svg";
import TextLabelIcon from "@/components/labels/TextLabelIcon.vue";

const props = defineProps<{
  selectedPositions: IItemGroup[];
  approval: IApproval | null;
}>();
const emit = defineEmits<{
  (e: "dataChange", value: IApproval | null): void;
}>();

const menu = ref<boolean>(false);
const selectedValue = ref<IApproval | null>({} as IApproval);
const searchApprovalPurchase = ref<string | null>(null);
const tasksApprovals = ref<IApproval[]>([]);
const purchaseApprovals = ref<ISpecialist[]>([]);
const selectedApprovalPurchase = ref<ISpecialist | null>(null);
const selectedApprovalTask = ref<IApproval | null>(null);
const toggleDialogDescription = ref(false);
const isSendReq = ref(false);

const selectedIDs = computed(() =>
  props.selectedPositions && props.selectedPositions.length
    ? props.selectedPositions.map((item: IItemGroup) => item.id)
    : []
);

const taskID = computed<number | null>(() => {
  if (props.selectedPositions.length) {
    const tasksIDs = props.selectedPositions.map((item: IItemGroup) => item.task_id);
    const uniqTasksIDs = Array.from(new Set(tasksIDs));

    if (uniqTasksIDs.length === 1) {
      return uniqTasksIDs[0];
    } else return null;
  }

  return null;
});

const isApproval = computed(() =>
  props.selectedPositions.some((item: IItemGroup) => !!item.approval)
);

watch(
  () => taskID.value,
  async (value) => {
    if (value) {
      tasksApprovals.value = await getApprovalsTask(value);
    }
  }
);

watch(
  () => isSendReq.value,
  async (value) => {
    if (
      value &&
      selectedApprovalPurchase.value &&
      usePurchasesInfo.selectedPurchase.value?.id
    ) {
      const approver: IApproval = {
        id: selectedApprovalPurchase.value.id,
        purchase_id: usePurchasesInfo.selectedPurchase.value.id,
        purchase_priority: null,
        status: "pending",
        type: "purchase",
        user_id: selectedApprovalPurchase.value.id,
        user: {
          description: selectedApprovalPurchase.value.description,
          displayname: selectedApprovalPurchase.value.displayname,
          id: selectedApprovalPurchase.value.id,
          samaccountname: selectedApprovalPurchase.value.samaccountname,
        },
      };

      selectedValue.value = approver;
      isSendReq.value = false;
    }
  }
);

watch(
  () => searchApprovalPurchase.value,
  async (value) => {
    if (value && value.length > 1) {
      purchaseApprovals.value = await getApprovalsPurchase(value);
    } else purchaseApprovals.value = [];
  }
);

watch(
  () => selectedValue.value,
  (value) => {
    emit("dataChange", value);
    usePurchasesInfo.setUpdateTable(true);

    setTimeout(() => {
      usePurchasesInfo.setUpdateTable(false);
    });
  }
);

const toggle = (): void => {
  menu.value = !menu.value;

  selectedApprovalPurchase.value = null;
  selectedApprovalTask.value = null;
  searchApprovalPurchase.value = null;
};

const selectPurchaseApprover = (user: ISpecialist) => {
  if (selectedApprovalTask.value) selectedApprovalTask.value = null;
  if (selectedApprovalPurchase.value) {
    if (user.id === selectedApprovalPurchase.value.id)
      selectedApprovalPurchase.value = null;
    else selectedApprovalPurchase.value = user;
  } else selectedApprovalPurchase.value = user;
};
const selectTaskApprover = (user: IApproval) => {
  if (selectedApprovalPurchase.value) selectedApprovalPurchase.value = null;
  if (selectedApprovalTask.value) {
    if (user.id === selectedApprovalTask.value.id) selectedApprovalTask.value = null;
    else selectedApprovalTask.value = user;
  } else selectedApprovalTask.value = user;
};

const deleteApprover = async () => {
  await deleteApprovals(selectedIDs.value);

  selectedValue.value = null;
};

const assignedTaskApprover = async () => {
  if (selectedApprovalTask.value) {
    await setTaskApprover(selectedIDs.value, selectedApprovalTask.value.id);
    selectedValue.value = selectedApprovalTask.value;
  }
};

const assignedPurchaseApprover = async () => {
  if (selectedApprovalPurchase.value && usePurchasesInfo.selectedPurchase.value?.id) {
    await setPurchaseApprover(
      selectedIDs.value,
      selectedApprovalPurchase.value.id,
      usePurchasesInfo.selectedPurchase.value.id
    );
    const approver: IApproval = {
      id: selectedApprovalPurchase.value.id,
      purchase_id: usePurchasesInfo.selectedPurchase.value.id,
      purchase_priority: null,
      status: "accepted",
      type: "purchase",
      user_id: selectedApprovalPurchase.value.id,
      user: {
        description: selectedApprovalPurchase.value.description,
        displayname: selectedApprovalPurchase.value.displayname,
        id: selectedApprovalPurchase.value.id,
        samaccountname: selectedApprovalPurchase.value.samaccountname,
      },
    };

    selectedValue.value = approver;
  }
};

onMounted(() => {
  selectedValue.value = props.approval || ({} as IApproval);
});
</script>

<style lang="scss">
.approvals-modal {
  width: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &_wrapper {
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    &__actions {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      &_btn {
        cursor: pointer;
        padding: 0 4px;
        border: none;
        outline: none;
        border-radius: 5px;
        background: #1565c0;
        color: white;
        font-size: 14px;
        font-weight: 400;
        &:hover {
          background: #2f7acf;
        }
      }
    }
  }
  &_title {
    display: flex;
    width: 100%;
    height: 20px;
    background: rgba(0, 0, 0, 0.05);
    padding: 0 8px;
    color: #1a1a1a;
    font-size: 14px;
    font-weight: 500;
  }
  &_description {
    text-align: center;
    padding: 10px;
    color: #1a1a1a;
    font-size: 14px;
    font-weight: 500;
  }
  &_list {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    overflow: auto;
    max-height: 200px;
    &__item {
      &.approval {
        display: flex;
        justify-content: space-between;
        &.selected {
          background-color: #1565c0;
          .approval_name {
            color: white !important;
          }
          .approval_occupation {
            color: white;
          }
        }
        &.vacation {
          cursor: auto;
          opacity: 0.7;
          &:hover {
            background: none;
            .approval_name {
              color: #343a40 !important;
            }
            .approval_occupation {
              color: #999;
            }
          }
        }
      }
    }
    .approval {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      border-radius: 7px;
      padding: 6px;
      &_name {
        text-align: left;
        font-size: 16px;
        font-weight: 400;
      }
      &_occupation {
        color: #999;
        font-size: 16px;
        font-weight: 400;
      }
      &:hover {
        background-color: #1565c0;
        .approval_name {
          color: white !important;
        }
        .approval_occupation {
          color: white;
        }
      }
    }
  }
}

.menu-action {
  position: relative;
  &_content {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-color: white;
    border: 1px solid #e3e3e3;
    box-shadow: 0px 0px 22px 7px rgba(129, 131, 136, 0.2),
      0px 0px 22px 7px rgba(129, 131, 136, 0.2) !important;

    border-radius: 10px;
    z-index: 10;
    &.approvals {
      right: -130px;
      top: 20px;
    }
  }
  &_btn {
    cursor: pointer;
  }
  .p-float-label input:focus ~ label,
  .p-float-label input.p-filled ~ label,
  .p-float-label textarea:focus ~ label,
  .p-float-label textarea.p-filled ~ label,
  .p-float-label .p-inputwrapper-focus ~ label,
  .p-float-label .p-inputwrapper-filled ~ label {
    top: 10px !important;
  }
}
</style>
