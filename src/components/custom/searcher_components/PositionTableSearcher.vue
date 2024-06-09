<script lang="ts" setup>
import useIncomingFilters from '@/store/purchases_store/incoming_filters'
import SelectionSearchOptions from '@/components/custom/searcher_components/SelectionSearchOptions.vue'
import usePositionFilters from '@/store/purchases_store/positionsFilter'
import { ref, watch } from 'vue'
import MultiselectPurchTableSearch from './MultiselectPurchTableSearch.vue'

const filters = ref(useIncomingFilters.incomingFilters.value)

watch(
  () => useIncomingFilters.incomingFilters.value,
  () => {
    filters.value = useIncomingFilters.incomingFilters.value
  }
)

const handleChange = (val: (string | number)[], name: string) => {
  usePositionFilters.setPositionsFilters({ val: val, name: name })
}
</script>

<template>
  <div style="display: flex; flex-direction: row; gap: 40px; margin-left: 0vw; margin-top: 36px">
    <SelectionSearchOptions
      :name="$t('item status_2')"
      :options="filters.product_statuses"
      @change="(val) => handleChange(val, 'product_status_ids')"
      :incoming_selected="(usePositionFilters.filters.value['product_status_ids'] as Array<(string | number)>)"
      :filter_name="'product_status_ids'"
    />
    <SelectionSearchOptions
      :name="$t('approval')"
      :options="filters.approve_statuses"
      @change="(val) => handleChange(val, 'approve_statuses')"
      :incoming_selected="(usePositionFilters.filters.value['approve_statuses'] as Array<(string | number)>)"
      :filter_name="'approve_statuses'"
    />
    <SelectionSearchOptions
      :name="$t('priority')"
      :options="filters.priority"
      @change="(val) => handleChange(val, 'priority_ids')"
      :incoming_selected="(usePositionFilters.filters.value['priority'] as Array<(string | number)>)"
      :filter_name="'priority'"
    />
    <SelectionSearchOptions
      :name="$t('budget')"
      :options="filters.budget_ids"
      @change="(val) => handleChange(val, 'budget_ids')"
      :incoming_selected="(usePositionFilters.filters.value['budget_ids'] as Array<(string | number)>)"
      :filter_name="'priority'"
    />
    <div>
      <MultiselectPurchTableSearch
        :options="filters.purpose_ids"
        :placeholder="$t('purpose')"
        @change="(val) => handleChange(val, 'purpose_ids')"
        @select_all="(val) => handleChange(val, 'purpose_ids')"
        :incoming_selected="(usePositionFilters.filters.value['purpose_ids'] as Array<(string | number)>)"
      />
      <MultiselectPurchTableSearch
        style="margin-top: 16px"
        :options="filters.type_ids"
        :placeholder="$t('type')"
        @change="(val) => handleChange(val, 'type_ids')"
        @select_all="(val) => handleChange(val, 'type_ids')"
        :incoming_selected="(usePositionFilters.filters.value['type_ids'] as Array<(string | number)>)"
      />
      <MultiselectPurchTableSearch
        style="margin-top: 16px"
        :options="filters.subtype_ids"
        :placeholder="$t('subtype')"
        @change="(val) => handleChange(val, 'subtype_ids')"
        @select_all="(val) => handleChange(val, 'subtype_ids')"
        :incoming_selected="(usePositionFilters.filters.value['subtype_ids'] as Array<(string | number)>)"
      />
      <button
        @click="
          () => {
            usePositionFilters.removePositionsFilters()
            $emit('clear', '')
          }
        "
        class="purchtable_search_button_clear"
      >
        {{ $t('reset') }}
      </button>
    </div>
  </div>
</template>    

<style lang="scss">     
.purchtable_search_button_clear {
  background: none;
  border: none;
  color: #1565c0;
  margin-top: 16px;
}
</style>
    