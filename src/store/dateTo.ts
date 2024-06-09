import { ref } from 'vue'

const useDateTo = () => {
  const dateTo = ref('')
  const setDateTo = (date: string) => {
    dateTo.value = date
  }
  return { dateTo, setDateTo }
}

export default useDateTo()
