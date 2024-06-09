import { API } from './API'

export const getLineSuppliers = async ({
  date_from,
  date_to,
  only_paid
}: {
  date_from: string
  date_to: string
  only_paid: number
}) => {
  const data = await API.get('/statistics/contragents/timeline', {
    params: {
      date_from,
      date_to,
      only_paid
    }
  })
  return data
}

export const getPieSuppliers = async ({
  date_from,
  date_to,
  only_paid
}: {
  date_from: string
  date_to: string
  only_paid: number
}) => {
  const data = await API.get('statistics/contragents/summary', {
    params: {
      date_from,
      date_to,
      only_paid
    }
  })
  return data
}
