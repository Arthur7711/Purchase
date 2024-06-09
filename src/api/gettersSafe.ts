import { paramsValidator } from '@/helpers/paramsValitator'
import { API } from './API'

export interface ISources {
  id: string | number
  name: string
  is_system: boolean
}

export const getOutcomeSources = async () => {
  const { data } = await API.get<ISources[]>(`ref/outcome-sources`)
  return data
}

export const getIncomeSources = async (safe_id?: string | number) => {
  const { data } = await API.get<ISources[]>(`ref/income-sources`, {
    params: {
      safe_id: paramsValidator(safe_id)
    }
  })
  return data
}

export interface IBalance {
  id: string | number
  safe_id: string | number
  currency: string
  balance: number
  balance_wo_reserve: number
}

export const getBalance = async (safe_id: string | number, id: string | number) => {
  const { data } = await API.get<IBalance>(`safes/${safe_id ? safe_id + '/' : ''}accounts/${id}`)
  return data
}

interface Entity {
  id: number
  name: string
  is_system: boolean
}

interface Data {
  id: number
  account_id: number
  date: string
  amount: number
  is_active: boolean
  entity_type: string
  entity_id: number
  description: string
  entity: Entity
}

export interface IOperation {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
  data: Data[]
}

export interface IParamsBalance {
  safe_id: string | number
  id: string | number
  date_from?: string
  date_to?: string
  amount?: string | number
  description?: string
  entity_type?: 'income' | 'outcome' | 'purchase' | ''
  entity_id?: string | number
  page?: string | number
  columns?: (string | number)[]
  per_page?: string | number
  order_dir?: 'desc' | 'asc'
}

export const getOperation = async (params: IParamsBalance) => {
  const { data } = await API.get<IOperation>(
    `safes/${params.safe_id ? params.safe_id + '/' : ''}accounts/${
      params.id ? params.id + '/' : ''
    }entries`,
    {
      params: {
        date_from: paramsValidator(params.date_from),
        date_to: paramsValidator(params.date_to),
        amount: paramsValidator(params.amount),
        description: paramsValidator(params.description),
        entity_type: paramsValidator(params.entity_type),
        entity_id: paramsValidator(params.entity_id),
        page: paramsValidator(params.page),
        per_page: paramsValidator(params.per_page),
        order_dir: paramsValidator(params.order_dir)
      }
    }
  )
  return data
}

export const getDownloadExcelSafe = async (params: IParamsBalance) => {
  const data = await API.get<{ url: string }>(
    `safes/${params.safe_id ? params.safe_id + '/' : ''}accounts/${
      params.id ? params.id + '/' : ''
    }entries.xlsx`,
    {
      params: {
        date_from: paramsValidator(params.date_from),
        date_to: paramsValidator(params.date_to),
        columns: params.columns?.length ? params.columns.map((el) => el) : null,
        amount: paramsValidator(params.amount),
        description: paramsValidator(params.description),
        entity_type: paramsValidator(params.entity_type),
        entity_id: paramsValidator(params.entity_id),
        page: paramsValidator(params.page),
        per_page: paramsValidator(params.per_page),
        order_dir: paramsValidator(params.order_dir)
      }
    }
  )
  return data
}
