import { ref } from 'vue'

const usePaymentFilters = () => {
  const filters = ref<{ [key: string]: string | number | boolean | (string | number)[] }>({
    paying_type_ids: [],
    payment_type_ids: [],
    payment_status_ids: [],
    card_holder_ids: [],
    legal_ids: [],
    contragent_ids: [],
    purchase_id: [],
    price: '',
    debited_price: '',
    note: '',
    description: '',
    order_by: 'id',
    order_dir: 'desc',
    page: 1,
    per_page: 20
  })

  const wasRemoved = ref<boolean>(false)
  const setRemoved = (val: boolean) => {
    wasRemoved.value = val
  }
  const setPaymentFilters = (value: {
    val: string | number | (string | number)[] | boolean
    name: string
  }) => {
    filters.value[value.name] = value.val
  }
  const removePaymentFilters = () => {
    filters.value = {
      paying_type_ids: [],
      payment_type_ids: [],
      payment_status_ids: [],
      card_holder_ids: [],
      legal_ids: [],
      contragent_ids: [],
      purchase_id: '',
      price: '', 
      debited_price: '',
      note: '',
      description: '',
      order_by: 'id',
      order_dir: 'desc',
      page: 1,
      per_page: 20
    }
  }
  return { filters, setPaymentFilters, removePaymentFilters, wasRemoved, setRemoved }
}

export default usePaymentFilters()
