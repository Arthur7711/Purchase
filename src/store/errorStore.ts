import { ref } from 'vue'

const useError = () => {
  const error = ref<string | null>(null)
  const setError = (err: string | null) => {
    error.value = err
    setTimeout(() => {
      error.value = null
    }, 3500)
  }
  return { error, setError }
}

export default useError()
