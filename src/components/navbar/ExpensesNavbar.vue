<script lang="ts" setup>
import ListboxExpenses from '../Listboxes/ListboxExpenses.vue';
import useTypesExp, { type ITypesDataExp } from '../../store/expenses_store/types_exp';
import useSubTypesExp from '../../store/expenses_store/sub_types_exp';
import usePurposesExp from '../../store/expenses_store/purposes_exp';
import usePieColors from '../../store/expenses_store/pieChartsDatasets';
import { ref, watch } from 'vue';
import usePieCashe from '../../store/expenses_store/pieCache';
import i18n_config from '@/locales/i18n_config';
import { useRoute } from 'vue-router';
const { messages, locale } = i18n_config.global;
const route = useRoute();
const firstRender = ref(true);
const changePuprose = (purp: ITypesDataExp[]) => {
  if (purp.length) {
    usePurposesExp.setSelectedTypesExp(purp);
  }
};
const savePurposes = ref<string[]>();
const emittedValueFiller = () => {
  const result = [];
  if (route.query?.purposes && !savePurposes.value) {
    result[0] = (route.query.purposes as string).split(',');
  } else {
    result[0] = '';
  }
  if (route.query?.types) {
    result[1] = (route.query.types as string).split(',');
  } else {
    result[1] = '';
  }
  if (route.query?.subtypes) {
    result[2] = (route.query.subtypes as string).split(',');
  } else {
    result[2] = '';
  }
  return result;
};
const emittedValue = ref<(string | string[])[]>(emittedValueFiller());
const changeTypes = (types: ITypesDataExp[]) => {
  useTypesExp.setSelectedTypesExp(types);
};

const changeSubtypes = (sub: ITypesDataExp[]) => {
  useSubTypesExp.setSelectedTypesExp(sub);
};
watch(
  () => route,
  () => {
    emittedValueFiller();
  },
  { deep: true }
);
const purpColorset = (val: string) => {
  usePieColors.setColorsPurp(val);
};
const typeColorset = (val: string) => {
  usePieColors.setColorsType(val);
};
const subtypeColorset = (val: string) => {
  usePieColors.setColorsSubType(val);
};

watch(
  () => usePieCashe.pieCashe.value.length,
  () => {
    switch (usePieCashe.pieCashe.value.length) {
      case 1:
        emittedValue.value[0] = savePurposes.value as string[];
        savePurposes.value = undefined;
        emittedValue.value[1] = '';
        useTypesExp.setSelectedTypesExp(null);
        useSubTypesExp.setSelectedTypesExp(null);

        break;
      case 2:
        savePurposes.value = (route.query.purposes as string).split(',');
        emittedValue.value[0] = usePieCashe.pieCashe.value[1]
          .split(' ')
          .filter((el) => el !== '' && el !== messages[locale]['purpose'] && el !== '-')
          .join(' ');
        emittedValue.value[1] = '';
        useSubTypesExp.setSelectedTypesExp(null);
        break;
      case 3:
        emittedValue.value[1] = usePieCashe.pieCashe.value[2]
          .split(' ')
          .filter((el) => el !== '' && el !== messages[locale]['type'] && el !== '-')
          .join(' ');
        break;
      default:
        break;
    }
  }
);
</script>

<template>
  <div class="expenses_navbar_listbox_div">
    <ListboxExpenses
      @select="
        (val) => {
          changePuprose(val);
        }
      "
      :firs-render="firstRender"
      @colorset="purpColorset"
      :query="route.query?.purposes ? (route.query?.purposes as string).split(',') : undefined"
      v-if="usePurposesExp.allPurposesExp.value?.data.length"
      :title="
        usePieCashe.pieCashe.value.length === 1
          ? { title: messages[locale]['goals'], aux_title: 'active' }
          : { title: messages[locale]['goals'], aux_title: '' }
      "
      :emitted-value="emittedValue[0]"
      :options="usePurposesExp.allPurposesExp.value"
    />
    <ListboxExpenses
      @select="changeTypes"
      :firs-render="firstRender"
      @colorset="typeColorset"
      :query="route.query?.types ? (route.query?.types as string).split(',') : undefined"
      :title="
        usePieCashe.pieCashe.value.length === 2
          ? { title: messages[locale]['types_2'], aux_title: 'active' }
          : { title: messages[locale]['types_2'], aux_title: '' }
      "
      :emitted-value="emittedValue[1]"
      v-if="useTypesExp.allTypesExp.value && usePurposesExp.selectedPurposesExp.value?.length"
      :options="useTypesExp.allTypesExp.value"
    />
    <ListboxExpenses
      @select="
        (val) => {
          changeSubtypes(val);
          firstRender = false;
        }
      "
      @colorset="subtypeColorset"
      :firs-render="firstRender"
      :query="route.query?.subtypes ? (route.query?.subtypes as string).split(',') : undefined"
      :title="
        usePieCashe.pieCashe.value.length === 3
          ? { title: messages[locale]['subtypes_2'], aux_title: 'active' }
          : { title: messages[locale]['subtypes_2'], aux_title: '' }
      "
      v-if="
        useSubTypesExp.allSubTypesExp.value?.data.length &&
        usePurposesExp.selectedPurposesExp.value?.length &&
        useTypesExp.selectedTypesExp.value?.length
      "
      :emitted-value="emittedValue[2]"
      :options="useSubTypesExp.allSubTypesExp.value"
    />
  </div>
  <hr class="exp_navbar_hr_ground" />
</template>

<style>
@import './expensesNav.scss';
</style>
