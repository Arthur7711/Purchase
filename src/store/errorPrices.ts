import { ref } from 'vue'

const useError = () => {
  const error = ref('')
  const setError = (err: string) => {
    error.value = err
  }
  return { error, setError }
}

export default useError()
