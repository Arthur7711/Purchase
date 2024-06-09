import { ref } from 'vue'

const useCheckedName = () => {
  const checkedName = ref('')
  const setCheckedName = (name: string) => {
    checkedName.value = name
  }
  return { checkedName, setCheckedName }
}

export default useCheckedName()
