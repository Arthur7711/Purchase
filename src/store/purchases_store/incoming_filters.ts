import { ref } from 'vue'

const useIncomingFilters = () => {
  const incomingFilters = ref<{ [key: string]: { id: string | number; name: string }[] }>({})

  const setIncomingFilters = (key: string, value: { id: string | number; name: string }[]) => {
    incomingFilters.value[key] = value
  }
  const removeFilters = () => {
    incomingFilters.value = {}
  }
  return {
    incomingFilters,
    setIncomingFilters,
    removeFilters
  }
}

export default useIncomingFilters()
