import { API } from './API'

export const getLineAcceptedPossitionLeaders = async ({
  date_from,
  date_to
}: {
  date_from: string
  date_to: string
}) => {
  const data = await API.get('statistics/approvers-by-sum-price/timeline', {
    params: {
      date_from,
      date_to
    }
  })
  return data
}
export const getPieAcceptedPossitionLeaders = async ({
  date_from,
  date_to
}: {
  date_from: string
  date_to: string
}) => {
  const data = await API.get('statistics/approvers-by-sum-price/summary', {
    params: {
      date_from,
      date_to
    }
  })
  return data
}
export const getLineAcceptedTaskLeaders = async ({
  date_from,
  date_to
}: {
  date_from: string
  date_to: string
}) => {
  const data = await API.get('statistics/approvers-by-approvals/timeline', {
    params: {
      date_from,
      date_to
    }
  })
  return data
}
export const getPieAcceptedTaskLeaders = async ({
  date_from,
  date_to
}: {
  date_from: string
  date_to: string
}) => {
  const data = await API.get('statistics/approvers-by-approvals/summary', {
    params: {
      date_from,
      date_to
    }
  })
  return data
}
