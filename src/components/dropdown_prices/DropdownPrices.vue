<script lang="ts" setup>
import Dropdown from 'primevue/dropdown'
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  dropTypes: any[]
  defaultValue?: any
}>()

const selectedType = ref(0)
const active = ref(true)
onMounted(() => {
  if (props.defaultValue !== undefined) {
    selectedType.value = props.defaultValue
  }
})

watch(
  () => selectedType.value,
  () => {
    if (selectedType.value) {
      active.value = true
    } else if (!selectedType.value && Number(selectedType.value) !== 0) {
      active.value = false
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
      optionValue="id"
      class="dropdown_types"
      :class="active ? 'dropdown_types_active' : '1'"
    >
      <template #value v-if="selectedType.toString().length < 1">
        <div class="prices_div_types">
          <slot name="icon"> </slot>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<style lang="scss">
@import './dropdownPrices.scss';
</style>
