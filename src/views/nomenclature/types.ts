import type { INomenclatureTable } from '../../components/simpleTable/types'

export interface INomenclatureType {
  id: number
  name: string
  names_count: number
  sub_types: {
    id: number
    name: string
  }[]
}
export interface ITreeNomenclature {
  key: string
  label: string
  children: {
    key: string
    label: string
    data?: string
    type?: string
    parentId?: string
  }[]
}
export interface INomenclatureItemNames {
  current_page: number
  data: INomenclatureTable[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}
