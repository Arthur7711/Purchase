import type { IBalance, IParamsBalance } from '@/api/gettersSafe'
import { ref } from 'vue'

const useSafeFilters = () => {
  const filters = ref<IParamsBalance>({
    safe_id: '',
    id: '',
    date_from: '',
    date_to: '',
    amount: '',
    description: '',
    entity_type: '',
    entity_id: '',
    page: 1,
    columns: [''],
    per_page: 20,
    order_dir: 'desc' 
  })
  const setFilters = <T extends keyof IParamsBalance, U extends IParamsBalance[T]>(
    name: T,
    value: U
  ) => {
    filters.value[name] = value
  }
  const removeFilters = () => {
    filters.value = {
      safe_id: '',
      id: '',
      date_from: '',
      date_to: '',
      amount: '',
      description: '',
      entity_type: '',
      entity_id: '',
      page: 1,
      columns: [''],
      per_page: 20,
      order_dir: 'desc'
    }
  }
  return { filters, setFilters, removeFilters }
}

export default useSafeFilters()
