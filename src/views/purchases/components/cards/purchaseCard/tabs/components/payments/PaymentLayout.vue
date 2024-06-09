<template>
  <div class="add-payment_content">
    <InlineMessage
      v-if="
        dataPayment.type_id === 2 &&
        showHint &&
        dataPayment.debited_price &&
        dataPayment.debited_price < remainder
      "
      class="add-payment_hint"
      severity="info"
      >{{ $t('purchase amount covered') }} <br />
      ({{ $t('remainder') }}:
      {{ curFormatter(remainder.toFixed(2)) + ' ' + getCurrencySignName(debitedCurrency) }})
    </InlineMessage>
    <div class="add-payment_content__row">
      <div class="add-payment_content__price">
        <NumberLabelIcon
          :class-name="'price-input'"
          :title="$t('amount')"
          :value="dataPayment.price"
          @data-change="dataPayment.price = $event"
          :border="'none'"
        />
        <div class="price-currency">
          {{ getCurrencySignName(currency) }}
        </div>
      </div>

      <button
        @click="isConvertByRate = !isConvertByRate"
        :class="['add-payment_content__price-link', { 'active-link': isConvertByRate }]"
      >
        <i :class="['mdi', `mdi-link`]"></i>
      </button>

      <div class="add-payment_content__price">
        <NumberLabelIcon
          :class-name="'price-input'"
          :title="$t('currency amount')"
          :value="dataPayment.debited_price"
          @data-change="dataPayment.debited_price = $event"
          :border="'none'"
        ></NumberLabelIcon>
        <div class="price-currency">
          {{ getCurrencySignName(debitedCurrency) }}
        </div>
      </div>
    </div>
    <DropdownLabelAvatar
      :no-image="true"
      :label="$t('payment method')"
      :value="dataPayment.type_id"
      :list="useCommonsInfo.commons.value.payingTypes"
      @data-change="dataPayment.type_id = $event"
    />
    <div
      :class="[
        'add-payment_content__calendar p-float-label',
        {
          invalid: !(
            usePurchasesInfo.selectedPurchase.value?.purchase_date &&
            dateConverter(`${usePurchasesInfo.selectedPurchase.value.purchase_date}`) <=
              dateConverter(`${dataPayment.date}`)
          )
        }
      ]"
    >
      <Calendar
        v-model="date"
        dateFormat="dd.mm.yy"
        showIcon
        inputId="labelCalendar"
        :class="[
          {
            'p-invalid': !(
              usePurchasesInfo.selectedPurchase.value?.purchase_date &&
              dateConverter(`${usePurchasesInfo.selectedPurchase.value.purchase_date}`) <=
                dateConverter(`${dataPayment.date}`)
            )
          }
        ]"
        @update:modelValue="date = $event"
      >
        <template #dropdownicon>
          <CalendarIcon />
        </template>
      </Calendar>
      <label for="labelCalendar">{{ $t('date') }}</label>
      <span
        class="add-payment_content__calendar--error"
        v-if="
          !(
            usePurchasesInfo.selectedPurchase.value?.purchase_date &&
            dateConverter(`${usePurchasesInfo.selectedPurchase.value.purchase_date}`) <=
              dateConverter(`${dataPayment.date}`)
          )
        "
        >{{ $t('payment date must') }}</span
      >
    </div>
    <DropdownLabelAvatar
      :label="$t('related documents')"
      :value="dataPayment.document_id"
      @data-change="dataPayment.document_id = $event"
      :option-label="'real_name'"
      :prop="'real_name'"
      :list="docs"
      :no-image="true"
    />
    <TeaxtAreaLabel
      :title="$t('description')"
      :value="dataPayment.note"
      @data-change="dataPayment.note = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

import useCommonsInfo from '@/store/purchases_store/commons';

import DropdownLabelAvatar from '@/components/labels/DropdownLabelAvatar.vue';
import TeaxtAreaLabel from '@/components/labels/TeaxtAreaLabel.vue';
import NumberLabelIcon from '@/components/labels/NumberLabelIcon.vue';
import CalendarIcon from '@/components/icons/CalendarIcon.vue';

import type { ICreatePayment, IPayment } from '@/api/paymentsPurchase';
import usePurchasesInfo from '@/store/purchases_store/purchases';
import { getCurrencySignName } from '@/helpers/currencySign';
import { getRates } from '@/api/purchaseCommons';
import type { IRates } from '@/api/purchaseCommons';
import type { IDocumentPurchase } from '@/api/attachments';
import dateConverter from '@/helpers/dateConverter';
import { curFormatter } from '@/helpers/currencyFormatter';

const props = defineProps<{
  payment: IPayment | ICreatePayment;
  debitedCurrency: string;
  currency: string;
  showHint: boolean;
  remainder: number;
}>();

const dataPayment = ref<IPayment | ICreatePayment>(props.payment);
const rates = ref<IRates>({});
const isConvert = ref(false);
const isConvertByRate = ref(true);
const date = ref<string | string[] | Date | Date[] | undefined | null>(null);

const docs = computed<IDocumentPurchase[]>(() =>
  usePurchasesInfo.docsPurchase.value.map((item: IDocumentPurchase) => {
    return {
      ...item,
      real_name: item.real_name.split('.')[0].toLocaleLowerCase()
    };
  })
);
const currRate = computed(() => {
  if (props.currency === props.debitedCurrency) {
    return 1;
  } else {
    return rates.value[props.debitedCurrency] || 1;
  }
});

watch(
  () => dataPayment.value.date,
  async (value) => {
    rates.value = await getRates({ date: dateConverter(`${value}`) });
  }
);

watch(
  () => date.value,
  async (value) => {
    dataPayment.value.date = value ? dateConverter(`${value}`) : null;
  }
);

watch(
  () => dataPayment.value.price,
  async (value) => {
    if (isConvertByRate.value) {
      if (!isConvert.value) {
        dataPayment.value.debited_price = value ? value / currRate.value : 0;
        isConvert.value = true;
      } else {
        isConvert.value = false;
      }
    }
  }
);

watch(
  () => dataPayment.value.debited_price,
  async (value) => {
    if (isConvertByRate.value) {
      if (!isConvert.value) {
        dataPayment.value.price = value ? value * currRate.value : 0;
        isConvert.value = true;
      } else {
        isConvert.value = false;
      }
    }
  }
);

onMounted(async () => {
  rates.value = await getRates();

  date.value = dataPayment.value.date;
});
</script>

<style lang="scss">
.add-payment {
  &_hint {
    justify-content: flex-start !important;
    background-color: rgba(219, 234, 254, 0.7) !important;
    color: #3b82f6 !important;
  }
  &_content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 450px;
    &__row {
      display: flex;
      align-items: center;
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
  }
}
</style>
