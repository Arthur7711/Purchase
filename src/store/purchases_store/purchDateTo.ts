import { ref } from 'vue'

const usePurchDateTo = () => {
  const dateTo = ref('')
  const setDateTo = (date: string) => {
    dateTo.value = date
  }
  return { dateTo, setDateTo }
}

export default usePurchDateTo()
