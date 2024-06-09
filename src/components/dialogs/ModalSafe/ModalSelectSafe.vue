<script lang="ts" setup>
import type { IBalance, IOperation, ISources } from '@/api/gettersSafe';
import { onMounted, ref, watch } from 'vue';
import ModalSafeTable from './modalSafeComponents/ModalSafeTable.vue';
import { getCurrencySignName } from '@/helpers/currencySign';
import incoming_filters from '@/store/purchases_store/incoming_filters';
import type { TreeNode } from './modalSafeComponents/types';
import useSafeFilters from '@/store/safeStore/safeFilterStore';
import ModalSafeBill from './modalSafeComponents/ModalSafeBillChanger/ModalSafeBill.vue';
import useUserInfo from '@/store/user';
import type { IAccounts, ISafe } from '@/store/safes';
import i18n_config from '@/locales/i18n_config';
import { curFormatter } from '@/helpers/currencyFormatter';

const { locale, messages } = i18n_config.global;
const props = defineProps<{
  safe_account: IBalance;
  income_sources: ISources[] | null;
  outcome_sources: ISources[] | null;
  operations: IOperation | null;
  safes: ISafe[];
  isUpdate: boolean;
  columns: {
    id: number;
    field: string;
    name: string;
    active: boolean;
  }[];
}>();
const entities = ref<TreeNode[]>([]);
const accounts = ref<IAccounts[] | null>(null);
const isOpen = ref(false);
const fillEntities = () => {
  entities.value[0] = { key: 'purchase', label: messages[locale].purchase };
  entities.value[1] = { key: 'outcome', label: messages[locale]['write-off'], children: [] };
  props.outcome_sources?.map((el) => {
    entities.value[1].children?.push({ key: el.id.toString(), label: el.name });
  });
  entities.value[2] = { key: 'income', label: messages[locale].receipt, children: [] };
  props.income_sources?.map((el) => {
    entities.value[2].children?.push({ key: el.id.toString(), label: el.name });
  });
};

const fillAccounts = () => {
  const res = [] as any[];
  props.safes.map((safe) => {
    safe.accounts.map((el) => {
      if (el.id !== props.safe_account.id) {
        res.push({ ...el, name: `${safe.name} ${el.currency} (${el.balance})` });
      }
    });
  });
  return res as unknown as IAccounts[];
};

onMounted(() => {
  if (props.income_sources && props.outcome_sources) {
    fillEntities();
    accounts.value = fillAccounts();
  }
});

watch(
  () => props.safes,
  () => {
    accounts.value = fillAccounts();
  }
);
</script>

<template>
  <div :class="isOpen ? 'modal_select_safe_div_all_open' : ''" class="modal_select_safe_div_all">
    <div class="modal_select_safe_div_flex_container">
      <span class="modal_safe_select_span_currency" style="margin-left: -6px">{{
        safe_account.currency
      }}</span>
      <div class="test_select" style="display: flex; padding-right: 3%">
        <span class="modal_safe_select_span_currency"
          >{{ curFormatter(safe_account.balance) }}
          {{ getCurrencySignName(safe_account.currency) }}</span
        >
        <hr class="modal_safe_select_hr_currency" />
        <span class="modal_safe_select_span_currency_different"
          >{{ curFormatter(safe_account.balance_wo_reserve) }}
          {{ getCurrencySignName(safe_account.currency) }}</span
        >
      </div>
    </div>
    <div class="modal_selected_safe_div_body">
      <ModalSafeTable
        :is-update="isUpdate"
        @scroll="(val) => $emit('scroll', val)"
        @entity_id="(id) => $emit('entity_id', id)"
        @update="(val) => $emit('update', val)"
        :entities="entities"
        :currency="getCurrencySignName(safe_account.currency)"
        :columns="columns"
        :safe_account="safe_account"
        :options="operations"
      />
      <div class="modal_selected_safe_div_body_bill">
        <ModalSafeBill
          v-if="accounts"
          :disable="!useUserInfo.userData.value?.permissions.control_safes"
          :income_sources="income_sources"
          :accounts="accounts"
          :safe_account="safe_account"
          @update="(val) => $emit('update', val)"
          @open="(val) => (isOpen = val)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.modal_safe_select_span_currency {
  color: #1a1a1a;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
}

.modal_select_safe_div_all {
  background-color: #fff;
  width: 51%;
  border-radius: 10px;
  padding-bottom: 10px;
}

.modal_select_safe_div_flex_container {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  padding-left: 4%;
}

.modal_safe_select_span_currency_different {
  color: var(--mono-grey, #999);
  font-size: 14px;
  font-style: normal;
  margin-top: 3px;
  font-weight: 400;
  line-height: 18px;
}

.modal_safe_select_hr_currency {
  margin-left: 5px;
  margin-right: 5px;
  border: 0.01px rgba(128, 128, 128, 0.336) solid;
}

.modal_selected_safe_div_body {
  display: flex;
  flex-direction: row;
  gap: 22px;
  align-items: flex-start;
  height: 244px;
}

.modal_selected_safe_div_body_bill {
  margin-left: 1%;
}

@media only screen and (max-width: 950px) {
  .modal_selected_safe_div_body {
    flex-direction: column;
    justify-content: space-between;
    gap: 30%;
    background: none !important;
    padding-bottom: 10vh;
  }
  .modal_select_safe_div_all {
    height: 55vh;
    width: 88vw;
    transition: all 0.4s;
  }
  .modal_select_safe_div_all_open {
    height: 95vh;
    padding-bottom: 3%;
  }
  .modal_selected_safe_div_body_bill {
    overflow: scroll;
    margin-top: -5px !important;
    font-size: 11px;
  }
}
</style>
