<template>
  <div class="add-document_content">
    <div class="add-document_content__row">
      <TextLabelIcon
        :title="$t('document number')"
        :value="dataDocument.document_number"
        @data-change="dataDocument.document_number = $event"
      />
      <DropdownLabelAvatar
        :no-image="true"
        :label="$t('document type')"
        :value="dataDocument.document_type"
        :list="useCommonsInfo.commons.value.document_types_purchase"
        @data-change="dataDocument.document_type = $event"
      />
    </div>
    <div class="add-document_content__row">
      <div class="add-document_content__calendar p-float-label">
        <Calendar
          v-model="dataDocument.document_date"
          dateFormat="dd.mm.yy"
          showIcon
          inputId="labelCalendar"
          @update:modelValue="dataDocument.document_date = $event"
        >
          <template #dropdownicon>
            <CalendarIcon />
          </template>
        </Calendar>
        <label for="labelCalendar">{{ $t("document date") }}</label>
      </div>

      <div
        v-if="dataDocument?.document_type === 3"
        :class="[
          'add-document_content__calendar p-float-label',
          {
            invalid: !(
              usePurchasesInfo.selectedPurchase.value?.purchase_date &&
              dateConverter(`${dataDocument.document_date}`) <=
                dateConverter(`${dataDocument.delivery_date}`)
            ),
          },
        ]"
      >
        <Calendar
          v-model="dataDocument.delivery_date"
          dateFormat="dd.mm.yy"
          showIcon
          inputId="labelCalendar"
          :class="[
            {
              'p-invalid': !(
                usePurchasesInfo.selectedPurchase.value?.purchase_date &&
                dateConverter(`${dataDocument.document_date}`) <=
                  dateConverter(`${dataDocument.delivery_date}`)
              ),
            },
          ]"
          @update:modelValue="dataDocument.delivery_date = $event"
        >
          <template #dropdownicon>
            <CalendarIcon />
          </template>
        </Calendar>
        <label for="labelCalendar">{{ $t("delivery date2") }}</label>
        <span
          class="add-payment_content__calendar--error"
          v-if="
            !(
              usePurchasesInfo.selectedPurchase.value?.purchase_date &&
              dateConverter(`${dataDocument.document_date}`) <=
                dateConverter(`${dataDocument.delivery_date}`)
            )
          "
          >{{ $t("before doc") }}</span
        >
      </div>
      <FileLabel
        v-else-if="type !== 'edit'"
        :title="$t('upload file')"
        :value="dataDocument.file"
        :real-name="dataDocument.real_name"
        @data-change="dataDocument.file = $event"
        @file-name="dataDocument.real_name = $event"
      />
      <div v-else class="add-document_content__file">
        <Bill_active
          class="add-document_content__file--icon"
          v-if="dataDocument.document_type === 1"
          :active="true"
        />
        <Contract_active
          class="add-document_content__file--icon"
          v-if="dataDocument.document_type === 2"
          :active="true"
        />
        <Other_doc_active
          class="add-document_content__file--icon"
          v-if="dataDocument.document_type === 6"
          :active="true"
        />
        <div v-if="dataDocument.real_name" class="add-document_content__file--text">
          <a
            :href="
              dataDocument.file_name
                ? `${API_URL}/storage/files/${dataDocument.file_name}/preview`
                : '#'
            "
            target="_blank"
          >
            <p>
              {{ dataDocument.real_name.split(".")[0] }}
            </p>
            <p>{{ "." + dataDocument.real_name.split(".")[1] }}</p>
          </a>
        </div>
      </div>
    </div>

    <FileLabel
      v-if="dataDocument?.document_type === 3 && type !== 'edit'"
      :title="$t('upload file')"
      :value="dataDocument.file"
      :real-name="dataDocument.real_name"
      @data-change="dataDocument.file = $event"
      @file-name="dataDocument.real_name = $event"
    />
    <div
      v-else-if="dataDocument?.document_type === 3 && type === 'edit'"
      class="add-document_content__file"
    >
      <Closed_doc_active class="add-document_content__file--icon" :active="true" />
      <div v-if="dataDocument.real_name" class="add-document_content__file--text">
        <a
          :href="
            dataDocument.file_name
              ? `${API_URL}/storage/files/${dataDocument.file_name}/preview`
              : '#'
          "
          target="_blank"
        >
          <p>
            {{ dataDocument.real_name.split(".")[0] }}
          </p>
          <p>{{ "." + dataDocument.real_name.split(".")[1] }}</p>
        </a>
      </div>
    </div>
    <div
      class="add-document_content__multi-items p-float-label"
      v-if="dataDocument?.document_type === 3"
    >
      <MultiSelect
        class=""
        v-model="selectedGroupsItems"
        :options="groupItems"
        optionLabel="label"
        optionGroupLabel="label"
        optionGroupChildren="items"
        :selected-items-label="`{} ${$t('selected')}`"
        :maxSelectedLabels="3"
        id="ms-groups"
      >
        <template #optiongroup="slotProps">
          <p class="group-name">
            {{ slotProps.option.label }}
          </p>
        </template>
      </MultiSelect>
      <label for="ms-groups">{{ $t("item groups") }}</label>
    </div>
    <div
      v-if="
        dataDocument?.document_type === 3 &&
        type !== 'edit' &&
        usePurchasesInfo.selectedPurchase.value &&
        (usePurchasesInfo.selectedPurchase.value.payment_type_id === 2 ||
          usePurchasesInfo.selectedPurchase.value.payment_type_id === 5 ||
          usePurchasesInfo.selectedPurchase.value.payment_type_id === 6)
      "
      class="add-document_content__row--price"
    >
      <div class="add-document_content__price">
        <NumberLabelIcon
          v-if="dataDocument.price !== undefined"
          :class-name="'price-input'"
          :title="$t('amount')"
          :value="dataDocument.price"
          @data-change="dataDocument.price = $event"
          :border="'none'"
        />
        <div class="price-currency">
          {{ getCurrencySignName(currency) }}
        </div>
      </div>

      <button
        @click="isConvertByRate = !isConvertByRate"
        :class="['add-document_content__price-link', { 'active-link': isConvertByRate }]"
      >
        <i :class="['mdi', `mdi-link`]"></i>
      </button>

      <div class="add-document_content__price">
        <NumberLabelIcon
          v-if="dataDocument.debited_price !== undefined"
          :class-name="'price-input'"
          :title="$t('currency amount')"
          :value="dataDocument.debited_price"
          @data-change="dataDocument.debited_price = $event"
          :border="'none'"
        ></NumberLabelIcon>
        <div class="price-currency">
          {{ getCurrencySignName(debitedCurrency) }}
        </div>
      </div>
    </div>
    <InlineMessage
      v-if="
        (dataDocument.document_type === 3 &&
          usePurchasesInfo.selectedPurchase.value &&
          (usePurchasesInfo.selectedPurchase.value.payment_type_id === 2 ||
            usePurchasesInfo.selectedPurchase.value.payment_type_id === 5 ||
            usePurchasesInfo.selectedPurchase.value.payment_type_id === 6) &&
          showHint &&
          !dataDocument.debited_price &&
          type !== 'edit') ||
        (dataDocument.debited_price &&
          dataDocument.debited_price < remainder &&
          type !== 'edit')
      "
      class="add-document_hint"
      severity="info"
      >{{ $t("purchase amount covered") }} <br />
      ({{ $t("remainder") }}:
      {{
        curFormatter(remainder.toFixed(2)) + " " + getCurrencySignName(debitedCurrency)
      }})</InlineMessage
    >
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

import useCommonsInfo from "@/store/purchases_store/commons";
import { getFileType } from "@/helpers/fileTypes";
import { getCurrencySignName } from "@/helpers/currencySign";
import dateConverter from "@/helpers/dateConverter";
import { curFormatter } from "@/helpers/currencyFormatter";

import DropdownLabelAvatar from "@/components/labels/DropdownLabelAvatar.vue";
import TextLabelIcon from "@/components/labels/TextLabelIcon.vue";
import NumberLabelIcon from "@/components/labels/NumberLabelIcon.vue";
import CalendarIcon from "@/components/icons/CalendarIcon.vue";
import FileLabel from "@/components/labels/FileLabel.vue";
import MultiSelect from "primevue/multiselect";
import Bill_active from "@/components/icons/bill_active.vue";
import Other_doc_active from "@/components/icons/other_doc_active.vue";
import Closed_doc_active from "@/components/icons/closed_doc_active.vue";
import Contract_active from "@/components/icons/contract_active.vue";

import type { ICreateDocumentPurchase } from "@/api/attachments";
import type { IGroup } from "../../../../../dialogs/types";
import type { IItemGroup } from "../../../../../dialogs/types";
import type { IRates } from "@/api/purchaseCommons";
import { getRates } from "@/api/purchaseCommons";
import usePurchasesInfo from "@/store/purchases_store/purchases";

const props = defineProps<{
  document: ICreateDocumentPurchase;
  groups: IGroup[];
  isFirstClosedDoc: boolean;
  debitedCurrency: string;
  currency: string;
  type?: string;
  showHint: boolean;
  remainder: number;
}>();

const dataDocument = ref<ICreateDocumentPurchase>(props.document);
const selectedGroupsItems = ref<{ label: string; value: number }[]>([]);
const rates = ref<IRates>({});
const isConvert = ref(false);
const isConvertByRate = ref(true);
const API_URL = import.meta.env.VITE_VUE_APP_API_URL;

const groupItems = computed({
  get() {
    return props.groups.map((item: IGroup) => {
      return {
        label: item.item_name?.name,
        code: item.item_name?.id,
        items: item.items.map((el: IItemGroup) => {
          return { label: "№" + el.id, value: el.id };
        }),
      };
    });
  },
  set() {},
});

const currRate = computed(() => {
  if (props.currency === props.debitedCurrency) {
    return 1;
  } else {
    return rates.value[props.debitedCurrency] || 1;
  }
});

watch(
  () => dataDocument.value.document_date,
  async (value) => {
    if (value) {
      if (props.type !== "edit")
        rates.value = await getRates({ date: dateConverter(`${value}`) });
    }
  }
);

watch(
  () => dataDocument.value.price,
  async (value) => {
    if (props.type !== "edit") {
      if (isConvertByRate.value) {
        if (!isConvert.value) {
          dataDocument.value.debited_price = value ? value / currRate.value : 0;
          isConvert.value = true;
        } else {
          isConvert.value = false;
        }
      }
    }
  }
);

watch(
  () => dataDocument.value.debited_price,
  async (value) => {
    if (props.type !== "edit") {
      if (isConvertByRate.value) {
        if (!isConvert.value) {
          dataDocument.value.price = value ? value * currRate.value : 0;
          isConvert.value = true;
        } else {
          isConvert.value = false;
        }
      }
    }
  }
);

watch(
  () => selectedGroupsItems.value,
  (value) => {
    if (value) {
      dataDocument.value.item_ids = value.map((item) => {
        if (item.value) return item.value;
      }) as number[];
    }
  },
  { deep: true }
);

watch(
  () => dataDocument.value.file,
  (value) => {
    if (value) {
      dataDocument.value.file_type = getFileType(value.name.split(".")[1]);
    }
  },
  { deep: true }
);

onMounted(async () => {
  if (props.isFirstClosedDoc) {
    groupItems.value.forEach((item) => {
      item.items.forEach((el) => {
        selectedGroupsItems.value.push(el as { label: string; value: number });
      });
    });
  } else if (props.document.item_ids) {
    groupItems.value.forEach((item) => {
      props.document.item_ids.forEach((val) => {
        const itemGroup = item.items.find((el) => val === el.value);

        if (itemGroup)
          selectedGroupsItems.value.push(itemGroup as { label: string; value: number });
      });
    });
  }

  if (props.type !== "edit") rates.value = await getRates();
});
</script>

<style lang="scss">
.add-document {
  &_hint {
    justify-content: flex-start !important;
    background-color: rgba(219, 234, 254, 0.7) !important;
    color: #3b82f6 !important;
  }
  &_content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > * {
        width: 49% !important;
      }
    }
    &__row--price {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    &__price {
      display: flex;
      height: 50px;
      padding: 15px;
      align-items: center;
      gap: 10px;
      border-radius: 10px;
      border: 1px solid #e3e3e3;
      &-link {
        outline: none;
        cursor: pointer;
        border: none;
        background: none;
        font-size: 20px;
        color: #ef3124;
        &.active-link {
          color: #689f38;
        }
      }
      & > .price-input {
        height: 34px;
        font-size: 16px;
        padding: 0;
        border-right: 1px solid #e3e3e3 !important;
      }
      & > .price-currency {
        display: flex;
        width: 34px;
        height: 34px;
        padding: 10px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: #1565c0;
        color: #fff;
        font-size: 16px;
        font-weight: 400;
      }
    }
    &__calendar {
      border-radius: 10px;
      border: 1px solid #e3e3e3;
      background: white;
      height: 50px;
      display: flex;
      align-items: center;
      &.invalid {
        border: 1px solid #e24c4c;
        margin-bottom: 10px;
      }
      &--error {
        color: #e24c4c;
        position: absolute;
        font-size: 12px;
        width: 100%;
        right: 0;
        top: 48px;
      }
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
        & > label {
          left: 15px;
          color: var(--vt-c-bold-gray) !important;
          font-weight: 400;
        }
        &.p-inputwrapper-filled ~ label {
          top: 10px !important;
        }
      }
    }
    &__file {
      display: flex;
      gap: 8px;
      align-items: center;
      height: 50px;
      padding: 15px;
      border-radius: 10px;
      background-color: #f4f4f4;
      &--icon {
        height: 20px;
        & > svg {
          height: 12px;
          & > path {
            fill: #999999;
          }
        }
      }
      &--text {
        display: flex;
        width: 80%;
        justify-content: space-between;
        align-items: center;
        & > a {
          display: flex;
          align-items: center;
          color: #1565c0;
          width: 100%;
          & > p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:last-child {
              width: 50px;
            }
          }
        }
      }
      & > i {
        cursor: pointer;
      }
    }
    &__multi-items {
      border-radius: 10px;
      border: 1px solid #e3e3e3;
      background: white;
      height: 50px;
      display: flex;
      align-items: center;
      .group-name {
        max-width: 200px;
        word-wrap: break-word;
      }
      & > .p-multiselect {
        border: none;
        margin: 0 !important;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        & > .p-multiselect-label-container > .p-multiselect-label {
          border: none;
          padding: 11px 15px;
          border-radius: 10px;
        }

        & > label {
          left: 15px;
          color: var(--vt-c-bold-gray) !important;
          font-weight: 400;
        }
        &.p-inputwrapper-filled ~ label {
          top: 10px !important;
        }
        &.p-inputwrapper-focus ~ label {
          top: 10px !important;
        }
        &.p-overlay-open ~ label {
          top: 10px !important;
        }
      }
    }
  }
}
.p-multiselect-panel {
  z-index: 1002 !important;
  max-width: 450px !important;
}
</style>
