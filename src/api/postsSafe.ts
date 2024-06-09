import { API } from './API'

interface IPostIncomeParams {
  name: string
  safe_id: number | string
}

export const postIncomeSources = (params: IPostIncomeParams) => {
  const data = API.post<{ id: string | number; name: string }>(`ref/income-sources`, {
    name: params.name,
    safe_id: params.safe_id
  })
  return data
}

interface IPostNewAdd {
  safe_id: string | number
  id: string | number
  amount: string | number
  entity_id: string | number
  description?: string
}

export const postNewAdd = (params: IPostNewAdd) => {
  const data = API.post<{ id: string | number; name: string }>(
    `safes/${params.safe_id}/accounts/${params.id}/entries`,
    {
      amount: params.amount,
      entity_id: params.entity_id,
      description: params.description
    }
  )
  return data
}

interface IReserveParams {
  safe_id: string | number
  id: string | number
  amount: string | number
  description?: string
}

export const postReserve = async (params: IReserveParams) => {
  const data = await API.post(`/safes/${params.safe_id}/accounts/${params.id}/entries/reserve`, {
    amount: params.amount,
    description: params.description
  })
  return data
}

export const deleteReserve = async (params: {
  safe_id: string | number
  id: string | number
  entry_id: string | number
}) => {
  const data = await API.delete(
    `/safes/${params.safe_id}/accounts/${params.id}/entries/reserve/${params.entry_id}`
  )
  return data
}

interface IPostMoveParams {
  safe_id: string | number
  id: string | number
  outcome_amount: string | number
  income_amount: string | number
  account_id: string | number
}

export const postMove = async (params: IPostMoveParams) => {
  const data = await API.post(`/safes/${params.safe_id}/accounts/${params.id}/entries/transfer`, {
    outcome_amount: params.outcome_amount,
    income_amount: params.income_amount,
    account_id: params.account_id
  })
  return data
}
