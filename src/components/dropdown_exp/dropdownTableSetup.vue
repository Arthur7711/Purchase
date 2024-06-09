<script lang="ts" setup>
import Dropdown from 'primevue/dropdown'
import { ref, watch, onMounted } from 'vue'
import DropdownIcon from '../icons/DropdownIcon.vue'

const props = defineProps<{
  dropTypes: any[]
}>()

const selectedType = ref()
const emit = defineEmits<{
  (e: 'change-event', value: string | number): void
}>()
</script>

<template>
  <Dropdown
    class="exp_drop_leader_positions"
    :options="props.dropTypes"
    v-model="selectedType"
    placeholder="Select a City"
    @change="$emit('change-event', selectedType.id)"
    optionLabel="title"
  >
    <template #dropdownicon>
      <DropdownIcon />
    </template>
    <template #value="{ value }">
      <div v-if="selectedType" style="text-align: right">
        <p style="font-size: 14px; font-weight: 400; max-width: 100px">
          {{ value.title }}
        </p>
      </div>
      <div v-else>период</div>
    </template>
  </Dropdown>
</template>

<style lang="scss">
@import './dropdownExp.scss';
</style>
