<script lang="ts" setup>
import Dropdown from 'primevue/dropdown'
import { ref, watch, onMounted } from 'vue'
import usePieCache from '../../store/expenses_store/pieCache'

const props = defineProps<{
  dropTypes: any[]
  defaultValue?: string
}>()

const selectedType = ref('purposes')
const active = ref(false)
onMounted(() => { 
  if (props.defaultValue !== undefined) {
    selectedType.value = props.defaultValue
  }
})

watch(
  () => usePieCache.pieCashe.value.length,
  () => {
    if (usePieCache.pieCashe.value.length === 1) {
      selectedType.value = 'purposes'
    } else if (usePieCache.pieCashe.value.length === 2) {
      selectedType.value = 'types'
    } else if (usePieCache.pieCashe.value.length === 3) {
      selectedType.value = 'subtypes'
    }
  }
)
</script>

<template>
  <div class="dropprices_div_all">
    <Dropdown
      v-if="dropTypes"
      v-model="selectedType"
      @change="$emit('change-event', selectedType)"
      :options="props.dropTypes"
      optionLabel="name"
      optionValue="title"
      class="dropdown_types disable_drop_exp_types"
      :class="active ? 'dropdown_types_active' : '1'"
    >
      <template #value>
        <div class="prices_div_types">
          <slot name="icon"> </slot>&nbsp;
          {{ props.dropTypes.filter((el) => el.title === selectedType)[0].name }}
        </div>
      </template>
      <template #option="{ option }"> {{ option.name.split(' ')[1] }}</template>
    </Dropdown>
  </div>
</template>

<style lang="scss">
@import './dropdownExp.scss';
</style>
