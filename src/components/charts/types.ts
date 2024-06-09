export interface ILineChartProps {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    aux_data?: number[]
    borderWidth?: number
  }[]
}

export interface IPieCHartProps {
  labels: string[]
  datasets: {
    backgroundColor: string[]
    data: number[]
    purchases_count: number[]
    borderColor: string[]
    procents: number[]
  }[]
}

export interface IPieIncomingData {
  total: number
  data: {
    id: number
    name: string
    purchases_count: number
    total_price: number
    total_price_aux: number
  }[]
}

export interface ILineChartPropsDown {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    staff: string
    per_staf: string
  }[]
}

export interface IEventLine {
  dataIndex: number
  datasetIndex: number
}

export interface IBarChartProps {
  labels: string[]
  datasets: {
    backgroundColor?: string
    data: number[]
    label: string
    // borderColor?: string[]
    // procents?: number[]
  }[]
}
