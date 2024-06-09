<script lang="ts" setup>
import Dropdown from 'primevue/dropdown'
import { ref } from 'vue'
defineProps<{
  options: { id: string | number; name: string }[] | null
  placeholder: string
}>()
const selected_options = ref()
const emit = defineEmits<{
  (emit: 'change', value: { id: string | number; name: string }): void
}>()

const handleChange = () => {
  emit('change', selected_options.value)
}
</script>

<template>
  <div class="purchaser_filter_div_all">
    <Dropdown
      v-model="selected_options"
      v-if="options"
      showClear
      id="one"
      :options="options"
      optionLabel="name"
      :placeholder="placeholder"
      @change="handleChange"
    >
      <template #option="options">
        <div
          v-for="option in options"
          :key="option.id"
          class="purchfilter_div_option"
          :style="
            placeholder === $t('payment status')
              ? option.name === $t('for payment')
                ? { color: '#C2185B' }
                : option.name === $t('partially paid')
                ? { color: '#1565C0' }
                : option.name === $t('paid2')
                ? { color: '#689F38' }
                : ''
              : placeholder === $t('item status_2')
              ? option.name === $t('on approval')
                ? { color: '#C2185B' }
                : option.name === $t('In Purchase')
                ? { color: '#1565C0' }
                : option.name === $t('received')
                ? { color: '#689F38' }
                : option.name === $t('Canceled')
                ? { color: '#C62828' }
                : option.name === $t('deleted_2')
                ? { color: '#F57C00' }
                : ''
              : ''
          "
        >
          {{ option.name }}
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<style lang="scss">
@import './purchtable_filters.scss';
</style>
