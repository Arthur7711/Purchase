<script setup lang="ts">
import AutoComplete from 'primevue/autocomplete'
import type { IProduct } from '@/views/analistic/prices/types'
import Search from '../../components/icons/Search.vue'
import { ref, watch } from 'vue'
import { getSearched, type IParamsSearched } from '@/api/gettersPrices'
import useTypeId from '../../store/typeId'
import useDateFrom from '../../store/dateFrom'
import useDateTo from '../../store/dateTo'

const props = defineProps({
  inputClassName: String,
  selectedItem: {
    type: String,
    required: true
  }
})

const value = ref<string>(props.selectedItem)
const items = ref<IProduct[]>([])

const searchedParams = ref<IParamsSearched>({
  dateFrom: useDateFrom.dateFrom.value,
  dateTo: useDateTo.dateTo.value,
  typeId: useTypeId.typeId.value,
  searchQuery: ''
})

watch(
  () => [useDateFrom.dateFrom.value, useTypeId.typeId.value, useDateTo.dateTo.value],
  () => {
    searchedParams.value.dateTo = useDateTo.dateTo.value
    searchedParams.value.dateFrom = useDateFrom.dateFrom.value
    searchedParams.value.typeId = useTypeId.typeId.value
  }
)

const search = () => {
  if (value.value.length > 1) {
    getSearched(searchedParams.value).then((res) => (items.value = res.data))
  }
}

watch(
  () => props.selectedItem,
  () => (value.value = props.selectedItem)
)

watch(
  () => value.value,
  () => {
    searchedParams.value = {
      ...searchedParams.value,
      searchQuery: value.value
    }
  }
)

const emit = defineEmits<{
  (e: 'select', value: any): void
}>()

const handleSelect = (e: any) => {
  value.value = e.value.name
  emit('select', e.value.id)
}
</script>

<template>
  <span class="p-input-icon-left">
    <Search class="search_icon" />
    <AutoComplete
      class="dropdown_search"
      v-model="value"
      :placeholder="$t('enter name')"
      :suggestions="items"
      @complete="search"
      @item-select="handleSelect"
    >
      <template #dropdownicon>
        <Search />
      </template>
      <template #option="{ option }">
        <div class="autocomplete_prices_option">
          <span class="autocomplete_prices_option_name">{{ option.name }}</span>
          <span class="autocomplete_prices_option_count"
            >{{ $t('items') }}:{{ option.items_count }}</span
          >
          <span class="autocomplete_prices_option_price"
            >{{ option.items_price_avg }}&#8381; {{ $t('average price') }}</span
          >
        </div>
      </template>
    </AutoComplete>
  </span>
</template>

<style lang="scss">
@import './autocomplete.scss';
</style>
