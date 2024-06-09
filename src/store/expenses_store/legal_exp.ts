import { ref } from 'vue'

export interface ILegalExp {
  id: number | string 
  name: string
  office_id: number | string
  is_default: boolean
}

const useBudgetExp = () => {
  const allLegalExp = ref<ILegalExp[] | null>(null)
  const selectedLegalExp = ref()
  const setAllLegalExp = (data: ILegalExp[]) => {
    allLegalExp.value = data
  }
  const setSelectedLegal = (data: number | string) => {
    selectedLegalExp.value = data
  }
  return { allLegalExp, selectedLegalExp, setAllLegalExp, setSelectedLegal }
}

export default useBudgetExp()
