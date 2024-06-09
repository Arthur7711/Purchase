import { ref } from 'vue'

export interface IUserDataInfo {
  id: number
  samaccountname: string
  displayname: string
  description: string
  location: {
    id: string | number
    office_id: string | number
    department: string
    office_shortname: string
    office_name: string
    currency: string
  }
  permissions: {
    control_nomenclature: boolean
    control_approve: boolean
    create_accepted_approve: boolean
    create_purchase: boolean
    edit_paid_purchase: boolean
    view_approves: boolean
    control_safes: boolean
  }
}

const useUserInfo = () => {
  const userCurrency = ref<string | number>('')
  const userData = ref<IUserDataInfo>()
  const controlNomenclature = ref<boolean>(false)
  const url = ref('')
  const id = ref(0)
  const setUserCurrency = (currency: string | number) => {
    userCurrency.value = currency
  }
  const setUserData = (data: IUserDataInfo) => {
    userData.value = data
  }
  const setControlNomenclature = (data: boolean) => {
    controlNomenclature.value = data
  }
  const setUrl = (value: string) => {
    url.value = value
  }
  const setId = (value: number) => {
    id.value = value
  }
  return {
    userCurrency,
    setUserCurrency,
    setUserData,
    userData,
    setControlNomenclature,
    controlNomenclature,
    setUrl,
    url,
    id,
    setId
  }
}

export default useUserInfo()
