export const readabilityNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
export const readabilityDotNumbers = (data: string | number) => {
  return data.toString().split('.').join(',')
}
