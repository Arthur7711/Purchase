<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IPopular, IProduct } from '@/views/analistic/prices/types'
import useItemAnalyt from '../../store/nameAnalyt'

const props = defineProps<{
  popular: IPopular[]
  title: String
}>()

const setId = (id: string | number) => {
  useItemAnalyt.setItemId(id)
}
</script>
  
<template>
  <div>
    <h4 class="popular_names">{{ props.title }}</h4>
    <div class="popular_grid" v-if="props.popular.length > 0">
      <div
        @click="$router.push(`/analytics/prices/${pop.id}`)"
        class="popular_name"
        v-for="(pop, key) in props.popular"
        :key="key"
      >
        <div class="popular_grid_span" @click="setId(pop.id)">{{ pop.name }}</div>
      </div>
    </div>
    <div v-else>
      <h4 class="populargrid_h5_empty">список пока пуст =(</h4>
    </div>
  </div>
</template>

<style scoped>
@import './populargrid.scss';
</style>
