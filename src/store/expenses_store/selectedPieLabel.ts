import { ref } from 'vue'

const useSelectedPieLabelExp = () => {
  const selectedLabel = ref<number | null>(null)
  const setSelectedLabel = (label: number | null) => {
    selectedLabel.value = label
  }
  return { selectedLabel, setSelectedLabel }
}

export default useSelectedPieLabelExp()
