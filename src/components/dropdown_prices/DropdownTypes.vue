<script lang="ts" setup>
import Dropdown from 'primevue/dropdown'
import { ref, watch, onMounted } from 'vue'
import useTypeId from '../../store/typeId'

const selectedType = ref('')
const active = ref(false)
onMounted(() => {
  if (useTypeId.typeId.value) {
    selectedType.value = useTypeId.typeId.value
  }
})

const clearType = () => {
  useTypeId.setTypeId(undefined)
  selectedType.value = ''
  active.value = false
}

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
      v-if="useTypeId.allTypes.value"
      v-model="selectedType"
      @change="$emit('change-event', selectedType)"
      :options="useTypeId.allTypes.value"
      optionLabel="name"
      optionValue="id"
      class="dropdown_types"
      :class="active ? 'dropdown_types_active' : '1'"
    >
      <template #value v-if="selectedType.length < 1">
        <div class="prices_div_types">
          <slot name="icon"> </slot>
        </div>
      </template>
    </Dropdown>
    <button @click="clearType" class="button_clear_types">X</button>
  </div>
</template>

<style lang="scss">
@import './dropdownPrices.scss';
</style>
