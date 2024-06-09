import { ref } from 'vue'

export interface ICheckedCol {
  id: number
  name: string
  field: string
  active: boolean
}

const useCheckedColumn = () => {
  const checkedColumn = ref<ICheckedCol[]>([])
  const setCheckedColumn = (cols: ICheckedCol[]) => {
    checkedColumn.value = cols
  }
  return { checkedColumn, setCheckedColumn }
}

export default useCheckedColumn()
