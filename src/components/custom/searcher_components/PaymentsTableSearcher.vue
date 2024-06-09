<script lang="ts" setup>
import useUserInfo from '@/store/user'
import useIncomingFilters from '@/store/purchases_store/incoming_filters'
import SelectionSearchOptions from '@/components/custom/searcher_components/SelectionSearchOptions.vue'
import usePaymentsFilters from '@/store/payments_store/paymentsFilter'
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
  usePaymentsFilters.setPaymentFilters({ val: val, name: name })
}
</script>

<template>
  <div style="display: flex; flex-direction: row; gap: 40px; margin-left: 0vw; margin-top: 36px">
    <SelectionSearchOptions
      :name="$t('payment status')"
      :options="filters.payment_status_ids"
      @change="(val) => handleChange(val, 'payment_status_ids')"
      :incoming_selected="(usePaymentsFilters?.filters?.value['payment_status_ids'] as Array<(string | number)>)"
      :filter_name="'payment_status_ids'"
    />
    <SelectionSearchOptions
      :name="$t('payment type')"
      :options="filters.payment_type_ids"
      @change="(val) => handleChange(val, 'payment_type_ids')"
      :incoming_selected="(usePaymentsFilters.filters.value['payment_type_ids'] as Array<(string | number)>)"
      :filter_name="'payment_type_ids'"
    />
    <SelectionSearchOptions
      :name="$t('payment method')"
      :options="filters.paying_types"
      @change="(val) => handleChange(val, 'paying_type_ids')"
      :incoming_selected="(usePaymentsFilters.filters.value['paying_types'] as Array<(string | number)>)"
      :filter_name="'paying_type_ids'"
    />
    <SelectionSearchOptions
      v-if="useUserInfo.userData.value?.location.office_name === 'Yerevan'"
      :name="$t('legal entity')"
      :options="filters.legal_ids"
      @change="(val) => handleChange(val, 'legal_ids')"
      :incoming_selected="(usePaymentsFilters.filters.value['legal_ids'] as Array<(string | number)>)"
      :filter_name="'legal_ids'"
    />

    <div>
      <MultiselectPurchTableSearch
        :options="filters.contragent_ids"
        :placeholder="$t('supplier')"
        @change="(val) => handleChange(val, 'contragent_ids')"
        @select_all="(val) => handleChange(val, 'contragent_ids')"
        :incoming_selected="(usePaymentsFilters.filters.value['contragent_ids'] as Array<(string | number)>)"
      />
      <MultiselectPurchTableSearch
        style="margin-top: 16px"
        :options="filters.card_holder_ids"
        :placeholder="$t('cardholder')"
        @change="(val) => handleChange(val, 'card_holder_ids')"
        @select_all="(val) => handleChange(val, 'card_holder_ids')"
        :incoming_selected="(usePaymentsFilters.filters.value['card_holder_ids'] as Array<(string | number)>)"
      />
      <button
        @click="
          () => {
            usePaymentsFilters.removePaymentFilters()
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
