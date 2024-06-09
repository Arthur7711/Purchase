<script setup lang="ts">
import type { IBalance, ISources } from '@/api/gettersSafe';
import DropdownDynamicLabel from '@/components/custom/DynamicLabelComponents/DropdownDynamicLabel.vue';
import InputLabel from '@/components/custom/DynamicLabelComponents/InputLabel.vue';
import TextareaDynamicLabelWithCounter from '@/components/custom/DynamicLabelComponents/TextareaDynamicLabelWithCounter.vue';
import { onMounted, ref, watch } from 'vue';
import { getCurrencySignName } from '@/helpers/currencySign';
import { postMove, postReserve } from '@/api/postsSafe';
import type { IAccount, IAccounts } from '@/store/safes';
import chainLock from '@/components/icons/chainLock.vue';
import { getRates } from '@/api/purchaseCommons';

const props = defineProps<{
  safe_account: IBalance;
  accounts: IAccounts[];
}>();

const emit = defineEmits<{
  (e: 'update', value: boolean): void;
}>();

const comp_accounts = ref<IAccount[]>(props.accounts);

const formData = ref<{
  account_id: IAccounts | '';
  income_amount: string;
  outcome_amount: string;
}>({
  account_id: '',
  income_amount: '',
  outcome_amount: ''
});

const cource = ref<string | number>();
const custom_cource = ref<string | number>();
const cource_lock = ref(false);

// interface IPostMoveParams {
//   safe_id: string | number
//   id: string | number
//   outcome_amount: string | number
//   income_amount: string | number
//   account_id: string | number
// }

const handlePost = async () => {
  if (formData.value.account_id) {
    await postMove({
      safe_id: props.safe_account.safe_id,
      id: props.safe_account.id,
      outcome_amount: formData.value.outcome_amount,
      income_amount: formData.value.income_amount,
      account_id: formData.value.account_id.id
    });
    formData.value = {
      account_id: '',
      income_amount: '',
      outcome_amount: ''
    };
    cource_lock.value = false;
    custom_cource.value = cource.value;
    emit('update', true);
  }
};

const handleChangeOutcome = (val: string) => {
  formData.value.outcome_amount = val;
  if (!cource_lock.value) {
    if (formData.value.outcome_amount && cource.value) {
      formData.value.income_amount = (Number(formData.value.outcome_amount) / Number(cource.value))
        .toFixed(2)
        .toString();
    } else if (!formData.value.outcome_amount) {
      formData.value.income_amount = '';
    }
  } else {
    if (formData.value.outcome_amount && custom_cource.value) {
      formData.value.income_amount = (
        Number(formData.value.outcome_amount) / Number(custom_cource.value)
      )
        .toFixed(2)
        .toString();
    } else if (!formData.value.outcome_amount) {
      formData.value.income_amount = '';
    }
  }
};

const handleChangeIncome = (val: string) => {
  formData.value.income_amount = val;
  if (!cource_lock.value) {
    if (formData.value.income_amount && cource.value) {
      formData.value.outcome_amount = (Number(formData.value.income_amount) * Number(cource.value))
        .toFixed(2)
        .toString();
    } else if (!formData.value.income_amount) {
      formData.value.outcome_amount = '';
    }
  } else {
    if (formData.value.income_amount && custom_cource.value) {
      formData.value.outcome_amount = (
        Number(formData.value.income_amount) * Number(custom_cource.value)
      )
        .toFixed(2)
        .toString();
    } else if (!formData.value.income_amount) {
      formData.value.outcome_amount = '';
    }
  }
};

watch(
  () => props.accounts,
  () => {
    comp_accounts.value = props.accounts;
  }
);

watch(
  () => [cource_lock.value, custom_cource.value],
  () => {
    handleChangeOutcome(formData.value.outcome_amount);
  }
);

watch(
  () => formData.value.account_id,
  () => {
    if (formData.value.account_id) {
      const acc_currency = formData.value.account_id.currency;
      getRates({ currencies: [acc_currency, props.safe_account.currency] }).then((res) => {
        cource.value = (res[acc_currency] / res[props.safe_account.currency]).toFixed(4);
        custom_cource.value = (res[acc_currency] / res[props.safe_account.currency]).toFixed(4);
      });
    }
  }
);
</script>

<template>
  <div>
    <div>
      <DropdownDynamicLabel
        :editable="false"
        :label="$t('on account')"
        :model-value="formData.account_id"
        :options="comp_accounts"
        @change="(val) => {(formData.account_id = val as IAccounts)}"
      />
    </div>
    <div class="modal_safe_move_inputgroup">
      <InputLabel
        :show_hr="true"
        :disable="!formData.account_id"
        :label="$t('amount')"
        :model-value="formData.outcome_amount"
        :deb-timer="450"
        :input-type="'number'"
        @change="(val) => handleChangeOutcome(val)"
      >
        <template #currency>
          <div class="modal_safe_move_money_currency_block">
            {{ getCurrencySignName(safe_account.currency) }}
          </div>
        </template>
      </InputLabel>
      <InputLabel
        :show_hr="true"
        :label="$t('at the rate')"
        :disable="!cource_lock"
        :model-value="(!cource_lock ? cource as string : custom_cource as string)"
        :deb-timer="450"
        :input-type="'number'"
        @change="(val) => (custom_cource = val)"
        @blur="() => (custom_cource = String(custom_cource).length ? custom_cource : cource)"
      >
        <template #currency>
          <div style="max-width: 40px; overflow: hidden; max-height: 40px">
            <chainLock
              @click="
                (e) => {
                  e.stopPropagation();
                  if (
                    formData.account_id &&
                    safe_account.currency !== formData.account_id.currency
                  ) {
                    cource_lock = !cource_lock;
                  }
                }
              "
              :active="cource_lock"
            />
          </div>
        </template>
      </InputLabel>
    </div>
    <div style="width: 100%">
      <InputLabel
        :show_hr="!!formData.account_id"
        :label="$t('credit amount')"
        :disable="cource_lock || !formData.account_id"
        :model-value="formData.income_amount"
        :deb-timer="450"
        :label_style="{ marginLeft: '-5px' }"
        :input-type="'number'"
        @change="(val) => handleChangeIncome(val)"
      >
        <template #currency>
          <div v-if="formData.account_id" class="modal_safe_move_money_currency_block">
            {{ getCurrencySignName(formData.account_id.currency) }}
          </div>
        </template>
      </InputLabel>
    </div>
    <button
      :disabled="
        !(
          formData.account_id &&
          formData.income_amount &&
          formData.outcome_amount &&
          formData.income_amount != '0' &&
          formData.outcome_amount != '0'
        )
      "
      @click="handlePost"
      class="modal_safe_add_button_save"
    >
      {{ $t('move') }}
    </button>
  </div>
</template>

<style lang="scss">
.modal_safe_move_inputgroup {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 8px;
  gap: 10px;
}

.modal_safe_move_money_currency_block {
  border-radius: 8px;
  background: var(--blue, #1565c0);
  width: 40px;
  height: 40px;
  padding: 10px 16px 10px 16px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-left: 2px;
  margin-right: 5px;
}
</style>
