import { ref } from 'vue'

export interface IBudgetExp {
  id: number | string
  name: string
  max_sum: number | string
  is_default: boolean
}

const useBudgetExp = () => {
  const allBudgetExp = ref<IBudgetExp[]>()
  const selectedBudgetExp = ref()
  const setAllBudgetExp = (data: IBudgetExp[]) => {
    allBudgetExp.value = data
  }
  const setSelectedBudget = (data: IBudgetExp) => {
    selectedBudgetExp.value = data
  }
  return { allBudgetExp, selectedBudgetExp, setAllBudgetExp, setSelectedBudget }
}

export default useBudgetExp()
