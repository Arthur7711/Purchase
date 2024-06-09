<script lang="ts" setup>
import Dropdown from 'primevue/dropdown';
import { ref, watch, onMounted } from 'vue';
import type { IBudgetExp } from '../../store/expenses_store/budget_exp';
import i18n_config from '@/locales/i18n_config';

const props = defineProps<{
  dropTypes: IBudgetExp[];
  defaultValue?: string;
}>();
const { messages, locale } = i18n_config.global;
const selectedType = ref<string | undefined>();
const active = ref(false);
const options = ref([
  {
    id: null,
    name: messages[locale]['budgets: all'],
    max_sum: null,
    office_id: null,
    is_default: false
  },
  ...props.dropTypes
]);
const emit = defineEmits<{
  (e: 'change-event', value: any): void;
}>();

const clearTypes = () => {
  selectedType.value = undefined;
  active.value = false;
  emit('change-event', selectedType.value);
};

watch(
  () => props.dropTypes,
  () =>
    (options.value = [
      {
        id: null,
        name: messages[locale]['budgets: all'],
        max_sum: null,
        office_id: null,
        is_default: false
      },
      ...props.dropTypes
    ])
);

onMounted(() => {
  if (props.defaultValue !== undefined) {
    selectedType.value = props.defaultValue;
  }
});

watch(
  () => selectedType.value,
  () => {
    if (selectedType.value) {
      active.value = true;
    } else if (
      (!selectedType.value && Number(selectedType.value) !== 0) ||
      selectedType.value === null
    ) {
      active.value = false;
    }
  }
);
</script>

<template>
  <div class="dropprices_div_all">
    <Dropdown
      v-if="dropTypes"
      v-model="selectedType"
      @change="$emit('change-event', selectedType)"
      :options="options"
      optionLabel="name"
      optionValue="id"
      class="dropdown_types"
      :class="active ? 'dropdown_types_active' : '1'"
    >
      <template #value v-if="!selectedType">
        <div class="prices_div_types">
          <slot name="icon"> </slot>
        </div>
      </template>
    </Dropdown>
    <!-- <button v-if="selectedType" class="drop_legal_button_clear" @click="clearTypes">X</button> -->
  </div>
</template>

<style lang="scss">
@import './dropdownExp.scss';
</style>
