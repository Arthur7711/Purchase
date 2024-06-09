import { ref, watch } from 'vue'

const useSuccess = () => {
  const success = ref(false)
  const successText = ref('')
  const setSuccess = (err: boolean) => {
    success.value = err
  }
  const setSuccessText = (err: string) => {
    successText.value = err
  }
  return { success, setSuccess, setSuccessText, successText }
}

watch(useSuccess().success, () => {
  if (useSuccess().success.value) {
    setTimeout(() => {
      useSuccess().setSuccess(false)
    }, 3000)
  }
})
export default useSuccess()
