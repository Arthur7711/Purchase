export function titleCase(data: string) {
  const finalResult = data.split('')
  return finalResult[0].toUpperCase() + finalResult.slice(1, finalResult.length).join('')
}
