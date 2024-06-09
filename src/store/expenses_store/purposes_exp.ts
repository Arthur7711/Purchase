import { ref } from 'vue'
import type { ITypesDataExp, ITypesExp } from './types_exp'

const usePurposesExp = () => {
  const allPurposesExp = ref<ITypesExp | null>(null)
  const selectedPurposesExp = ref<ITypesDataExp[] | null>(null)
  const isMounted = ref(false)
  const setAllPurposesExp = (data: ITypesExp) => {
    allPurposesExp.value = data
  } 
  const setSelectedTypesExp = (data: ITypesDataExp[]) => { 
    selectedPurposesExp.value = data
  }
  const setIsmounted =(val:boolean) => {
    isMounted.value = val
  }
  return { allPurposesExp, selectedPurposesExp, setAllPurposesExp, setSelectedTypesExp, isMounted,setIsmounted }
}

export default usePurposesExp()
