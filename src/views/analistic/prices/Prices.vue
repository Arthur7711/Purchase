<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { IPopular, ITypesDrop } from './types'
import Button from 'primevue/button'
import { ref, onMounted, watch } from 'vue'
import { getTypesDropdata, getPopular, getLatest } from '../../../api/gettersPrices'
import PopularGrid from '../../../components/populargrid/PopularGrid.vue'
import DropdownTypes from '../../../components/dropdown_prices/DropdownTypes.vue'
import useTypeId from '../../../store/typeId'
import useOfficeId from '../../../store/officeId'
import useDateFrom from '../../../store/dateFrom'
import useDateTo from '../../../store/dateTo'
import useNameAnalyt from '../../../store/nameAnalyt'
import AutoComplete from '@/components/autocomplete/AutoComplete.vue'
import ProgressSpinner from 'primevue/progressspinner'

const dropTypes = ref<ITypesDrop[]>([])
const error = ref('')
const isLoading = ref(false)
const selectedItem = ref<string>('')
const mostPopular = ref<IPopular[]>([])
const latestItem = ref<IPopular[]>([])
const disabled = ref<boolean>(false)
const nullError = () => {
  error.value = ''
}

const changeType = (value: string | number) => {
  useTypeId.setTypeId(value)
}

const selectItem = (position: string) => {
  selectedItem.value = position
}

const handleSetId = (id: number | string) => {
  useNameAnalyt.setItemId(id)
}

onMounted(() => {
  isLoading.value = true

  error.value = ''
  getTypesDropdata()
    .then((res) => {
      dropTypes.value = res.data
      useTypeId.setAllTypes(res.data)
    })
    .catch((err) => (error.value = err.message))
  getPopular({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    typeId: useTypeId.typeId.value ? useTypeId.typeId.value : undefined
  })
    .then((res) => (mostPopular.value = res.data))
    .catch((err) => (error.value = err.message))

  getLatest(useTypeId.typeId.value)
    .then((res) => (latestItem.value = res.data))
    .catch((err) => (error.value = err.message))
  isLoading.value = false 
})

watch(
  () => useNameAnalyt.itemId.value,
  () => {
    disabled.value = !!useNameAnalyt.itemId.value
  }
)
watch(
  () => [useOfficeId.officeId.value, useOfficeId.updatedRefer.value],
  () => {
    nullError()
    getTypesDropdata()
      .then((res) => (dropTypes.value = res.data))
      .catch((err) => (error.value = err.message))
  }
)

watch(
  () => [
    useOfficeId.officeId.value,
    useOfficeId.updatedRefer.value,
    useTypeId.typeId.value,
    useDateFrom.dateFrom.value,
    useDateTo.dateTo.value
  ],
  () => {
    nullError()
    getPopular({
      dateFrom: useDateFrom.dateFrom.value,
      dateTo: useDateTo.dateTo.value,
      typeId: useTypeId.typeId.value
    })
      .then((res) => (mostPopular.value = res.data))
      .catch((err) => (error.value = err.message))
    getLatest(useTypeId.typeId.value)
      .then((res) => (latestItem.value = res.data))
      .catch((err) => (error.value = err.message))
  }
)
</script>

<template>
  <div v-if="!error && dropTypes.length > 0" class="prices_div_all">
    <div>
      <div class="prices_div_top">
        <p class="prices_span">{{ $t('price change analysis') }}</p>
        <DropdownTypes @change-event="changeType" :drop-types="dropTypes">
          <template #icon>
            <img src="../../../components/icons/typeIcon.svg" alt="V" />
            <p>&nbsp;&nbsp;{{ $t('types_2') }}&nbsp;</p>
          </template>
        </DropdownTypes>
      </div>
      <AutoComplete @select="handleSetId" :selectedItem="selectedItem" />
      <Button
        v-if="disabled"
        @click="$router.push(`/analytics/prices/${useNameAnalyt.itemId.value}`)"
        class="button_search"
        :label="$t('search')"
      />
      <Button v-if="!disabled" disabled class="button_search" :label="$t('search')" />
    </div>
    <PopularGrid @selectItem="selectItem" :popular="mostPopular" :title="$t('popular items')" />
    <PopularGrid @selectItem="selectItem" :popular="latestItem" :title="$t('recent requests')" />
  </div>
  <div v-if="error">
    <h2>{{ error }}</h2>
  </div>
  <div v-if="isLoading || (dropTypes.length < 1 && !error)" class="prices_div_isload">
    <ProgressSpinner />
  </div>
</template>

<style lang="scss">
@import 'prices';
</style>
