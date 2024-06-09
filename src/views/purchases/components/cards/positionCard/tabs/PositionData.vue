<template>
  <div class="position-data" v-if="data">
    <AccordionPurchase :header="$t('group of items data')">
      <template #content>
        <GroupPositions
          :is-generated-description="false"
          :currency="group.debited_currency"
          :index-group="0"
          :group="data"
          :is-once-group="true"
          :type="'info'"
        />
      </template>
    </AccordionPurchase>
    <AccordionPurchase :header="$t('basic data')">
      <template #content>
        <div class="position-data_wrapper">
          <div class="position-data_info">
            <div class="position-data_wrapper__row">
              <NumberLabelIcon
                :title="$t('task ID')"
                :is-integer="true"
                :value="groupData.task_id"
                @data-change="groupData.task_id = $event"
              />
              <DropdownLabelAvatar
                :no-image="true"
                :label="$t('status')"
                :value="groupData.status_id"
                @data-change="groupData.status_id = $event"
                :list="useCommonsInfo.commons.value.productStatuses"
              />
              <div class="position-data_priority-readonly">
                <span class="position-data_priority-readonly__label">{{
                  $t("priority")
                }}</span>
                <span class="position-data_priority-readonly__text">
                  {{
                    (groupData.approval && groupData.approval.purchase_priority) ||
                    $t("no priority")
                  }}
                </span>
              </div>
            </div>
            <div class="position-data_wrapper__row">
              <div
                v-if="
                  useUserInfo.userData.value?.permissions.control_approve ||
                  useUserInfo.userData.value?.permissions.view_approves
                "
                class="position-data_approval-readonly"
              >
                <div class="position-data_approval-readonly__avatar">
                  <Avatar v-if="!groupData.approval" label="N/A" shape="circle" />
                  <a
                    v-else
                    :href="`${startUrl}/#/staff/user/${groupData.approval.user.samaccountname}`"
                    target="_blank"
                  >
                    <div
                      class="avatar-user"
                      :style="{
                        border: `3px solid ${
                          colorizeApproveStatus(groupData.approval.status.toLowerCase())
                            .color
                        }`,
                      }"
                    >
                      <Avatar
                        class="custom-dropdown_value__avatar-user"
                        :image="
                          'https://avatars.saber3d.net/?user=' +
                          groupData.approval.user.samaccountname
                        "
                        shape="circle"
                      />
                    </div>
                  </a>
                </div>
                <div class="position-data_approval-readonly__info">
                  <p class="position-data_priority-readonly__label">
                    {{ $t("agreement") }}
                  </p>
                  <p class="position-data_priority-readonly__text">
                    <span>{{
                      groupData.approval?.user.description
                        ? i18n_config.global.locale === "ru"
                          ? groupData.approval?.user.description + " "
                          : groupData.approval?.user.displayname + " "
                        : $t("no match")
                    }}</span>
                    <b
                      v-if="groupData.approval"
                      :style="{
                        color: `${
                          colorizeApproveStatus(groupData.approval.status.toLowerCase())
                            .color
                        }`,
                      }"
                    >
                      {{ $t(`${groupData.approval.status.toLocaleLowerCase()}`) }}</b
                    >
                  </p>
                </div>
              </div>
            </div>
            <div class="position-data_wrapper__row two-input">
              <DropdownLabelAvatar
                v-if="useBudgetExp.allBudgetExp.value"
                :no-image="true"
                :label="$t('budget')"
                :isFilter="true"
                :value="groupData.budget_id"
                :readonly="!!(selectedPurpose && selectedPurpose.default_budget)"
                @data-change="groupData.budget_id = $event"
                :list="useBudgetExp.allBudgetExp.value"
              />
              <DropdownLabelAvatar
                :no-image="true"
                :label="$t('warehouse')"
                :value="groupData.warehouse_id"
                @data-change="groupData.warehouse_id = $event"
                :list="useCommonsInfo.commons.value.warehouses"
              />
            </div>
            <div class="position-data_wrapper__row two-input">
              <div class="p-float-label position-data_calendar">
                <Calendar
                  v-model="factDate"
                  @update:modelValue="factDate = $event as Date"
                  dateFormat="dd.mm.yy"
                  showIcon
                  showButtonBar
                  inputId="labelCalendar"
                >
                  <template #dropdownicon>
                    <CalendarIcon />
                  </template>
                </Calendar>
                <label for="labelCalendar">{{ $t("fact") }}</label>
              </div>
              <TextLabelIcon
                :title="$t('serial number')"
                :value="groupData.sn"
                @data-change="groupData.sn = $event"
              />
            </div>
            <div class="position-data_wrapper__row">
              <DropdownLabelAvatar
                :no-image="true"
                :label="$t('purpose')"
                :isFilter="true"
                :value="groupData.purpose_id"
                @data-change="
                  (e) => {
                    if (props.group.purpose_id !== e) {
                      usePurchasesInfo.setChangePurpose(true);
                    }
                    groupData.purpose_id = e;
                  }
                "
                :list="useCommonsInfo.commons.value.purposes"
              />
            </div>
          </div>
          <div class="position-data_note">
            <TeaxtAreaLabel
              :title="$t('note')"
              :value="groupData.note"
              @data-change="groupData.note = $event"
            />
          </div>
        </div>
      </template>
    </AccordionPurchase>
  </div>
  <ChangeFactDialog
    v-if="usePurchasesInfo.selectedPosition.value"
    :is-open="usePurchasesInfo.changePurpose.value"
    @update-fact-date="
      (e) => {
        factDate = e ? new Date(e) : factDate;
      }
    "
    @close="usePurchasesInfo.setChangePurpose($event)"
  />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import i18n_config from "@/locales/i18n_config";

import AccordionPurchase from "@/components/accordion/AccordionPurchase.vue";
import GroupPositions from "@/views/purchases/components/cards/purchaseCard/tabs/components/positions/GroupPositions.vue";
import NumberLabelIcon from "@/components/labels/NumberLabelIcon.vue";
import TextLabelIcon from "@/components/labels/TextLabelIcon.vue";
import DropdownLabelAvatar from "@/components/labels/DropdownLabelAvatar.vue";
import TeaxtAreaLabel from "@/components/labels/TeaxtAreaLabel.vue";
import CalendarIcon from "@/components/icons/CalendarIcon.vue";

import type { IPosition, IGroup } from "../../../dialogs/types";
import type { IPurposesOffices } from "@/api/offices";
import Calendar from "primevue/calendar";
import useCommonsInfo from "@/store/purchases_store/commons";
import useBudgetExp from "@/store/expenses_store/budget_exp";
import { colorizeApproveStatus } from "@/helpers/colorize_paying_status";
import useUserInfo from "@/store/user";
import dateConverter from "@/helpers/dateConverter";
import usePurchasesInfo from "@/store/purchases_store/purchases";
import ChangeFactDialog from "../../../dialogs/ChangeFactDialog.vue";

const props = defineProps<{
  group: IPosition;
}>();

const emit = defineEmits<{
  (e: "dataChanged", value: IPosition): void;
}>();

const data = ref<IGroup | null>(null);
const groupData = ref<IPosition>(props.group);
const purposesCommons = ref<IPurposesOffices[]>(
  useCommonsInfo.commons.value.purposes as IPurposesOffices[]
);
const selectedPurpose = ref<IPurposesOffices | null>(null);

const factDate = ref<Date | null>(null);

const startUrl = import.meta.env.VITE_VUE_START;

watch(
  () => groupData.value,
  (value) => {
    if (JSON.stringify(value) !== JSON.stringify(props.group)) emit("dataChanged", value);
  },
  { deep: true }
);

watch(
  () => factDate.value,
  (value) => {
    groupData.value.activated_at = value && dateConverter(`${value}`);
  }
);

watch(
  () => groupData.value.purpose_id,
  (value) => {
    selectedPurpose.value = purposesCommons.value.find((el) => el.id === value) || null;
  }
);

watch(
  () => selectedPurpose.value,
  (value) => {
    if (value && value.default_budget) {
      groupData.value.budget_id = value.default_budget.id;
    }
  }
);

onMounted(() => {
  groupData.value = props.group;

  factDate.value = groupData.value.activated_at
    ? new Date(groupData.value.activated_at)
    : null;

  selectedPurpose.value =
    purposesCommons.value.find((el) => el.id === props.group.purpose_id) || null;

  data.value = {
    hash: props.group.hash,
    name_id: props.group.name_id,
    type_id: props.group.type_id,
    sub_type_id: props.group.sub_type_id,
    quantity: props.group.quantity,
    unit_id: props.group.unit_id,
    debited_price: props.group.debited_price,
    items: [],
    item_name: props.group.item_name,
  };
});
</script>

<style lang="scss">
.position-data {
  display: flex;
  flex-direction: column;
  gap: 38px;
  margin-bottom: 20px;
  &_info {
    display: flex;
    flex-direction: column;
    gap: 18px;
    width: 50%;
  }
  &_note {
    width: 50%;
  }
  .position-data_calendar.p-float-label input:focus ~ label,
  .position-data_calendar.p-float-label input.p-filled ~ label,
  .position-data_calendar.p-float-label textarea:focus ~ label,
  .position-data_calendar.p-float-label textarea.p-filled ~ label,
  .position-data_calendar.p-float-label .p-inputwrapper-focus ~ label,
  .position-data_calendar.p-float-label .p-inputwrapper-filled ~ label {
    top: 10px !important;
  }
  &_calendar {
    border-radius: 10px;
    border: 1px solid #e3e3e3;
    background: white;
    height: 50px;
    display: flex;
    align-items: center;

    & > .p-calendar {
      margin: 0 !important;
      width: 100%;
      height: 100%;

      & > input {
        border: none;
        padding: 8px 15px;
        border-radius: 10px;
      }
      & > button {
        background: white;
        outline: none;
        border: none;
        border-radius: 10px;
        & > .p-button-label {
          display: none;
        }
        &:hover {
          background: white;
        }
      }
    }
    & > label {
      left: 15px;
      color: #999;
      font-weight: 400;
    }
  }
  &_priority-readonly {
    display: flex;
    flex-direction: column;
    padding: 2px 15px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    border: 1px dashed #e3e3e3;
    & > span {
      white-space: nowrap;
    }
    &__label {
      color: #999;
      font-size: 12px;
      font-weight: 400;
    }
    &__text {
      color: #1a1a1a;
      font-size: 16px;
      font-weight: 400;
    }
  }
  &_approval-readonly {
    display: flex;
    padding: 2px 15px;
    width: 100%;
    gap: 10px;
    height: 50px;
    border-radius: 10px;
    border: 1px dashed #e3e3e3;
    &__avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      & > a {
        height: 42px;
        & > .avatar-user {
          border-radius: 50%;
          height: 42px;
        }
      }
    }
  }
  &_wrapper {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    width: 100%;
    &__row {
      display: flex;
      width: 100%;
      justify-content: space-between;
      gap: 16px;
      & > * {
        width: 100%;
      }
      &.two-input {
        width: 100%;
        & > * {
          width: 50%;
        }
      }
    }
  }
}
</style>
