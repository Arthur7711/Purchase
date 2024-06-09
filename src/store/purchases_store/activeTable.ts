import { ref } from 'vue'

const useActiveTable = () => {
  const activeTable = ref('purchase')

  const setActiveTable = (value: string) => {
    activeTable.value = value
  }

  return {
    activeTable,
    setActiveTable
  }
}

export default useActiveTable()
