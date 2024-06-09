<script setup lang="ts">
import type { IBalance, ISources } from '@/api/gettersSafe';
import DropdownDynamicLabel from '@/components/custom/DynamicLabelComponents/DropdownDynamicLabel.vue';
import InputLabel from '@/components/custom/DynamicLabelComponents/InputLabel.vue';
import TextareaDynamicLabelWithCounter from '@/components/custom/DynamicLabelComponents/TextareaDynamicLabelWithCounter.vue';
import { ref } from 'vue';
import { getCurrencySignName } from '@/helpers/currencySign';
import { postReserve } from '@/api/postsSafe';

const props = defineProps<{
  safe_account: IBalance;
}>();

const emit = defineEmits<{
  (e: 'update', value: boolean): void;
}>();

const formData = ref<{ amount: string; description: string }>({
  amount: '',
  description: ''
});

const handlePost = async () => {
  await postReserve({
    amount: formData.value.amount,
    description: formData.value.description,
    id: props.safe_account.id,
    safe_id: props.safe_account.safe_id
  });
  formData.value = {
    amount: '',
    description: ''
  };
  emit('update', true);
};
</script>

<template>
  <div class="modal_safe_add_div_all">
    <div class="modal_safe_add_div_form">
      <InputLabel
        style="width: 210px; padding-right: 5px"
        :show_hr="true"
        v-bind:model-value="formData.amount"
        :label="$t('amount')"
        :deb-timer="450"
        :input-type="'number'"
        @change="(val) => (formData.amount = val)"
      >
        <template #currency>
          <div class="modal_safe_add_money_currency_block">
            {{ getCurrencySignName(safe_account.currency) }}
          </div>
        </template>
      </InputLabel>
    </div>
    <div style="margin-top: 10px; width: 100%; z-index: 1010; position: relative">
      <TextareaDynamicLabelWithCounter
        :model-value="formData.description"
        :label="$t('description')"
        @change="(val) => (formData.description = val)"
        :resizeble="false"
        style="width: 104.5%"
      />
    </div>
    <button :disabled="!formData.amount" @click="handlePost" class="modal_safe_add_button_save">
      {{ $t('reserve') }}
    </button>
  </div>
</template>

<style lang="scss">
.modal_safe_add_div_all {
  display: flex;
  flex-direction: column;
}

.modal_safe_add_money_currency_block {
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
}

.modal_safe_add_div_form {
  display: flex;
  gap: 10px;
}

.modal_safe_add_button_save {
  width: 30%;
  margin-top: 16px;
  border: none;
  display: flex;
  padding: 7px 20px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  align-self: stretch;
  border-radius: 10px;
  color: white;
  transition: all 0.4s ease-in;
  &:not(:disabled) {
    background: var(--blue, #1565c0);
  }
  &:disabled {
    background: var(--blue, #1565c077);
    cursor: no-drop;
  }
}
</style>
