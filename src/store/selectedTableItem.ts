import { ref } from 'vue'

const useTableSelection = () => {
  const checkedIndex = ref('-2')
  const setCheckedIndex = (index: string) => {
    if (checkedIndex.value === index) {
      checkedIndex.value = '-'
    } else {
      checkedIndex.value = index
    }
  }
  return { checkedIndex, setCheckedIndex }
}

export default useTableSelection()
