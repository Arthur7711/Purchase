<script lang="ts" setup>
import Dropdown from 'primevue/dropdown';
import { ref, watch, onMounted } from 'vue';
import DropdownIcon from '../icons/DropdownIcon.vue';
const isMounted = ref(false);
const props = defineProps<{
  dropTypes: any[];
  disable: boolean;
  defValue?: any;
}>();
const selectedType = ref();

const emit = defineEmits<{
  (e: 'change-event', value: string | number): void;
}>();

onMounted(() => {
  selectedType.value = props.dropTypes[0];
  emit('change-event', props.defValue ? props.defValue : 0);
});

watch(
  () => props.defValue,
  () => {
    selectedType.value = props.defValue
      ? props.dropTypes.filter((el) => el.id === props.defValue)[0]
      : props.dropTypes[0];
  }
);
</script>

<template>
  <Dropdown
    :disabled="disable === true ? true : false"
    class="exp_drop_leader_positions"
    :options="props.dropTypes"
    v-model="selectedType"
    placeholder=" "
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
      <div style="padding-left: 1%; margin-top: -2px" v-else>{{ $t('period') }}</div>
    </template>
  </Dropdown>
</template>

<style lang="scss">
@import './dropdownExp.scss';
</style>
