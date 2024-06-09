<script setup lang="ts">
import { ref } from 'vue'
import CustomDropdownContainer from '../../../components/customDropdownContainer/CustomDropdownContainer.vue'
import Dolly from '../../../components/icons/Dolly.vue'
import type { IUniqueNames } from '../types'

defineProps<{ sum: number; data: IUniqueNames[] }>()

const showChart = ref(false)
const url = import.meta.env.VITE_VUE_PROJECT
</script>
<template>
  <CustomDropdownContainer :is-open="showChart" @dropdown_control="showChart = $event">
    <template #head>
      <div>
        <p
          style="color: var(--vt-c-tabs-gray); font-size: 18px; font-weight: 600; line-height: 20px"
        >
          {{ $t('unique items') }}
        </p>
        <div style="display: flex; gap: 14px; align-items: center; margin-top: 10px">
          <Dolly />
          <p style="font-weight: 600; font-size: 28px; line-height: 30px">{{ sum }}</p>
        </div>
      </div>
    </template>
    <template #body>
      <div
        style="
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 250px;
          overflow-y: auto;
          padding: 0px 20px;
        "
      >
        <div
          v-for="info in data"
          style="display: flex; align-items: center; justify-content: space-between"
        >
          <a
            :href="`${url}#/analytics/prices/${info.id}`"
            target="_blank"
            style="color: var(--vt-c-electric-blue)"
            >{{ info.name }}</a
          >
          <p>{{ info.items_count }}</p>
        </div>
      </div>
    </template>
  </CustomDropdownContainer>
</template>
<style scoped lang="scss"></style>
