import { ref } from 'vue'

const useOfficesPurposes = () => {
  const selectedPurposes = ref<string[] | null>(null)
  const selectedOffices = ref<number[] | null>(null)
  const setSelectedPurposes = (val: string[] | null) => {
    selectedPurposes.value = val
  }
  const setSelectedOffices = (val: number[] | null) => {
    selectedOffices.value = val
  }
  return { selectedPurposes, setSelectedPurposes, selectedOffices, setSelectedOffices }
}

export default useOfficesPurposes()
