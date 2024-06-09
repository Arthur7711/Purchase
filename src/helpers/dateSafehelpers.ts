import useSafeFilters from '@/store/safeStore/safeFilterStore'
import dateConverter from './dateConverter'
import { format } from 'date-fns'

export const setSafeDateFormat = (val: string | number) => {
  if (val.toString() === '3') {
    useSafeFilters.setFilters('date_from', '0001-01-01')
    const dateTo = dateConverter(new Date().toString())
    useSafeFilters.setFilters('date_to', dateTo)
  }
}

//one month
export const monthSafeChange = (v: string) => {
  const date = dateConverter(v)
  const dateToString = new Date(Number(date.split('-')[0]), Number(date.split('-')[1]), 0)
  const dateTo = dateConverter(dateToString.toString())
  useSafeFilters.setFilters('date_from', date)
  useSafeFilters.setFilters('date_to', dateTo)
}

//half year
export const halfYearSafeChange = () => {
  const dateFrom = format(new Date().setMonth(new Date().getMonth() - 6), 'yyyy-MM-dd')
  const dateTo = format(new Date(), 'yyyy-MM-dd')
  useSafeFilters.setFilters('date_from', dateFrom)
  useSafeFilters.setFilters('date_to', dateTo)
}

//full year
export const yearSafeChange = (v: string) => {
  const date = dateConverter(v)
  const dateToString = new Date(Number(date.split('-')[0]), 12, 0)
  const dateTo = dateConverter(dateToString.toString())
  useSafeFilters.setFilters('date_from', date)
  useSafeFilters.setFilters('date_to', dateTo)
}

//custom
export const customSafeDateFrom = (v: string) => {
  const date = dateConverter(v)
  const dateTo = dateConverter(new Date().toString())
  useSafeFilters.setFilters('date_from', date)
  useSafeFilters.setFilters('date_to', dateTo)
}

//custom
export const customSafeDateTo = (v: string) => {
  const date = dateConverter(v)
  useSafeFilters.setFilters('date_to', date)
}
