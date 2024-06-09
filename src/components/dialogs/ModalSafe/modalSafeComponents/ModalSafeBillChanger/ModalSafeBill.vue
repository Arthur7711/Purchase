<script lang="ts" setup>
import RadioButton from 'primevue/radiobutton';
import { ref, watch } from 'vue';
import ModalSafeAddMoney from './ModalSafeAddMoney.vue';
import type { IBalance, ISources } from '@/api/gettersSafe';
import ModalSafeReserv from './ModalSafeReserv.vue';
import ModalSafeMoving from './ModalSafeMoving.vue';
import type { IAccounts } from '@/store/safes';
import i18n_config from '@/locales/i18n_config';

const props = defineProps<{
  income_sources: ISources[] | null;
  safe_account: IBalance;
  disable: boolean;
  accounts: IAccounts[];
}>();

const emit = defineEmits<{
  (e: 'update', value: boolean): void;
  (e: 'open', value: boolean): void;
}>();

const comp_accounts = ref<IAccounts[]>(props.accounts);

const { locale, messages } = i18n_config.global;
const show = ref(false);
const categories = [
  { id: 0, name: messages[locale].replenish, key: '1' },
  { id: 1, name: messages[locale].reserve, key: '2' },
  { id: 2, name: messages[locale].relocate, key: '3' }
];
const selectedCategory = ref<string | number>(0);

const handleHardUpdate = (category: string | number) => {
  emit('update', true);
};

const handleShow = () => {
  show.value = !show.value;
  emit('open', show.value);
};

watch(
  () => props.accounts,
  () => {
    comp_accounts.value = props.accounts;
  }
);
</script>

<template>
  <div class="modal_safe_bill_div_all">
    <div
      style="display: flex; justify-content: space-between"
      :style="disable ? { cursor: 'no-drop' } : { cursor: 'pointer' }"
      @click="disable ? null : handleShow()"
    >
      <span :style="disable ? { color: '#9999' } : ''" class="modal_sfe_bill_span_bill">{{
        $t('account change')
      }}</span
      ><img
        src="../../../../icons/chevron-right.svg"
        class="modal_sfe_bill_img_bill"
        :style="show ? { rotate: '90deg' } : { rotate: '270deg' }"
        alt="v"
      />
    </div>
    <Transition>
      <div v-if="!disable" class="modal_safe_bill_div_form" v-show="show">
        <div class="modal_safe_bill_div_category">
          <div v-for="category in categories" :key="category.id">
            <RadioButton
              v-model="selectedCategory"
              :inputId="category.key"
              name="safe_category"
              :value="category.id"
            />
            <label
              :for="category.key"
              @click="selectedCategory = category.id"
              :class="
                selectedCategory === category.id
                  ? 'modal_safe_bill_label_category_active'
                  : 'modal_safe_bill_label_category_disable'
              "
            >
              {{ category.name }}</label
            >
          </div>
        </div>
        <div style="margin-top: 16px">
          <ModalSafeAddMoney
            :safe_account="safe_account"
            v-if="selectedCategory === 0"
            :income_sources="income_sources"
            @update="() => handleHardUpdate(0)"
          />
          <ModalSafeReserv
            v-else-if="selectedCategory === 1"
            :safe_account="safe_account"
            @update="() => handleHardUpdate(0)"
          />
          <ModalSafeMoving
            v-else-if="selectedCategory === 2"
            :safe_account="safe_account"
            :accounts="comp_accounts"
            @update="() => handleHardUpdate(0)"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.modal_safe_bill_div_all {
  background-color: #fff;
  margin-top: -42px;
  border-radius: 10px;
  margin-left: 1vw;
  user-select: none;
  padding: 20px;
  width: 470px;
  position: fixed;
}

.modal_safe_bill_div_all {
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.2s ease;
    margin-left: 0px;
    margin-top: 0;
    transition: all 0.4s !important;
    transform: scale(1);
    height: max-content;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    height: 10px;
    transition: all 0.4s !important;
    margin-top: 0;
    transform: scale(1);
  }
}

.modal_sfe_bill_span_bill {
  color: var(--mono-black, #1a1a1a);
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
}

.modal_sfe_bill_img_bill {
  transition: all 0.3s ease-in-out;
}

.modal_safe_bill_div_category {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  .p-radiobutton .p-radiobutton-box.p-highlight {
    border-color: #00000000;
    background: #1565c0;
  }

  .p-radiobutton-box .p-highlight {
    display: flex;
    justify-content: center !important;
    align-items: center !important;
    padding: 2%;
  }
  .p-radiobutton .p-radiobutton-box.p-highlight:not(.p-disabled):hover {
    border-color: #00000000;
    background: #1565c0;
  }
}

.modal_safe_bill_label_category_active,
.modal_safe_bill_label_category_disable {
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  margin-left: 5px;
  transition: all 1s !important;
  margin-top: 10px !important;
}

.modal_safe_bill_label_category_active {
  color: var(--mono-black, #1a1a1a);
}

.modal_safe_bill_label_category_disable {
  color: var(--mono-grey, #999);
}

@media only screen and (max-width: 950px) {
  .modal_safe_bill_div_all {
    position: fixed;
    border-top: 1px solid #000;
    border-radius: 0px 0px 10px 10px;
    margin-left: 5px;
    max-width: 80.5vw;
    max-height: 42vh;
    .modal_safe_bill_div_form {
      margin-left: -10px;
    }
    input,
    textarea {
      font-size: 15px;
    }
    .p-dropdown-trigger {
      width: 20px !important;
      margin-left: -20px !important;
    }
  }
}
</style>
