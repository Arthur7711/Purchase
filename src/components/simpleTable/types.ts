export interface ISipleTable {
  id: number
  name: string
  sum: number
  count: number
  procent: string
  color: string
  approvedProcent?: string | number
  approved?: string | number
}
export interface IProgressTable {
  id: number
  name: string
  sum: number
  procent: string
  color: string
  approved: number
  approvedProcent: number
  imgUrl: string
  count: number
  pending: number
  reject: number
  reserveSum: number
  reserveProcent: number
}
export interface IHoveredData {
  id: undefined | number
  approved: undefined | number
  pending: undefined | number
  reject: undefined | number
}
export interface INomenclatureTable {
  id: number
  name: string
  items_count: number
  sub_types: {
    id: number
    name: string
    items_count: number
  }
  types: { id: number; name: string; items_count: number }[] | []
}

export interface emittedValuePurch {
  val: string
  field_name: string
}

export interface ISupplierPageTable {
  id: number
  name: string
  count: number
  sum: number
  procent: string
  color: string
}
export interface ILastDocumentItem {
  delivery_date: null | string
  document_date: null | string
  document_number: null | string
  document_type: number
  entity_id: number
  entity_type: string
  file_name: string
  file_type: null | string
  id: number
  is_active: boolean
  real_name: string
  legal_id?: string | number
}
export interface ILastDocument {
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
  current_page: number
  data: ILastDocumentItem[]
}
export interface ILastDocumentTable {
  name: string
  type: string
  document_number: string
  date_from: string
  date_to: string
  url: string
  id: number
  is_active: boolean
  document_type_number: string
  entity_id: number,
  legal_id?: number | string
}
