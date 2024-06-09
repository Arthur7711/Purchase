export interface PriceItem {
  price_avg: number
  aux_price_avg: number
}

export interface NameItem {
  label: string
  data: PriceItem[]
}

export interface ItemNameAnalyt {
  labels: string[]
  datasets: NameItem[]
  items_count: number
  price_avg: number
  aux_price_avg: number
}

export interface IDataItem {
  id: number
  name: string
  price_min: number
  aux_price_min: number
  price_max: number
  aux_price_max: number
  delivery_avg: number
  color: string
  items_count: number
  procent: string
}

export interface IDataTable {
  id: number
  name: string
  price_min: number
  aux_price_min: number
  price_max: number
  aux_price_max: number
  delivery_avg: number
  items_count: number
  color: string
  procent: string
}

export interface IPositionData {
  total: number
  data: IDataItem[]
  id: number
  name: string
}

export interface IPieCHartProps {
  labels: string[]
  datasets: {
    backgroundColor: string[]
    data: number[]
    borderColor: string[]
  }[]
}

export interface IPieCHartPropsExp {
  labels: string[]
  datasets: {
    backgroundColor: string[]
    data: {
      procent: number
      sum: number
    }
    borderColor: string[]
  }[]
}

export interface ILineChart {
  items_count: number
  price_avg: number
  aux_price_avg: number
  labels: string[]
  datasets: [
    {
      data: {
        price_avg: number
        aux_price_avg: number
      }[]
      label: string
    }
  ]
}

export interface ICurrencyInfo {
  id: number
  title: string
}
;[]
