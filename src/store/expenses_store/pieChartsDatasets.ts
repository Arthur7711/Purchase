import { ref } from 'vue'
 
const usePieColors = () => {
  const pieColorsPurp = ref<string[]>([])
  const pieColorsType = ref<string[]>([])
  const pieColorsSubType = ref<string[]>([])
  const pieChartType = ref<string>('purposes')
  const getterChartType = ref<string>('all')
  const setColorsPurp = (val: string) => {
    pieColorsPurp.value.push(val)
  }
  const setColorsType = (val: string) => {
    pieColorsType.value.push(val)
  }
  const setColorsSubType = (val: string) => {
    pieColorsSubType.value.push(val)
  }
  const setChartType = (type: string) => {
    pieChartType.value = type
  }
  const setGetterChartType = (type: string) => {
    getterChartType.value = type
  }
  return {
    pieColorsPurp,
    setColorsPurp,
    pieColorsType,
    setColorsSubType,
    setColorsType,
    pieColorsSubType,
    setChartType,
    pieChartType,
    setGetterChartType,
    getterChartType
  }
}

export default usePieColors()
