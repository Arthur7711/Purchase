export interface ITypesSummary {
  total: number
  data: {
    aux_price_sum: number
    id: number
    items_count: number
    name: string
    price_sum: number
  }[]
}
export interface IComment {
  user_id: number
  entity_id: number
  created_at: string
  comment: string
  samaccountname: string
  id: number
  user: {
    description: string
    displayname: string
  }
}
