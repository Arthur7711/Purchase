<script lang="ts" setup>
import MultiSelect from 'primevue/multiselect';
import { ref, watch } from 'vue';
import BankImage from '../variableCommons/bankImage.vue';
import { debounce } from '@/helpers/debounse';
const props = defineProps<{
  options: { id: string | number; name: string }[];
  placeholder: string;
  incoming_selected?: (string | number)[];
}>();

const emit = defineEmits<{
  (e: string, val: (string | number)[]): void;
}>();

const selectedOptions = ref<{ id: string | number; name: string }[]>([]);

const handleSelect = () => {
  if (JSON.stringify(selectedOptions.value) === JSON.stringify(props.options)) {
    selectedOptions.value = [];
  } else {
    selectedOptions.value = props.options;
  }
  emit(
    'select_all',
    selectedOptions.value.map((el) => el.id)
  );
};

const debHandleSelect = debounce(function () {
  emit(
    'change',
    selectedOptions.value.map((el) => el.id)
  );
}, 2000);

watch(
  () => props.options,
  () => {
    if (props.incoming_selected && props.incoming_selected.length) {
      const res: { id: string | number; name: string }[] = [];
      props.options?.forEach((el) => {
        if (props.incoming_selected?.includes(el.id.toString())) {
          res.push(el);
        }
      });
      selectedOptions.value = res;
    } else {
      selectedOptions.value = [];
    }
  }
);

watch(
  () => props.incoming_selected,
  () => {
    if (props.incoming_selected && props.incoming_selected.length) {
      const res: { id: string | number; name: string }[] = [];
      props.options?.forEach((el) => {
        if (props.incoming_selected?.includes(el.id)) {
          res.push(el);
        }
      });
      selectedOptions.value = res;
    } else {
      selectedOptions.value = [];
    }
  }
);
</script>

<template>
  <div class="multiselect_table_search_div_all">
    <MultiSelect
      style="width: 232px"
      :options="options"
      :showToggleAll="false"
      :panelClass="'multiselect_table_search_multiselect'"
      v-model="selectedOptions"
      :placeholder="placeholder"
      @change="debHandleSelect"
    >
      <template #option="{ option }">
        <div
          style="display: flex; justify-content: center; align-items: center; margin-left: -15px"
        >
          <BankImage v-if="option?.bank_id" :bankName="option.bank_id" />{{ option.name }}
        </div></template
      >
      <template v-if="selectedOptions.length" #value="{ value }">
        <div class="multiselect_table_search_div_all_value">
          {{ value[0].name }}
          <div v-if="value.length > 1" class="multiselect_table_search_div_value">
            {{ `+ ${selectedOptions.length - 1}` }}
          </div>
        </div>
      </template>
      <template #header>
        <div @click="handleSelect" style="margin: 10px; color: #1565c0; cursor: pointer">
          {{
            JSON.stringify(selectedOptions) === JSON.stringify(options)
              ? $t('take off all')
              : $t('Select All')
          }}
        </div>
      </template>
    </MultiSelect>
  </div>
</template>

<style lang="scss">
.multiselect_table_search_div_all {
  .p-multiselect:not(.p-disabled):hover {
    border-color: #f3f2f2;
  }
  .p-multiselect:not(.p-disabled) {
    border-radius: 10px !important;
    border-color: #e3e3e3;
  }
}
.multiselect_table_search_multiselect {
  .p-multiselect {
    border-radius: 10px !important;
  }
  .p-multiselect:hover {
    border-color: #e3e3e3 !important;
  }
  .p-multiselect-header {
    background-color: #fff;
    border: none;
    .p-checkbox {
      ::after {
        content: 'выбрать все';
        opacity: 1;
        color: #1565c0;
        margin-left: 120px;
        white-space: nowrap;
      }
    }
  }
  .p-multiselect-items,
  .p-component {
    :hover {
      background-color: #1565c0 !important;
      color: #fff !important;
    }
    .p-multiselect-item {
      background: #fff !important;
      margin-top: 4px;
      border-radius: 7px;
      height: 34px;
      &:hover {
        background: #1565c0 !important;
      }
      .p-checkbox {
        display: none !important;
      }
    }
  }
  .p-multiselect-items-wrapper {
    padding-left: 5px;
    padding-right: 5px;
  }
  .p-multiselect-item.p-highlight {
    color: black !important;
    background: #dcdcdc !important;
    &:hover {
      background: #1565c0 !important;
      color: white !important;
    }
  }
}

.multiselect_table_search_div_all_value {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.multiselect_table_search_div_value {
  display: flex;
  padding: 1px 5px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 15px;
  color: white;
  background-color: #999999;
  max-width: min-content;
}
</style>
