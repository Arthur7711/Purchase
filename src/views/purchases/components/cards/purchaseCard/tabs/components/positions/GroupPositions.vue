<template>
  <div
    v-if="dataGroup"
    :class="[
      { 'group-positions': type !== 'info' },
      { 'group-positions--info': type === 'info' },
    ]"
  >
    <div v-if="type !== 'info'" class="group-positions_header">
      <h3 class="group-positions_header__title">{{ $t("group") }} {{ indexGroup }}</h3>
      <div
        v-if="type === 'create' || type === 'create-fav'"
        class="group-positions_header__actions"
      >
        <button class="actions-btn" @click="copyGroup">{{ $t("duplicate") }}</button>
        <button class="actions-btn" :disabled="isOnceGroup" @click="deleteGroup">
          {{ $t("delete") }}
        </button>
      </div>
      <template v-else>
        <div class="menu-action">
          <img @click="toggle" alt="triangle" :src="btnElepsis" class="menu-action_btn" />
          <div v-show="menu" class="menu-action_content">
            <div class="group-positions_header__menu">
              <button class="actions-btn" @click="copyGroup">
                {{ $t("duplicate") }}
              </button>
              <button class="actions-btn" :disabled="isOnceGroup" @click="deleteGroup">
                {{ $t("delete") }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="group-positions_wrapper">
      <NamingInput
        :item-name-id="dataGroup.name_id"
        :type-id="dataGroup.type_id"
        :subtype-id="dataGroup.sub_type_id"
        :readonly="type === 'info'"
        @data-change="dataGroup.name_id = $event"
        @add-new-name="addNewNaming($event)"
        @select-name="selectedNaming = $event"
      />

      <div
        class="general-input group-positions_wrapper__item types"
        :style="{
          border: type !== 'info' ? '1px solid #e3e3e3' : '1px dashed #e3e3e3',
        }"
        v-tooltip="{
          value: `${$t('type')}: ${typeName ? typeName.name : $t('no')} \n ${$t(
            'subtype'
          )}: ${subTypeName ? subTypeName.name : $t('no')}`,
          escape: true,
          class: 'custom-note',
        }"
      >
        <DropdownLabelAvatar
          :no-image="true"
          :label="$t('type')"
          :value="dataGroup.type_id"
          @data-change="dataGroup.type_id = $event"
          :readonly="
            type === 'info' ||
            (paymentStatusId === 3 &&
              !useUserInfo.userData.value?.permissions.edit_paid_purchase)
          "
          :list="useCommonsInfo.commons.value.types"
          :top-focused="['11%', '-17%']"
          :class-name="'general-input_item types'"
          :clearable="false"
        />
        <DropdownLabelAvatar
          :no-image="true"
          :label="$t('subtype')"
          :value="dataGroup.sub_type_id"
          @data-change="dataGroup.sub_type_id = $event"
          :readonly="type === 'info'"
          :list="subtypes"
          :top-focused="['11%', '-17%']"
          :class-name="'general-input_item subtypes'"
          :clearable="false"
        />
      </div>
    </div>
    <div class="group-positions_wrapper">
      <div
        class="general-input group-positions_wrapper__item"
        :style="{
          border: type !== 'info' ? '1px solid #e3e3e3' : '1px dashed #e3e3e3',
        }"
      >
        <NumberLabelIcon
          :class-name="`general-input_item quantity`"
          :title="$t('quantity')"
          :is-integer="!!unit && unit.is_integer"
          :value="dataGroup.quantity"
          :readonly="type === 'info'"
          @data-change="dataGroup.quantity = $event"
          :border="'none'"
        />
        <DropdownLabelAvatar
          :no-image="true"
          :label="$t('unit')"
          :option-label="'shortname'"
          :value="dataGroup.unit_id"
          :readonly="type === 'info'"
          @data-change="dataGroup.unit_id = $event"
          :list="useCommonsInfo.commons.value.measureUnits"
          :class-name="`general-input_item units`"
          :top-focused="['11%', '-17%']"
          :clearable="false"
        />
        <NumberLabelIcon
          :class-name="`general-input_item price`"
          :title="$t('unit price')"
          :value="dataGroup.debited_price"
          :readonly="type === 'info'"
          @data-change="
            (e) =>
              type !== 'info'
                ? dataGroup && (dataGroup.debited_price = e)
                : dataGroup && dataGroup.debited_price
          "
          :border="'none'"
          ><template #rightIcon>
            <span>{{ localCurrency }}</span>
          </template></NumberLabelIcon
        >
      </div>
      <NumberLabelIcon
        :class-name="'group-positions_wrapper__item general-price'"
        :title="$t('total price')"
        :value="actualPrice"
        :readonly="type === 'info'"
        @data-change="actualPrice = $event"
        ><template #rightIcon>
          <span>{{ localCurrency }}</span>
        </template></NumberLabelIcon
      >
    </div>
    <div v-if="type !== 'info'" class="group-positions_info">
      <AccordionPurchase :close="true" class="group-positions_info__accordion">
        <template #header>
          <div
            :class="[
              { 'group-positions_counter-position': isOpenCounter },
              { 'group-positions_counter-position--close': !isOpenCounter },
            ]"
          >
            <div class="general-input group-positions_counter-position__input">
              <NumberLabelIcon
                :is-integer="true"
                :class-name="'general-input_item'"
                :title="$t('pos in group')"
                :value="countPositions"
                :border="'none'"
                @data-change="setCountPositions($event)"
              />
              <div class="general-input_item counter-actions">
                <SquarePlus
                  class="group-positions_counter-position__btn"
                  @click="addPosition"
                />
                <SquareMinus
                  :class="[
                    'group-positions_counter-position__btn',
                    { disabled: dataGroup && dataGroup.items.length === 1 },
                  ]"
                  :disabled="dataGroup && dataGroup.items.length === 1"
                  @click="deletePosition(1)"
                />
              </div>
            </div>
          </div>
          <p class="title-text">
            {{ $t("items") }}:
            <span @click="isOpenCounter = !isOpenCounter">{{
              dataGroup.items.length
            }}</span>
          </p>
        </template>
        <template #content>
          <GroupPositionsTable
            :data="dataGroup.items"
            :commons="commons"
            :type="type"
            :payment-status-id="paymentStatusId"
            @update:data="dataGroup.items = $event"
          />
        </template>
      </AccordionPurchase>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

import DropdownLabelAvatar from "@/components/labels/DropdownLabelAvatar.vue";
import NumberLabelIcon from "@/components/labels/NumberLabelIcon.vue";
import AccordionPurchase from "@/components/accordion/AccordionPurchase.vue";
import GroupPositionsTable from "@/components/simpleTable/GroupPositionsTable.vue";
import SquareMinus from "@/components/icons/SquareMinus.vue";
import SquarePlus from "@/components/icons/SquarePlus.vue";
import btnElepsis from "@/components/icons/elepsis-vertical.svg";
import NamingInput from "@/views/purchases/components/cards/purchaseCard/tabs/components/positions/NamingInput.vue";

import { getCurrencySignName } from "@/helpers/currencySign";
import { getItemNames } from "@/api/purchaseCommons";
import { createItemName } from "@/api/purchases";
import useSuccess from "@/store/successInfo";

import type { PropGroupPositions } from "./types";
import type { IGroup, IItemGroup } from "@/views/purchases/components/dialogs/types";
import useCommonsInfo from "@/store/purchases_store/commons";
import type {
  ICommonDefault,
  IType,
  IMeasureUnit,
} from "@/store/purchases_store/commons";
import useUserInfo from "@/store/user";
import i18n_config from "@/locales/i18n_config";

const props = withDefaults(defineProps<PropGroupPositions>(), {
  group: null,
  isOnceGroup: true,
  commons: null,
  type: "create",
  currency: "RUB",
  indexGroup: 1,
  isGeneratedDescription: true,
  taskId: null,
  paymentStatusId: null,
  description: null,
});
const emit = defineEmits<{
  (e: "copy", value: { info: IGroup; ind: number }): void;
  (e: "delete", value: number): void;
  (e: "update:group", value: IGroup | null): void;
  (e: "update:description", value: string | null): void;
  (e: "completed", value: boolean): void;
}>();

const { locale, messages } = i18n_config.global;
const menu = ref(false);
const dataGroup = ref<IGroup | null>(props.group);
const isOpenCounter = ref<boolean>(false);
const isCompleted = ref(false);
const selectedNaming = ref<
  number | string | null | undefined | { id: number; name?: string; description?: string }
>(null);
const defaultPosition = ref<IItemGroup>({
  id: 1,
  approval: null,
  status_id: 1,
  purpose_id: null,
  budget_id: null,
  task_id: props.taskId !== null ? +props.taskId : null,
  warehouse_id: null,
  activated_at: null,
  note: null,
});

const typeName = computed<{ id: number; name: string } | null | undefined>(():
  | { id: number; name: string }
  | null
  | undefined => {
  const types = useCommonsInfo.commons.value.types as ICommonDefault[];

  return (
    dataGroup.value &&
    types.find((item) => dataGroup.value && item.id === dataGroup.value.type_id)
  );
});
const subTypeName = computed(() =>
  subtypes.value.find(
    (item) => dataGroup.value && item.id === dataGroup.value.sub_type_id
  )
);

const countPositions = computed<number>(
  () => (dataGroup.value && dataGroup.value.items.length) || 1
);

const actualPrice = computed<number>({
  get() {
    if (dataGroup.value) {
      const quantity: number = dataGroup.value.quantity ? dataGroup.value.quantity : 0;
      const price: number = dataGroup.value.debited_price
        ? dataGroup.value.debited_price
        : 0;

      return quantity * price * countPositions.value;
    } else return 0;
  },
  set(value) {
    if (dataGroup.value) {
      if (props.type !== "info") {
        dataGroup.value.debited_price = dataGroup.value.quantity
          ? value / (dataGroup.value.quantity * countPositions.value)
          : 0;
      }
    }
  },
});

const subtypes = computed<ICommonDefault[]>((): ICommonDefault[] => {
  if (dataGroup.value && dataGroup.value.type_id) {
    const types = useCommonsInfo.commons.value.types as IType[];
    const arr: IType | undefined = types.find(
      (item: IType): IType | boolean | null =>
        dataGroup.value && item.id === dataGroup.value.type_id
    );
    return arr ? arr.subtypes : [];
  } else return [];
});

const unit = computed(() => {
  const unit = useCommonsInfo.commons.value.measureUnits as IMeasureUnit[];
  return (
    dataGroup.value?.unit_id &&
    unit.find((item: IMeasureUnit) => item.id === dataGroup.value?.unit_id)
  );
});
const localCurrency = computed((): string | undefined =>
  props.currency ? getCurrencySignName(props.currency) : "RUB"
);

watch(
  () => isCompleted.value,
  (value) => {
    emit("completed", value);
  }
);

watch(
  () => dataGroup.value,
  (value) => {
    if (value) {
      isCompleted.value =
        !!value.name_id &&
        !!value.type_id &&
        !!((subtypes.value.length && value.sub_type_id) || subtypes.value.length === 0) &&
        !!value.unit_id &&
        value.debited_price !== null &&
        value.quantity !== null;
    }

    emit("update:group", dataGroup.value);
  },
  { deep: true }
);

watch(
  () => props.group,
  () => {
    dataGroup.value = props.group;
  }
);
watch(
  () => dataGroup.value?.type_id,
  () => {
    if (
      dataGroup.value &&
      props.type !== "info" &&
      subtypes.value.find(
        (item) => dataGroup.value && item.id !== dataGroup.value.sub_type_id
      )
    )
      dataGroup.value.sub_type_id = null;
  }
);

watch(
  () => countPositions.value,
  (value) => {
    if (dataGroup.value) {
      const desc = `${value || 1} X ${
        (selectedNaming.value &&
          typeof selectedNaming.value === "object" &&
          selectedNaming.value.name) ||
        ""
      }`;
      emit("update:description", desc);
    }
  }
);

watch(
  () => selectedNaming.value,
  (value) => {
    if (dataGroup.value) {
      const desc = `${countPositions.value || 1} X ${
        (value && typeof value === "object" && value.name) || ""
      }`;
      emit("update:description", desc);
    }
  },
  { deep: true }
);

const addNewNaming = (
  name:
    | string
    | number
    | { id: number; name?: string; description?: string }
    | null
    | undefined
) => {
  if (typeof name === "string" || typeof name === "number") {
    createItemName(`${name}`).then((res) => {
      useSuccess.setSuccessText(messages[locale]["new name added"]);
      getItemNames().then((result) => {
        useCommonsInfo.setCommons({ name: "itemNames", value: result });
        if (dataGroup.value) dataGroup.value.name_id = res.id;
      });
    });
  }
};

const copyGroup = (): void => {
  const objCopy: IGroup = JSON.parse(JSON.stringify(dataGroup.value));
  if (objCopy?.items)
    objCopy.items.forEach((item: IItemGroup) => {
      item.approval = null;
      delete item.id;
    });

  delete objCopy.hash;

  const group = {
    info: { ...objCopy },
    ind: props.indexGroup,
  };
  emit("copy", group);

  if (props.type === "edit") toggle();
};

const deleteGroup = (): void => {
  if (dataGroup.value) {
    emit("delete", props.indexGroup - 1);
  }

  if (props.type === "edit") toggle();
};

const setCountPositions = (count: number): void => {
  if (dataGroup.value) {
    const lastElement = dataGroup.value.items[dataGroup.value.items.length - 1];

    if (count === 0) {
      dataGroup.value.items = [{ ...defaultPosition.value }];
    } else {
      const diff = count - countPositions.value;
      if (diff < 0) {
        deletePosition(diff);
      } else if (diff > 0) {
        const arr = Array(diff)
          .fill(lastElement)
          .map((item, index) => {
            return {
              ...item,
              id: dataGroup.value ? dataGroup.value.items.length + index : index + 1,
              is_new: true,
            };
          });
        dataGroup.value.items = [...dataGroup.value.items, ...arr];
      }
    }
  }
};

const addPosition = () => {
  if (dataGroup.value) {
    const lastElement = JSON.parse(
      JSON.stringify(dataGroup.value.items[dataGroup.value.items.length - 1])
    );

    delete lastElement.id;

    dataGroup.value.items.push({
      ...lastElement,
      approval: null,
      id: dataGroup.value.items.length,
      is_new: true,
    });
  }
};

const deletePosition = (count: number) => {
  if (dataGroup.value) {
    if (count === 1) {
      if (dataGroup.value.items.length > 1) dataGroup.value.items.pop();
    } else {
      const arr = dataGroup.value.items.slice(0, count);

      dataGroup.value.items = arr;
    }
  }
};
const toggle = () => {
  menu.value = !menu.value;
};

onMounted(() => {
  dataGroup.value = props.group;

  if (dataGroup.value)
    isCompleted.value = props.type === "edit" || props.type === "create-fav";

  if (dataGroup.value && props.type === "edit") {
    const desc = `${countPositions.value || 1} X ${
      (dataGroup.value.item_name && dataGroup.value.item_name.name) || ""
    }`;

    emit("update:description", desc);
  }
});
</script>

<style lang="scss">
.naming {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #abd3ff4d;
  & > p {
    width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &_btn-adding {
    width: 48%;
    cursor: pointer;
    border: none;
    outline: none;
    padding: 5px 14px;
    border-radius: 10px;
    color: #1565c0;
    background: none;
    border: 1px solid #1565c0;
    font-weight: 600;
    font-size: 16px;
    &:enabled:hover {
      color: #256ec2;
      border: 1px solid #256ec2;
    }
    &:disabled {
      cursor: auto;
      color: #b6b6b6;
    }
  }
}
.group-positions {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px 18px 20px 18px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 0px 22px 7px #efefef;
  &--info {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    & > .menu-action > .menu-action_content {
      right: -7px;
      min-width: 150px;
    }
    &__title {
      color: black;
      font-size: 16px;
      font-weight: 600;
    }
    &__actions {
      display: flex;
      gap: 16px;
      .actions-btn {
        cursor: pointer;
        outline: none;
        border: none;
        color: #1565c0;
        background: none;
        font-size: 16px;
        font-weight: 400;
        &:disabled {
          cursor: auto;
          color: #666;
        }
      }
    }
    &__menu {
      width: 100%;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      padding: 10px;
      .actions-btn {
        cursor: pointer;
        outline: none;
        border: none;
        color: #1565c0;
        background: none;
        font-size: 16px;
        font-weight: 400;
        &:disabled {
          cursor: auto;
          color: #666;
        }
      }
    }
  }
  &_wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 6px;
    & > * {
      width: 50%;
    }
    & > .general-input {
      &
        > .custom-dropdown
        > .custom-dropdown_value
        > .custom-dropdown_value__selection
        > .p-dropdown
        > input {
        font-size: 12px;
      }
      & > .text-label-icon > .p-float-label > .p-inputnumber > input {
        font-size: 12px;
      }
    }
    & > .text-label-icon > .p-float-label > .p-inputnumber > input {
      font-size: 12px;
    }
    & > .add-relate_content > .text-label-icon > .p-float-label > input {
      font-size: 12px;
    }
    &__item {
      font-size: 16px;
      height: 50px;
      &.namings {
        flex-basis: 20%;
      }
      &.types {
        flex-basis: 60%;
      }
      &.general-price {
        width: 60%;
      }
    }
  }
  &_info {
    .title {
      &-text {
        cursor: auto;
        font-size: 16px;
        font-weight: 400;
        color: var(--mono-dark-grey, #666);
        & > span {
          cursor: pointer;
          color: var(--color-blue, #1565c0);
          text-decoration-line: underline;
        }
      }
    }
    &__accordion {
      & > .p-panel-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        & > .p-panel-icons > button {
          display: flex;
          align-items: center;
          & > div > svg > g > path {
            fill: #666666;
          }
        }
      }
    }
  }
  &_counter-position {
    display: block;
    position: absolute;
    top: 90px;
    padding: 20px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 0px 22px 7px rgba(129, 131, 136, 0.2),
      0px 0px 22px 7px rgba(129, 131, 136, 0.2);
    // backdrop-filter: blur(2.5px);
    &--close {
      display: none;
    }
    &__input {
      display: flex;
      padding: 8px 15px;
      box-sizing: border-box;
      border: 1px solid #e3e3e3;
      & > .general-input_item > .p-float-label > .p-inputnumber > input {
        width: 120px !important;
      }
    }
    &__btn {
      cursor: pointer;
      width: 34px;
      height: 34px;
      &.disabled {
        cursor: auto;
      }
    }
  }
}
.general-input {
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 10px;
  gap: 0px;
  &_item {
    position: relative;
    border-radius: 0;
    padding: 0;
    border: none !important;
    &.types {
      width: 80%;
    }
    &.counter-actions {
      display: flex;
      align-items: center;
      padding-left: 10px;
      gap: 10px;
    }
    &.price {
      width: auto;
      border-left: 1px solid var(--mono-divider, #e3e3e3) !important;
      border-radius: 0 !important;
      padding: 0 10px;
    }
    &.quantity {
      width: auto;
      padding: 0 0 0 10px;
    }
    &.units {
      width: auto;
    }
  }
  & > * {
    box-sizing: border-box;
    height: 34px;
    border-left: 1px solid var(--mono-divider, #e3e3e3) !important;
    padding: 0;
    &:first-child {
      border-left: none !important;
    }
  }
}
</style>
