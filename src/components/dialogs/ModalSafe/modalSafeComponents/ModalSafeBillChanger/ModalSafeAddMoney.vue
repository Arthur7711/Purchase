<script setup lang="ts">
import type { IBalance, ISources } from '@/api/gettersSafe';
import DropdownDynamicLabel from '@/components/custom/DynamicLabelComponents/DropdownDynamicLabel.vue';
import InputLabel from '@/components/custom/DynamicLabelComponents/InputLabel.vue';
import TextareaDynamicLabelWithCounter from '@/components/custom/DynamicLabelComponents/TextareaDynamicLabelWithCounter.vue';
import { ref } from 'vue';
import { postIncomeSources, postNewAdd } from '@/api/postsSafe';
import { getCurrencySignName } from '@/helpers/currencySign';

const props = defineProps<{
  income_sources: ISources[] | null;
  safe_account: IBalance;
}>();

const emit = defineEmits<{
  (e: 'update', value: boolean): void;
}>();

const formData = ref<{ amount: string; entity_id: number | string; description: string }>({
  amount: '',
  entity_id: '',
  description: ''
});

const newEntity = ref('');

const handlePostNewAdd = async () => {
  if (!formData.value.entity_id) {
    await postIncomeSources({ name: newEntity.value, safe_id: props.safe_account.safe_id }).then(
      (res) => (formData.value.entity_id = res.data.id)
    );
  }
  await postNewAdd({
    id: props.safe_account.id,
    safe_id: props.safe_account.safe_id,
    amount: formData.value.amount,
    entity_id: formData.value.entity_id,
    description: formData.value.description ? formData.value.description : undefined
  });
  emit('update', true);
  formData.value = {
    amount: '',
    entity_id: '',
    description: ''
  };
};

const handleChange = (val: string | { id: string | number; name: string }) => {
  if (typeof val === 'string') {
    newEntity.value = val;
  } else {
    formData.value.entity_id = val.id;
  }
};
</script>

<template>
  <div class="modal_safe_add_div_all">
    <div class="modal_safe_add_div_form">
      <InputLabel
        style="width: 210px; padding-right: 5px"
        :show_hr="true"
        :label="$t('amount')"
        :model-value="formData.amount"
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
      <DropdownDynamicLabel
        :editable="true"
        v-if="income_sources"
        :label="$t('source')"
        :options="income_sources"
        @change="handleChange"
        :model-value="formData.entity_id"
      />
    </div>
    <div style="margin-top: 10px; width: 100%; z-index: 1010; position: relative">
      <TextareaDynamicLabelWithCounter
        :label="$t('description')"
        :model-value="formData.description"
        @change="(val) => (formData.description = val)"
        :resizeble="false"
        style="width: 104.5%"
      />
    </div>
    <button
      :disabled="
        !(formData.amount && (formData.entity_id || formData.entity_id === 0 || newEntity))
      "
      @click="handlePostNewAdd"
      class="modal_safe_add_button_save"
    >
      {{ $t('replenish') }}
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

@media screen and (max-width: 650px) {
  .modal_safe_add_button_save {
    width: 30vw !important;
  }
}
</style>
