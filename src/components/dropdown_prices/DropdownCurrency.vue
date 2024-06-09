<script lang="ts" setup>
import Dropdown from 'primevue/dropdown'
import { onMounted, ref, watch } from 'vue'
import useUserInfo from '../../store/user'
const props = defineProps<{
  dropTypes: any[]
  defaultValue?: string
}>()

const selectedType = ref(0)
const active = ref(true)
const options = ref(props.dropTypes)
const emit = defineEmits<{
  (e: 'change-event', curr: string | number): void
}>()

onMounted(() => {
  selectedType.value = 0
  emit('change-event', selectedType.value)
})

watch(
  () => [props.dropTypes],
  () => {
    options.value = props.dropTypes
    selectedType.value = 0
    emit('change-event', selectedType.value)
  }
)

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
      v-if="props.dropTypes"
      v-model="selectedType"
      @change="$emit('change-event', selectedType)"
      :options="options"
      optionLabel="title"
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
