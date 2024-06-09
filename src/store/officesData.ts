import { ref } from 'vue'

export interface Location {
  id: number
  office_id: number
  department: string
  office_shortname: string
  office_name: string
  currency: string
  country_id: number
}

interface Office {
  id: number
  name: string
  shortname: string
  locations: Location[]
}

const useOffices = () => {
  const offices = ref<Office[] | null>(null)
  const selectedOffice = ref<Location | null>(null)
  const setOffices = (data: Office[]) => {
    offices.value = data
  }
  const setSelectedOffice = (val: Location) => {
    selectedOffice.value = val
  }
  return { offices, setOffices, setSelectedOffice, selectedOffice }
}

export default useOffices()
