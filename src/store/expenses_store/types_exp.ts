import { ref } from 'vue'

export interface ITypesDataExp {
  aux_price_sum: number | string
  id: number | string
  name: string
  price_sum: string | number
}

export interface ITypesExp {
  data: ITypesDataExp[]
  total: number | string
}

const useTypesExp = () => {
  const allTypesExp = ref<ITypesExp | null>(null)
  const selectedTypesExp = ref<ITypesDataExp[] | null>(null)
  const setAllTypesExp = (data: ITypesExp) => {
    allTypesExp.value = data
  }
  const setSelectedTypesExp = (data: ITypesDataExp[] | null) => {
    selectedTypesExp.value = data
  }
  return { allTypesExp, selectedTypesExp, setAllTypesExp, setSelectedTypesExp }
}

export default useTypesExp()
