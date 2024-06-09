import { format, lastDayOfMonth } from 'date-fns'

const today = new Date()

const sixMonthsAgo = new Date()

export const firstDateOfMonth = format(today, 'yyyy-MM-01')

export const lastDateOfMonth = format(lastDayOfMonth(today), 'yyyy-MM-dd')

export const sixMonthsEarlier = format(
  new Date(sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)),
  'yyyy-MM-dd'
)

export const lastMonth = format(new Date(sixMonthsAgo.setMonth(today.getMonth() - 1)), 'yyyy-MM-dd')

export const lastYear = format(
  new Date(new Date().setMonth(new Date().getMonth() - 12)),
  'yyyy-MM-01'
)

export const lastWeek = format(new Date(today.setDate(today.getDate() - 7)), 'yyyy-MM-dd')
