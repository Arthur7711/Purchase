export interface IPossitionPieData {
  id: number
  displayname: string
  samaccountname: string
  price_sum: number
  aux_price_sum: number
  items_count: number
  approvals_accepted_count: number
  approvals_pending_count: number
  approvals_rejected_count: number
  approvals_count: number
  approvals_accepted_percent: number
}
export interface ILeaderPiePossition {
  total: number
  data: IPossitionPieData[]
}
export interface ILinePossition {
  labels: string[]
  datasets: {
    label: string
    data: {
      aux_price_sum: number
      price_sum: number
    }[]
  }[]
}
export interface ILineapprovals {
  labels: string[]
  datasets: {
    label: string
    data: {
      percent: number
      approvals_accepted_count: number
      approvals_count: number
    }[]
  }[]
}
