import { API } from './API'
import type { IBudgetExp } from '../store/expenses_store/budget_exp'
import type { ILegalExp } from '../store/expenses_store/legal_exp'
import type { ITypesExp } from '@/store/expenses_store/types_exp'
import type { ILineChartData } from '@/views/analistic/suppliers/types'

//budgets
export const getBudgetExp = async () => {
  const data = await API.get<IBudgetExp[]>(`ref/budgets`)
  return data
}

//legal
export const getLegalEntities = async () => {
  const data = await API.get<ILegalExp[]>(`ref/legal-entities`)
  return data
}

//Overview Statistics

export interface IOverviewParams {
  dateFrom: string
  dateTo: string
  onlyPaid?: string | number
  legalId?: string | number
  budgetId?: string | number
  purposeIds?: (string | number)[] | null
  typeIds?: (string | number)[] | null
  subtypeIds?: (string | number)[] | null
}

export interface IOverview {
  price_sum: string | number
  aux_price_sum: string | number
  prev_price_sum: string | number
  prev_aux_price_sum: string | number
  diff_price_sum: string | number
  diff_aux_price_sum: string | number
  percent_price_sum: string | number
  percent_aux_price_sum: string | number
  staff_avg: string | number
  prev_staff_avg: string | number
  per_staff_price_sum: string | number
  per_staff_aux_price_sum: string | number
  prev_per_staff_price_sum: string | number
  prev_per_staff_aux_price_sum: string | number
  diff_per_staff_price_sum: string | number
  diff_per_staff_aux_price_sum: string | number
  percent_per_staff_price_sum: string | number
  percent_per_staff_aux_price_sum: string | number
  percent_staff_avg: string | number
  office_staff_avg: string | number
  diff_staff_avg: string | number
  diff_office_staff_avg: string | number
  prev_office_staff_avg: number | string
  percent_office_staff_avg: number | string
}

export const getOverviewStatistics = async (params: IOverviewParams) => {
  const data = await API.get<IOverview>(`statistics/expenses/overview`, {
    params: {
      date_from: params.dateFrom,
      date_to: params.dateTo,
      only_paid: params.onlyPaid,
      legal_id: params.legalId,
      budget_id: params.budgetId,
      purpose_ids: params.purposeIds,
      type_ids: params.typeIds,
      subtype_ids: params.subtypeIds
    }
  })
  return data
}

//summary statistics on purposes

export const getPurposesSummary = async (params: IOverviewParams) => {
  const data = await API.get<ITypesExp>(`statistics/purposes/summary`, {
    params: {
      date_from: params.dateFrom,
      date_to: params.dateTo,
      only_paid: params.onlyPaid,
      legal_id: params.legalId,
      budget_id: params.budgetId,
      type_ids: params.typeIds,
      subtype_ids: params.subtypeIds
    }
  })
  return data
}

//summary statistics on types

export const getTypesSummary = async (params: IOverviewParams) => {
  const data = await API.get<ITypesExp>(`statistics/types/summary`, {
    params: {
      date_from: params.dateFrom,
      date_to: params.dateTo,
      only_paid: params.onlyPaid,
      legal_id: params.legalId,
      budget_id: params.budgetId,
      purpose_ids: params.purposeIds,
      subtype_ids: params.subtypeIds
    }
  })
  return data
}

//summary statistics on sub-types

export const getSubtypesSummary = async (params: IOverviewParams) => {
  const data = await API.get<ITypesExp>(`statistics/sub-types/summary`, {
    params: {
      date_from: params.dateFrom,
      date_to: params.dateTo,
      only_paid: params.onlyPaid,
      legal_id: params.legalId,
      budget_id: params.budgetId,
      purpose_ids: params.purposeIds,
      type_ids: params.typeIds
    }
  })
  return data
}

export interface ILineStaff {
  labels: string[]
  datasets: [
    {
      label: string
      data: [{ staff_count: string | number }]
    }
  ]
}

export const getterStaffTimeline = async (dateFrom: string, dateTo: string) => {
  const data = await API.get<ILineStaff>(`statistics/staff/timeline`, {
    params: {
      date_from: dateFrom,
      date_to: dateTo
    }
  })
  return data
}

export const getterOfficeStaffTimeline = async (dateFrom: string, dateTo: string) => {
  const data = await API.get<ILineStaff>(`statistics/office-staff/timeline`, {
    params: {
      date_from: dateFrom,
      date_to: dateTo
    }
  }) 
  return data
}

export interface ILineUnited {
  labels: string[]
  datasets: [
    {
      label: string
      data: [
        {
          price_sum: number
          aux_price_sum: number
          staff_count: number
          per_staff_price_sum: number
          per_staff_aux_price_sum: number
        }
      ]
    }
  ]
}

export interface IParamsLineUnited {
  dateFrom: string
  dateTo: string
  only_paid: string | number
  legal_id?: string | number
  budget_id?: string | number
  purpose_ids: (string | number)[] | null
  type_ids: (string | number)[] | null
  subtype_ids: (string | number)[] | null
  staff_mode: string | number
}

export const getterLineDownOneLine = async (params: IParamsLineUnited) => {
  const data = await API.get<ILineUnited>('/statistics/expenses/timeline', {
    params: {
      date_from: params.dateFrom,
      date_to: params.dateTo,
      only_paid: params.only_paid,
      legal_id: params.legal_id,
      budget_id: params.budget_id,
      purpose_ids: params.purpose_ids,
      type_ids: params.type_ids,
      subtype_ids: params.subtype_ids,
      staff_mode: Number(params.staff_mode) === 0 ? 'all' : 'office'
    }
  })
  return data
}

export const getterLineDownMultiline = async (params: IParamsLineUnited) => {
  const data = await API.get<ILineUnited>('/statistics/purposes/timeline', {
    params: {
      date_from: params.dateFrom,
      date_to: params.dateTo, 
      only_paid: params.only_paid,
      legal_id: params.legal_id,
      budget_id: params.budget_id,
      purpose_ids: params.purpose_ids,
      type_ids: params.type_ids,
      subtype_ids: params.subtype_ids,
      staff_mode: Number(params.staff_mode) === 0 ? 'all' : 'office'
    }
  })
  return data
}

export const getterLineDownMultilineTypes = async (params: IParamsLineUnited) => {
  const data = await API.get<ILineUnited>('/statistics/types/timeline', {
    params: {
      date_from: params.dateFrom,
      date_to: params.dateTo,
      only_paid: params.only_paid,
      legal_id: params.legal_id,
      budget_id: params.budget_id,
      purpose_ids: params.purpose_ids,
      type_ids: params.type_ids,
      subtype_ids: params.subtype_ids,
      staff_mode: Number(params.staff_mode) === 0 ? 'all' : 'office'
    }
  })
  return data
}

export const getterLineDownMultilineSubTypes = async (params: IParamsLineUnited) => {
  const data = await API.get<ILineUnited>('/statistics/sub-types/timeline', {
    params: {
      date_from: params.dateFrom,
      date_to: params.dateTo,
      only_paid: params.only_paid,
      legal_id: params.legal_id,
      budget_id: params.budget_id,
      purpose_ids: params.purpose_ids,
      type_ids: params.type_ids,
      subtype_ids: params.subtype_ids,
      staff_mode: Number(params.staff_mode) === 0 ? 'all' : 'office'
    }
  })
  return data
}
