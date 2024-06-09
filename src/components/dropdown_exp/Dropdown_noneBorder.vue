<script lang="ts" setup>
import Dropdown from 'primevue/dropdown';
import { ref, watch, onMounted } from 'vue';
import DropdownIcon from '../icons/DropdownIcon.vue';
import ScreenParams from '@/store/screen';

const props = defineProps<{
  dropTypes: any[];
}>();

const selectedType = ref(props.dropTypes[0]);
const emit = defineEmits<{
  (e: 'change-event', value: string | number): void;
}>();

watch(
  () => selectedType.value,
  () => {
    emit('change-event', selectedType.value.id);
  }
);
</script>

<template>
  <Dropdown
    class="exp_drop_leader_positions"
    :options="props.dropTypes"
    v-model="selectedType"
    optionLabel="title"
  >
    <template #dropdownicon>
      <DropdownIcon />
    </template>
    <template #value="{ value }">
      <div v-if="ScreenParams.screenParams.width > 650" style="text-align: right">
        <p
          v-for="(text, i) in value.title.toString().split(' ')"
          :key="i"
          style="font-size: 14px; font-weight: 400; max-width: 100px"
        >
          {{ text }}
        </p>
      </div>
      <div v-else>
        {{ value.title }}
      </div>
    </template>
  </Dropdown>
</template>

<style lang="scss">
@import './dropdownExp.scss';
</style>
