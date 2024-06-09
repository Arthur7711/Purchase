import { ref } from 'vue'

const useOfficeId = () => {
  const officeId = ref()
  const updatedRefer = ref()
  const countryId = ref(0)
  const department = ref('')

  const setOfficeId = (id: number | string | undefined) => {
    officeId.value = id
  }
  const setUpdatedRefer = (id: number | string | undefined) => {
    updatedRefer.value = id
  }
  const setCountryId = (id: number) => {
    countryId.value = id
  }
  const setDepartament = (dep: string) => {
    department.value = dep
  }
  return {
    officeId,
    setOfficeId,
    updatedRefer,
    setUpdatedRefer,
    countryId,
    setCountryId,
    department,
    setDepartament
  }
}

export default useOfficeId()
