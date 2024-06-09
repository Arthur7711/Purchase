import type { ItemNameAnalyt } from '@/views/analistic/positionPage/types'
import { ref } from 'vue'

const useItemAnalyt = () => {
  const itemName = ref<ItemNameAnalyt>()
  const itemId = ref<number | string>()
  const setItemName = (data: ItemNameAnalyt) => {
    itemName.value = data
  }
  const setItemId = (id: string | number) => {
    itemId.value = id
  }
  return { itemName, setItemName, itemId, setItemId }
}

export default useItemAnalyt()
