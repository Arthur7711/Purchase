import { ref } from 'vue'
import type { ITypesDataExp, ITypesExp } from './types_exp'



const useSubTypesExp = () => {
  const allSubTypesExp = ref<ITypesExp | null>(null)
  const selectedSubTypesExp = ref<ITypesDataExp[] | null>(null)
  const setAllSubTypesExp = (data: ITypesExp) => {
    allSubTypesExp.value = data
  }
  const setSelectedTypesExp = (data: ITypesDataExp[] | null) => {
    selectedSubTypesExp.value = data
  }
  return { allSubTypesExp, selectedSubTypesExp, setAllSubTypesExp, setSelectedTypesExp }
}

export default useSubTypesExp()
