import { ref } from 'vue'
import type { ITypesDrop } from '@/views/analistic/prices/types'

const useTypeId = () => {
  const typeId = ref()
  const checkedType = ref<ITypesDrop | null>(null)
  const allTypes = ref<ITypesDrop[]>([])
  const setTypeId = (id: number | string | undefined) => {
    typeId.value = id
  }
  const setCheckedType = (type: ITypesDrop | null) => {
    checkedType.value = type
  }
  const setAllTypes = (types: ITypesDrop[]) => {
    allTypes.value = types
  }
  return { typeId, setTypeId, checkedType, setCheckedType, allTypes, setAllTypes }
}

export default useTypeId()
