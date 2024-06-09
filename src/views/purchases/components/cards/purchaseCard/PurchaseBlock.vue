<template>
  <div v-if="dataPurch" class="purchase-data">
    <AccordionPurchase :header="$t('procurement data')">
      <template #content>
        <div class="purchase-data_wrapper">
          <div
            v-if="type === 'create' || type === 'create-fav'"
            class="purchase-data_wrapper__row"
          >
            <DropdownLabelAvatar
              :no-image="true"
              :label="$t('office')"
              :value="officeID"
              @data-change="officeID = $event"
              :list="offices"
              :class-name="'purchase-data_wrapper__row_item'"
            />
            <DropdownLabelAvatar
              :no-image="true"
              :label="$t('section')"
              :option-label="'department'"
              :prop="'department'"
              :value="departmentID"
              @data-change="departmentID = $event"
              :list="departments"
              :class-name="'purchase-data_wrapper__row_item'"
            />
          </div>
          <DropdownLabelAvatar
            :no-image="true"
            :readonly="
              dataPurch.payment_status_id === 3 &&
              !useUserInfo.userData.value?.permissions.edit_paid_purchase
            "
            :label="$t('legal entity')"
            :value="dataPurch.legal_id"
            @data-change="dataPurch.legal_id = $event"
            :list="useCommonsInfo.commons.value.legalEntities"
          />
          <DropdownLabelAvatar
            :readonly="
              dataPurch.payment_status_id === 3 &&
              !useUserInfo.userData.value?.permissions.edit_paid_purchase
            "
            :label="$t('purchaser')"
            :option-label="'description'"
            :prop="'description'"
            :value="dataPurch.specialist_id"
            @data-change="dataPurch.specialist_id = $event"
            :list="useCommonsInfo.commons.value.specialists"
          />
        </div>
      </template>
    </AccordionPurchase>
    <AccordionPurchase>
      <template #header>
        <div class="description-purchase">
          <p class="description-purchase_title">{{ $t("description") }}</p>
          <button class="description-purchase_btn">
            <i
              :class="[
                { 'mdi mdi-lock': !isEditable },
                { 'mdi mdi-lock-open': isEditable },
              ]"
              @click="turnOffGenerated"
            ></i>
          </button>
        </div>
      </template>
      <template #content>
        <TeaxtAreaLabel
          :class-name="'input-purchase'"
          :title="$t('description')"
          :value="dataPurch.description"
          :readonly="!isEditable"
          :clearable="isEditable"
          @data-change="dataPurch.description = $event"
        />
      </template>
    </AccordionPurchase>
    <AccordionPurchase :header="$t('supply')">
      <template #content>
        <div class="purchase-data_wrapper">
          <div class="purchase-data_wrapper__row supliers">
            <DropdownLabelAvatar
              :no-image="true"
              :label="$t('suppliers')"
              :isFilter="true"
              :readonly="
                dataPurch.payment_status_id === 3 &&
                !useUserInfo.userData.value?.permissions.edit_paid_purchase
              "
              :value="dataPurch.contragent_id"
              @data-change="dataPurch.contragent_id = $event"
              :list="useCommonsInfo.commons.value.contragents"
              :class-name="'list-purchase'"
            />

            <button
              class="supliers_add-btn"
              :disabled="
                dataPurch.payment_status_id === 3 &&
                !useUserInfo.userData.value?.permissions.edit_paid_purchase
              "
            >
              <PlusBtn />
            </button>
          </div>
          <div class="purchase-data_wrapper__row general-input">
            <div class="general-input_item p-float-label">
              <Calendar
                v-model="purchaseData"
                @update:modelValue="(e:string | string[] | Date | Date[] | undefined) => {
                  purchaseData = e as Date
                }"
                :numberOfMonths="2"
                dateFormat="dd.mm.yy"
                showIcon
                inputId="labelCalendar"
                class="general-input_item__calendar"
              >
                <template #dropdownicon>
                  <CalendarIcon />
                </template>
                <template #date="slotProps">
                  <p
                    v-if="
                      comingDate &&
                      slotProps.date.day === new Date(comingDate).getDate() &&
                      slotProps.date.month === new Date(comingDate).getMonth() &&
                      slotProps.date.year === new Date(comingDate).getFullYear()
                    "
                    :style="{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#4338ca',
                      border: '1px solid #4338ca',
                      borderRadius: '50%',
                      padding: '5px',
                      height: '32px',
                      width: '32px',
                    }"
                  >
                    {{ slotProps.date.day }}
                  </p>
                  <template v-else>{{ slotProps.date.day }}</template>
                </template>
                <label for="labelCalendar">{{ $t("order date") }}</label>
              </Calendar>
            </div>
            <div class="general-input_item p-float-label">
              <Calendar
                v-model="comingDate"
                @update:modelValue="(e:string | string[] | Date | Date[] | undefined) => {
                  comingDate = e as Date;
                }"
                :numberOfMonths="2"
                dateFormat="dd.mm.yy"
                showIcon
                inputId="labelCalendar"
                class="general-input_item__calendar"
              >
                <template #dropdownicon>
                  <CalendarIcon />
                </template>
                <template #date="slotProps">
                  <p
                    v-if="
                      purchaseData &&
                      slotProps.date.day === new Date(purchaseData).getDate() &&
                      slotProps.date.month === new Date(purchaseData).getMonth() &&
                      slotProps.date.year === new Date(purchaseData).getFullYear()
                    "
                    :style="{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#4338ca',
                      border: '1px solid #4338ca',
                      borderRadius: '50%',
                      padding: '5px',
                      height: '32px',
                      width: '32px',
                    }"
                  >
                    {{ slotProps.date.day }}
                  </p>
                  <template v-else>{{ slotProps.date.day }}</template>
                </template></Calendar
              >
              <label for="labelCalendar">{{ $t("delivery date") }}</label>
            </div>
          </div>
        </div>
      </template>
    </AccordionPurchase>
    <AccordionPurchase :header="$t('payment')">
      <template #content>
        <div class="purchase-data_wrapper">
          <div
            :class="[
              'purchase-data_wrapper__row general-input',
              {
                'general-input--readonly':
                  dataPurch.payment_status_id === 3 &&
                  !useUserInfo.userData.value?.permissions.edit_paid_purchase,
              },
            ]"
          >
            <DropdownLabelAvatar
              :readonly="
                dataPurch.payment_status_id === 3 &&
                !useUserInfo.userData.value?.permissions.edit_paid_purchase
              "
              :class-name="'general-input_item payments-list'"
              :no-image="true"
              :label="$t('payment type')"
              :value="dataPurch.payment_type_id"
              @data-change="dataPurch.payment_type_id = $event"
              :list="payments"
            />
            <div class="general-input_item payments-currency">
              <div
                v-if="!isPaymentInCurrencies || dataPurch.payment_type_id === 8"
                :class="[
                  'payments-currency_item',
                  {
                    'payments-currency_item--active':
                      selectedCurrency === getNameBySign(localCurrency),
                  },
                  {
                    'payments-currency_item--readonly':
                      dataPurch.payment_status_id === 3 &&
                      !useUserInfo.userData.value?.permissions.edit_paid_purchase,
                  },
                ]"
              >
                {{ localCurrency }}
              </div>
              <template v-else-if="selectedPaymentType">
                <template v-for="currency in currencies" :key="currency">
                  <div
                    :class="[
                      'payments-currency_item',
                      {
                        'payments-currency_item--active': selectedCurrency === currency,
                      },
                      {
                        'payments-currency_item--readonly':
                          dataPurch.payment_status_id === 3 &&
                          !useUserInfo.userData.value?.permissions.edit_paid_purchase,
                      },
                    ]"
                    @click="selectedCurrency = currency"
                  >
                    {{ getCurrencySignName(currency) }}
                  </div>
                </template>
              </template>
            </div>
          </div>
          <div class="purchase-data_wrapper__row">
            <NumberLabelIcon
              :class-name="'purchase-data_wrapper__row_item'"
              :title="isPaymentInCurrencies ? $t('purchase price') : $t('price')"
              :value="price"
              :readonly="isPaymentInCurrencies || dataPurch.groups.length > 1"
              @data-change="price = $event"
              ><template #rightIcon>
                <span>{{ localCurrency }}</span>
              </template></NumberLabelIcon
            >
            <DropdownLabelAvatar
              :no-image="true"
              :label="$t('payment status')"
              :value="dataPurch.payment_status_id"
              @data-change="dataPurch.payment_status_id = $event"
              :readonly="
                dataPurch.payment_status_id === 3 &&
                !useUserInfo.userData.value?.permissions.edit_paid_purchase
              "
              :list="useCommonsInfo.commons.value.paymentStatuses"
              :custom-color="
                !!(type === 'edit') &&
                !!dataPurch.payment_status_id &&
                setPaymentStatusColor(dataPurch.payment_status_id)
              "
              :class-name="'purchase-data_wrapper__row_item'"
            />
          </div>
          <div
            v-if="isPaymentInCurrencies || dataPurch.payment_type_id === 8"
            class="purchase-data_wrapper__row"
          >
            <NumberLabelIcon
              :class-name="
                dataPurch.payment_type_id === 8 ? 'purchase-data_wrapper__row_item' : ''
              "
              :title="$t('currency price')"
              :value="priceCurrency"
              :readonly="dataPurch.groups.length > 1"
              @data-change="priceCurrency = $event"
            >
              <template #rightIcon>
                <span>{{ getCurrencySignName(selectedCurrency) }}</span>
              </template></NumberLabelIcon
            >

            <DropdownLabelAvatar
              v-if="dataPurch.payment_type_id === 8"
              :class-name="
                dataPurch.payment_type_id === 8 ? 'purchase-data_wrapper__row_item' : ''
              "
              :no-image="true"
              :label="$t('currency account')"
              :value="dataPurch.account_id"
              @data-change="dataPurch.account_id = $event"
              :list="safes"
            />
          </div>

          <DropdownLabelAvatar
            v-if="cardHolders.length"
            :readonly="
              dataPurch.payment_status_id === 3 &&
              !useUserInfo.userData.value?.permissions.edit_paid_purchase
            "
            :image-name="'bank_id'"
            :label="$t('cardholder')"
            :value="dataPurch.card_holder_id"
            @data-change="dataPurch.card_holder_id = $event"
            :list="cardHolders"
          />
        </div>
      </template>
    </AccordionPurchase>
    <AccordionPurchase :header="$t('note')">
      <template #content
        ><TextLabelIcon
          :class-name="'input-purchase'"
          :title="$t('note')"
          :value="dataPurch.note"
          @data-change="dataPurch.note = $event || null"
      /></template>
    </AccordionPurchase>
    <div
      purchase-data_wrapper
      :style="ScreenParams.screenParams.width < 650 ? { minHeight: '20vh' } : ''"
    >
      <button
        :disabled="type !== 'edit' || dataPurch?.info?.product_status_id === 8"
        @click="toggle"
        class="purchase-data_change-btn"
        v-tooltip="
          type !== 'edit' && {
            value: $t('save required'),
            escape: true,
            class: 'custom-description-change-btn',
          }
        "
      >
        {{ $t("change") }}
      </button>
      <OverlayPanel ref="op" appendTo="body" class="purchase-data_change-multi">
        <ListOptionsGroup
          :type="'action'"
          :readonly="
            dataPurch.payment_status_id === 3 &&
            !useUserInfo.userData.value?.permissions.edit_paid_purchase
          "
          :name="$t('status')"
          :is-colored="true"
          :list="useCommonsInfo.commons.value.productStatuses"
          :value="selectedStatus"
          @data-change="selectedStatus = $event"
        />
        <ListOptionsGroup
          :type="'action'"
          :list-name="'purpose'"
          :clearable="true"
          :readonly="
            dataPurch.payment_status_id === 3 &&
            !useUserInfo.userData.value?.permissions.edit_paid_purchase
          "
          :name="$t('purpose')"
          :list="useCommonsInfo.commons.value.purposes"
          :value="selectedPurpose"
          @data-change="selectedPurpose = $event"
        />
        <ListOptionsGroup
          :type="'action'"
          :name="$t('budget')"
          :readonly="
            dataPurch.payment_status_id === 3 &&
            !useUserInfo.userData.value?.permissions.edit_paid_purchase
          "
          :list="useBudgetExp.allBudgetExp.value"
          :clearable="true"
          :value="selectedBudget"
          @data-change="selectedBudget = $event"
        />
        <ListOptionsGroup
          :type="'action'"
          :name="$t('warehouse')"
          :readonly="
            dataPurch.payment_status_id === 3 &&
            !useUserInfo.userData.value?.permissions.edit_paid_purchase
          "
          :list="useCommonsInfo.commons.value.warehouses"
          :clearable="true"
          :value="selectedWarehouse"
          @data-change="selectedWarehouse = $event"
        />
        <TaskIDGroup
          :type="'action'"
          :value="selectedTaskID"
          @data-change="selectedTaskID = $event"
        />
      </OverlayPanel>
    </div>
  </div>
  <ChangeFactDialog
    v-if="!usePurchasesInfo.selectedPosition.value"
    :is-open="usePurchasesInfo.changePurpose.value"
    @update-fact-date="
      (e) => {
        changePurpose(e);
      }
    "
    @close="usePurchasesInfo.setChangePurpose($event)"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeMount } from "vue";

import type { IPurchase, IPurchaseNew } from "../../dialogs/types";
import type {
  ILegalExp,
  IPaymentType,
  ILegalCurrency,
} from "@/store/purchases_store/commons";
import type { CardHolder } from "@/api/purchasesTable";
import type { iReferenceItem, ILocation } from "@/components/header/types";
import type { IGroup } from "../../dialogs/types";
import type { IRates } from "@/api/purchaseCommons";
import type { Location } from "@/store/officesData";
import useCommonsInfo from "@/store/purchases_store/commons";
import useBudgetExp from "@/store/expenses_store/budget_exp";
import useUserInfo from "@/store/user";
import useOffices from "@/store/officesData";
import ListOptionsGroup from "./tabs/components/positions/ListOptionsGroup.vue";
import TaskIDGroup from "./tabs/components/positions/TaskIDGroup.vue";
import dateConverter from "@/helpers/dateConverter";
import { getRates } from "@/api/purchaseCommons";
import {
  getPurchase,
  changeStatusPurchase,
  changePurposePurchase,
  changeBudgetPurchase,
  changeWarehousePurchase,
  changeTaskIDPurchase,
} from "@/api/purchases";
import useSafes from "@/store/safes";
import usePurchasesInfo from "@/store/purchases_store/purchases";
import {
  getCurrencySignName,
  getCurrencySignOfficeID,
  getNameBySign,
} from "@/helpers/currencySign";
import AccordionPurchase from "@/components/accordion/AccordionPurchase.vue";
import TextLabelIcon from "@/components/labels/TextLabelIcon.vue";
import TeaxtAreaLabel from "@/components/labels/TeaxtAreaLabel.vue";
import NumberLabelIcon from "@/components/labels/NumberLabelIcon.vue";
import DropdownLabelAvatar from "@/components/labels/DropdownLabelAvatar.vue";
import PlusBtn from "@/components/icons/PlusBtn.vue";
import CalendarIcon from "@/components/icons/CalendarIcon.vue";
import i18n_config from "@/locales/i18n_config";
import ScreenParams from "@/store/screen";
import ChangeFactDialog from "@/views/purchases/components/dialogs/ChangeFactDialog.vue";

const props = defineProps<{
  data: IPurchase | IPurchaseNew | null;
  isGeneratedDescription: boolean;
  validateData: { [key: string]: string } | null;
  type: string;
  generalDesc: null | string;
}>();
const { messages, locale } = i18n_config.global;
const dataPurch = ref<IPurchase | IPurchaseNew>(
  props.data ? props.data : ({} as IPurchase)
);
const validateProps = ref(props.validateData);
const purchaseData = ref<string | Date | null>(null);
const comingDate = ref<string | Date | null>(null);
const officeID = ref<number | null>(null);
const departmentID = ref<number | null>(null);
const isEditable = ref(false);
const safes = computed(() => {
  // сдлеать норм тип
  const arr: any[] = [];
  useSafes.safes.value.forEach((item) =>
    item.accounts.forEach((el) => arr.push({ ...el, nameSafe: item.name }))
  );
  return arr.map((el) => {
    return {
      id: el.id,
      name: `${el.nameSafe} ${getCurrencySignName(el.currency)} (${el.balance})`,
      currency: el.currency,
    };
  });
});

const localCurrency = computed<string>(() => getCurrencySignOfficeID(officeID.value));

const offices = computed<iReferenceItem[]>(
  (): iReferenceItem[] => useOffices.offices.value || []
);
const departments = computed((): ILocation[] => {
  if (officeID.value) {
    const office: iReferenceItem | null | undefined = offices.value.find(
      (el) => el.id === officeID.value
    );

    return office ? office.locations : [];
  } else return [];
});

const payments = computed((): IPaymentType[] => {
  if (dataPurch.value && dataPurch.value !== null) {
    if (dataPurch.value.legal_id) {
      const payTypes = useCommonsInfo.commons.value.paymentTypes as IPaymentType[];
      const res = payTypes
        .filter((item: IPaymentType) =>
          item.legal_currencies.find(
            (el: ILegalCurrency) => el.legal_id === dataPurch.value.legal_id
          )
        )
        .map((el: IPaymentType) => {
          return {
            ...el,
            legal_currencies:
              el.legal_currencies.filter(
                (el: ILegalCurrency) => el.legal_id === dataPurch.value.legal_id
              ) || [],
          };
        });
      return res;
    }
  }

  return useCommonsInfo.commons.value.paymentTypes as IPaymentType[];
});

const rates = ref<IRates>({});
const op = ref();
const selectedStatus = ref<number | null>(null);
const selectedPurpose = ref<number | null>(null);
const selectedBudget = ref<number | null>(null);
const selectedWarehouse = ref<number | null>(null);
const selectedTaskID = ref<number | null>(null);

const selectedPaymentType = computed((): IPaymentType | undefined =>
  payments.value.find(
    (item) => dataPurch.value && item.id === dataPurch.value.payment_type_id
  )
);

const currencies = computed<string[]>(() =>
  selectedPaymentType.value
    ? selectedPaymentType.value.legal_currencies[0].currencies
    : []
);
const selectedCurrency = ref("RUB");

const isPaymentInCurrencies = computed(
  (): boolean =>
    !!dataPurch.value &&
    !!selectedPaymentType.value &&
    !!(
      (selectedPaymentType.value.legal_currencies[0] &&
        selectedPaymentType.value.legal_currencies[0].currencies &&
        selectedPaymentType.value.legal_currencies[0].currencies.length !== 0) ||
      dataPurch.value.payment_type_id === 8
    )
);
const cardHolders = computed<CardHolder[]>((): CardHolder[] => {
  if (dataPurch.value) {
    if (dataPurch.value.legal_id && dataPurch.value.payment_type_id) {
      const cardHolder = useCommonsInfo.commons.value.cardHolders as CardHolder[];
      const res = cardHolder.filter(
        (item: CardHolder) =>
          dataPurch.value &&
          item.legal_ids.find((el) => el === dataPurch.value.legal_id) &&
          item.payment_type_id === dataPurch.value.payment_type_id
      );
      return res;
    }
  }

  return [];
});

const price = computed<number>({
  get() {
    if (!isPaymentInCurrencies.value) {
      if (dataPurch.value) {
        return dataPurch.value.groups.reduce(
          (acc: number, prev: IGroup) =>
            prev && prev.debited_price && prev.quantity
              ? (acc += prev.debited_price * prev.quantity * prev.items.length)
              : (acc += 0),
          0
        );
      } else return 0;
    } else
      return rates.value[selectedCurrency.value]
        ? priceCurrency.value * rates.value[selectedCurrency.value]
        : priceCurrency.value;
  },
  set(value) {
    if (!isPaymentInCurrencies.value) {
      if (dataPurch.value) {
        if (dataPurch.value.groups.length === 1)
          dataPurch.value.groups[0].debited_price = dataPurch.value.groups[0].quantity
            ? value /
              (dataPurch.value.groups[0].quantity *
                dataPurch.value.groups[0].items.length)
            : 0;
      }
    }
  },
});

const priceCurrency = computed<number>({
  get() {
    if (isPaymentInCurrencies.value) {
      if (dataPurch.value) {
        return dataPurch.value.groups.reduce(
          (acc: number, prev: IGroup) =>
            prev && prev.debited_price && prev.quantity
              ? (acc += prev.debited_price * prev.quantity * prev.items.length)
              : (acc += 0),
          0
        );
      } else return 0;
    } else return 0;
  },
  set(value) {
    if (isPaymentInCurrencies.value) {
      if (dataPurch.value) {
        if (dataPurch.value.groups.length === 1)
          dataPurch.value.groups[0].debited_price = dataPurch.value.groups[0].quantity
            ? value /
              (dataPurch.value.groups[0].quantity *
                dataPurch.value.groups[0].items.length)
            : 0;
      }
    }
  },
});

const emit = defineEmits<{
  (e: "update:data", value: IPurchase | IPurchaseNew | null): void;
  (e: "update:isGeneratedDescription", value: boolean): void;
  (e: "update:validateData", value: { [key: string]: string } | null): void;
}>();

watch(dataPurch, () => {
  emit(
    "update:data",
    props.type === "edit"
      ? (dataPurch.value as IPurchase)
      : (dataPurch.value as IPurchaseNew)
  );
});

watch(
  () => priceCurrency.value,
  (value) => {
    usePurchasesInfo.setPricePurchase(value);
  }
);
watch(
  () => price.value,
  (value) => {
    usePurchasesInfo.setPricePurchase(value);
  }
);

watch(
  () => props.data,
  () => {
    dataPurch.value = props.data ? props.data : ({} as IPurchase);
  }
);

watch(
  () => props.type,
  () => {
    isEditable.value = props.type !== "create";
  }
);

watch(validateProps, () => {
  emit("update:validateData", validateProps.value);
});

watch(
  () => props.validateData,
  () => {
    validateProps.value = props.validateData;
  }
);

watch(
  () => props.generalDesc,
  (value) => {
    if (!isEditable.value && value && props.type === "create")
      dataPurch.value.description = value;
  }
);

watch(
  () => dataPurch.value?.groups,
  () => {
    if (dataPurch.value)
      if (!isEditable.value) {
        dataPurch.value.description = props.generalDesc;
      }
  },
  { deep: true }
);

watch(
  () => purchaseData.value,
  async (value) => {
    if (dataPurch.value)
      if (value) {
        dataPurch.value.purchase_date = dateConverter(`${value}`);
        rates.value = await getRates({ date: dataPurch.value.purchase_date });
      } else dataPurch.value.purchase_date = null;
  }
);

watch(
  () => comingDate.value,
  (value) => {
    if (dataPurch.value)
      if (value) dataPurch.value.comming_date = dateConverter(`${value}`);
      else dataPurch.value.comming_date = null;
  }
);

watch(
  () => selectedCurrency.value,
  (value) => {
    if (dataPurch.value) dataPurch.value.debited_currency = value;
  }
);

watch(
  () => currencies.value,
  async (value) => {
    if (value.length && dataPurch.value) {
      if (!value.includes(selectedCurrency.value) && !props.data?.debited_currency)
        selectedCurrency.value = value[0];
      rates.value = await getRates({
        date: dataPurch.value.purchase_date,
        currencies: value,
      });
    } else {
      selectedCurrency.value = getNameBySign(localCurrency.value);
    }
  }
);

watch(
  () => localCurrency.value,
  (value) => {
    if (props.data)
      if (!props.data.debited_currency || props.data.debited_currency === value)
        selectedCurrency.value = getNameBySign(value);
  }
);

watch(
  () => useCommonsInfo.commons.value.specialists,
  (value) => {
    if (
      value &&
      (props.type === "create" || props.type === "create-fav") &&
      dataPurch.value
    ) {
      dataPurch.value.specialist_id = useUserInfo.userData.value
        ? useUserInfo.userData.value.id
        : null;
    }
  }
);

watch(
  () => officeID.value,
  (value) => {
    if (
      (props.type === "create" || props.type === "create-fav") &&
      value &&
      useOffices.selectedOffice.value?.office_id !== value
    ) {
      useOffices.setSelectedOffice(departments.value[0]);
    } else if (useOffices.selectedOffice.value?.id !== dataPurch.value.location_id) {
      const department: Location | undefined = departments.value.find(
        (item: Location) => item.id === dataPurch.value.location_id
      );

      if (department) {
        useOffices.setSelectedOffice(department);
      }
    }

    if ((props.type === "create" || props.type === "create-fav") && dataPurch.value) {
      const purch = dataPurch.value as IPurchaseNew;
      purch.office_id = value;
    }
  }
);

watch(
  () => departmentID.value,
  (value) => {
    const department: Location | undefined = departments.value.find(
      (item: Location) => item.id === value
    );

    if (department && useOffices.selectedOffice.value?.id !== value) {
      useOffices.setSelectedOffice(department);
    }
    if (
      department &&
      validateProps.value &&
      (props.type === "create" || props.type === "create-fav")
    ) {
      if (department.department === "all") {
        validateProps.value.department =
          messages[locale].select + " " + messages[locale].section;
      } else validateProps.value.department = "";
    }

    if ((props.type === "create" || props.type === "create-fav") && dataPurch.value) {
      const purch = dataPurch.value as IPurchaseNew;
      purch.department_id = value;
    }
  }
);

watch(
  () => dataPurch.value?.legal_id,
  (value) => {
    if (dataPurch.value) {
      if (
        dataPurch.value.payment_type_id !== 8 &&
        dataPurch.value.payment_type_id !== 5
      ) {
        if (!value) dataPurch.value.payment_type_id = null;
        else {
          dataPurch.value.payment_type_id = null;
        }
      }
      dataPurch.value.card_holder_id = null;
      if (validateProps.value) {
        if (
          !value &&
          dataPurch.value.payment_type_id !== 8 &&
          dataPurch.value.payment_type_id !== 5
        ) {
          validateProps.value.legal_id =
            messages[locale].select + " " + messages[locale]["legal entity"];
        } else validateProps.value.legal_id = "";
      }

      if (!dataPurch.value.legal_id) {
        const legal_entity = useCommonsInfo.commons.value.legalEntities as ILegalExp[];
        legal_entity.forEach((el) => {
          if (el.is_default && dataPurch.value && !dataPurch.value.legal_id) {
            dataPurch.value.legal_id = el.id;
          }
        });
      }
    }
  }
);

watch(
  () => dataPurch.value?.specialist_id,
  (value) => {
    if (validateProps.value) {
      if (!value) {
        validateProps.value.specialist_id =
          messages[locale].select + " " + messages[locale].purchaser_1;
      } else validateProps.value.specialist_id = "";
    }
  }
);

watch(
  () => dataPurch.value?.payment_type_id,
  (value) => {
    if (dataPurch.value) {
      if (value !== 8) dataPurch.value.account_id = null;
      else if (value === 8 || value === 5) {
        if (validateProps.value)
          if (value === 8 && !dataPurch.value.account_id) {
            validateProps.value.account_id =
              messages[locale].select + " " + messages[locale].invoice;
          } else if (dataPurch.value.account_id) validateProps.value.account_id = "";
      }
    }

    if (isPaymentInCurrencies.value) {
      if (currencies.value.length) {
        if (
          dataPurch.value.debited_currency &&
          currencies.value.find((el) => el === dataPurch.value.debited_currency)
        )
          selectedCurrency.value = dataPurch.value.debited_currency;
        else selectedCurrency.value = currencies.value[0];
      }
    }

    dataPurch.value.card_holder_id = null;
  }
);

watch(
  () => dataPurch.value?.account_id,
  (value) => {
    if (dataPurch.value)
      if (validateProps.value) {
        if (dataPurch.value.payment_type_id === 8 && !value) {
          validateProps.value.account_id =
            messages[locale].select + " " + messages[locale].invoice;
        } else validateProps.value.account_id = "";
      }
  }
);

watch(
  () => useCommonsInfo.commons.value.legalEntities,
  () => {
    if (useCommonsInfo.commons.value.legalEntities && dataPurch.value) {
      const legal_entity = useCommonsInfo.commons.value.legalEntities as ILegalExp[];
      legal_entity.forEach((el) => {
        if (el.is_default && dataPurch.value && !dataPurch.value.legal_id) {
          dataPurch.value.legal_id = el.id;
        }
      });
    }
  }
);

watch(
  () => useUserInfo.userData.value,
  (value) => {
    if (value) {
      departmentID.value = value?.location?.id ? +value.location.id : null;
    }
  }
);

watch(
  () => props.data?.purchase_date,
  async (value) => {
    if (value) {
      rates.value = await getRates({ date: value });
    }
  }
);

watch(
  () => selectedStatus.value,
  async (value) => {
    if (value && value != -1 && dataPurch.value?.id) {
      await changeStatusPurchase(dataPurch.value.id, value);

      await changePurchase();
    }

    value = null;
  }
);

watch(
  () => selectedPurpose.value,
  (value) => {
    console.log(value);
    if (value && value != -1 && dataPurch.value?.id) {
      usePurchasesInfo.setChangePurpose(true);
    }
  }
);

watch(
  () => selectedBudget.value,
  async (value) => {
    if (value && value != -1 && dataPurch.value?.id) {
      await changeBudgetPurchase(dataPurch.value.id, value);

      await changePurchase();
    }

    value = null;
  }
);

watch(
  () => selectedWarehouse.value,
  async (value) => {
    if (value && value != -1 && dataPurch.value?.id) {
      await changeWarehousePurchase(dataPurch.value.id, value);

      await changePurchase();
    }

    value = null;
  }
);

watch(
  () => selectedTaskID.value,
  async (value) => {
    if (value && dataPurch.value?.id) {
      await changeTaskIDPurchase(dataPurch.value.id, value);

      await changePurchase();
    }

    value = null;
  }
);

watch(
  () => props.data?.account_id,
  async (value) => {
    if (value) {
      const currAccount = safes.value.find(
        (item) => props.data && item.id === props.data.account_id
      );

      selectedCurrency.value = currAccount?.currency || "RUB";
    }
  }
);

watch(
  () => isEditable.value,
  async (value) => {
    if (!value && dataPurch.value) {
      dataPurch.value.description = props.generalDesc;
    }
  }
);

const changePurpose = async (value: null | string) => {
  if (dataPurch.value.id && selectedPurpose.value) {
    if (value) {
      await changePurposePurchase(dataPurch.value.id, selectedPurpose.value, value);
    } else {
      await changePurposePurchase(dataPurch.value.id, selectedPurpose.value);
    }
    await changePurchase();
  }

  selectedPurpose.value = null;
};

const turnOffGenerated = () => {
  emit("update:isGeneratedDescription", isEditable.value);

  isEditable.value = !isEditable.value;
};

// RGB codes
const setPaymentStatusColor = (id: number) => {
  switch (id) {
    case 4:
      return "21, 101, 192";
    case 2:
      return "194, 24, 91";
    case 3:
      return "104, 159, 56";
    default:
      return "102, 102, 102";
  }
};

const toggle = (event: Event) => {
  op.value.toggle(event);
};

const changePurchase = async (): Promise<void> => {
  if (dataPurch.value?.id) {
    usePurchasesInfo.setSelectedPurchase(null);
    await selectedPurchase();
    usePurchasesInfo.setUpdateTable(true);
    setTimeout(() => {
      usePurchasesInfo.setUpdateTable(false);
    });
  }
};

const selectedPurchase = async () => {
  if (dataPurch.value?.id) {
    await getPurchase(dataPurch.value.id).then((res) => {
      usePurchasesInfo.setSelectedPurchase({ ...res, isChanged: false });
    });
  }
};

onBeforeMount(async () => {
  if (props.data) {
    purchaseData.value = props.data.purchase_date
      ? new Date(props.data.purchase_date)
      : new Date();
    comingDate.value = props.data.comming_date ? new Date(props.data.comming_date) : null;
  }

  rates.value = await getRates();

  const purch = props.data as IPurchaseNew;

  if ((props.type === "create" || props.type === "create-fav") && purch.office_id) {
    officeID.value = purch.office_id;
  } else if (props.type === "create" || props.type === "create-fav") {
    officeID.value = useUserInfo.userData.value?.location?.office_id
      ? +useUserInfo.userData.value.location.office_id
      : null;
  } else {
    for (let i = 0; i < offices.value.length; i++) {
      if (props.data?.location_id) {
        const location =
          offices.value[i].locations.find(
            (item: ILocation) => item.id === props.data?.location_id
          ) || null;
        if (location) {
          useOffices.setSelectedOffice(location);
          officeID.value = location.office_id;
          break;
        }
      } else {
        officeID.value = null;
        break;
      }
    }
  }

  if ((props.type === "create" || props.type === "create-fav") && purch.department_id) {
    departmentID.value = purch.department_id;
  } else if (props.type === "create" || props.type === "create-fav") {
    departmentID.value = useUserInfo.userData.value?.location?.id
      ? +useUserInfo.userData.value.location.id
      : null;
  } else {
    departmentID.value =
      props.data && props.data.location_id ? props.data.location_id : null;
  }

  if (props.data?.debited_currency) {
    selectedCurrency.value = props.data.debited_currency;

    rates.value = await getRates({
      date: dataPurch.value.purchase_date,
      currencies: [selectedCurrency.value],
    });
  }

  if (props.type === "edit" || props.type === "create-fav") {
    isEditable.value = true;
  }

  if (isPaymentInCurrencies.value) {
    usePurchasesInfo.setPricePurchase(priceCurrency.value);
  } else {
    usePurchasesInfo.setPricePurchase(price.value);
  }
});

if (useCommonsInfo.commons.value.legalEntities && dataPurch.value) {
  const legal_entity = useCommonsInfo.commons.value.legalEntities as ILegalExp[];
  legal_entity.forEach((el) => {
    if (el.is_default && dataPurch.value && !dataPurch.value.legal_id) {
      dataPurch.value.legal_id = el.id;
    }
  });
}
</script>

<style lang="scss">
.simplebar-track.simplebar-vertical {
  top: 0;
  width: 8px;
  opacity: 0.5;
}
.input-purchase.case {
  & > .label_box::after {
    background: none;
  }
}

.list-purchase {
  width: 100%;
  height: 50px;
  & > .label_box {
    height: 100%;
    & > .p-dropdown > .p-dropdown-label {
      padding-left: 0;
      padding-right: 0;
    }
  }
}

.description-purchase {
  display: flex;
  gap: 8px;
  &_title {
    font-weight: 700;
    font-size: 18px;
  }
  &_btn {
    background: none;
    cursor: pointer;
    border: none;
    outline: none;
    & > i {
      font-size: 18px;
    }
  }
}

.purchase-data {
  width: 100%;
  height: auto;
  max-height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0 10px;
  gap: 36px;
  &_change-multi.p-overlaypanel {
    & > .p-overlaypanel-content {
      padding: 15px;
    }
  }
  &_change-btn {
    width: auto;
    background: none;
    cursor: pointer;
    border: none;
    outline: none;
    color: #c62828;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    border-radius: 10px;
    padding: 0 10px 0 0;
    &:disabled {
      cursor: auto;
      color: #b6b6b6;
    }
  }
  &_wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    &__row {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      &_item {
        width: 50% !important;
      }
    }
    .descriptions {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      border: 1px solid #e3e3e3;
      background: #fff;
      padding: 8px 15px;
      &_item {
        border-bottom: 1px solid #e3e3e3;
        & > .input-purchase {
          padding: 0;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
    .supliers {
      &_add-btn {
        cursor: pointer;
        outline: none;
        background: none;
        border: none;
        &:disabled {
          cursor: auto;
          opacity: 0.5;
        }
      }
    }
    .general-input {
      height: 50px;
      border-radius: 10px;
      border: 1px solid var(--vt-c-light-white);
      gap: 0px;
      &--readonly {
        border: 1px dashed var(--vt-c-light-white);
      }
      &_item {
        position: relative;
        height: 34px;
        &.payments-list {
          height: 45px !important;
          padding: 0;
          border: none;
        }
        &.payments-currency {
          width: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 10px;
          & > .payments-currency_item {
            cursor: pointer;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            color: black;
            font-weight: 400;
            border-radius: 8px;
            font-size: 18px;
            &--active {
              background-color: #1565c0;
              color: white;
            }
            &--readonly {
              cursor: auto;
              opacity: 0.5;
            }
          }
        }
        &__label {
          position: absolute;
          left: 11px;
        }
        &__calendar {
          height: 20px;
          width: 100%;
          & > input {
            width: 100%;
            border: none;
            padding: 0 15px;
          }
          & > button {
            border: none;
            background: none;
            &:hover {
              border: none;
              background: none;
            }
          }
        }
      }
      & > * {
        box-sizing: border-box;
        width: 100%;
        border-left: 1px solid var(--mono-divider, #e3e3e3) !important;
        padding: 5px 0;
        &:first-child {
          border-left: none !important;
        }
      }
    }
  }
}

.p-float-label input:focus ~ label,
.p-float-label input.p-filled ~ label,
.p-float-label textarea:focus ~ label,
.p-float-label textarea.p-filled ~ label,
.p-float-label .p-inputwrapper-focus ~ label,
.p-float-label .p-inputwrapper-filled ~ label {
  top: 0.2em !important;
  left: 16px;
}

.p-float-label > label {
  left: 15px;
}

.custom-description-change-btn .p-tooltip-text {
  background-color: white;
  color: #666666;
  padding-bottom: 5px;
  padding-top: 1px;
  font-size: 14px;
}
</style>
