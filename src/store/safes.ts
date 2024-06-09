import { isAfter } from 'date-fns'
import { ref } from 'vue'

export interface IAccount {
  id: number
  safe_id: number
  currency: string
  balance: number
}

export interface ISafe {
  id: number
  name: string
  accounts: IAccount[]
}

export interface IAccounts extends IAccount {
  name: string
}

const useSafes = () => {
  const safes = ref<ISafe[]>([])

  const setSafes = (val: ISafe[]) => {
    safes.value = val
  }
  return { safes, setSafes }
}

export default useSafes()
