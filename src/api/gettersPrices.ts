import type { IPopular, IProduct } from '@/views/analistic/prices/types'
import { API } from './API'

//Геттер типов
export const getTypesDropdata = async () => {
  const data = await API.get(`/ref/types`)
  return data
}

export interface IParamsPopular {
  dateFrom: string
  dateTo: string
  typeId: string | undefined
}

export const getPopular = async (params: IParamsPopular) => {
  const typeEditor = params.typeId == undefined ? `` : `&type_id=${params.typeId}`
  const data = await API.get<IPopular[]>(
    `statistics/item-names/popular?date_from=${params.dateFrom}&date_to=${params.dateTo}${typeEditor}`
  )
  return data
}

//суммарная статистика по наименованиям
export interface IParamsSummary {
  dateFrom: string
  dateTo: string
  id: string | number
  typeId: string | undefined
  onlyPaid: boolean
}
export const getSummary = async (params: IParamsSummary) => {
  const typeEditor = params.typeId ? `` : `&type_id=${params.typeId}&`
  const data = await API.get(
    `statistics/item-names/summary?date_from=${params.dateFrom}&date_to=${params.dateTo}&id=${params.id}${typeEditor}only_paid=${params.onlyPaid}`
  )
  return data
}

// геттер последних
export const getLatest = async (id?: string | number) => {
  const typeEditor = id !== undefined ? `last?type_id=${id}` : `last`
  const data = await API.get(`statistics/item-names/${typeEditor}`)
  return data
}

// поиск по наименованиям
export interface IParamsSearched {
  dateFrom: string
  dateTo: string
  typeId?: string | number | null
  searchQuery: string
}

export const getSearched = async (params: IParamsSearched) => {
  const typeEditor = params.typeId === undefined ? `&` : `&type_id=${params.typeId}&`
  const data = await API.get(
    // `statistics/item-names/search?date_from=${params.dateFrom}&date_to=${params.dateTo}&q=${params.searchQuery}`
    `statistics/item-names/search?date_from=${params.dateFrom}&date_to=${params.dateTo}${typeEditor}q=${params.searchQuery}`
  )
  return data
}

//суммарная статистика по наименованиям
export interface IParamsPosition {
  dateFrom: string
  dateTo: string
  only_paid: string | number
  id: number | string | undefined
  typeId?: number | string | null
}

export const getPositionSum = async (params: IParamsPosition) => {
  const typeEditor = params.typeId === undefined ? `&` : `&type_id=${params.typeId}&`
  const data = await API.get(
    `statistics/item-names/summary?date_from=${params.dateFrom}&date_to=${params.dateTo}&id=${params.id}${typeEditor}only_paid=${params.only_paid}`
  )
  return data
}

export interface IParamsLineData {
  dateFrom: string
  dateTo: string
  only_paid: 0 | 1 | '0' | '1'
  id: number | string
  typeId?: number | string | null
  related_ids: string[] | number[]
}

export const getLineData = async (params: IParamsLineData) => {
  // if (params.related_ids.length) {
  if (params.typeId) {
    return await API.get('statistics/item-names/timeline', {
      params: {
        date_from: params.dateFrom,
        date_to: params.dateTo,
        type_id: params.typeId,
        id: params.id,
        related_ids: params.related_ids || [0],
        only_paid: params.only_paid
      }
    })
  } else {
    return await API.get('statistics/item-names/timeline', {
      params: {
        date_from: params.dateFrom,
        date_to: params.dateTo,
        id: params.id,
        related_ids: params.related_ids,
        only_paid: params.only_paid
      }
    })
  }
}
