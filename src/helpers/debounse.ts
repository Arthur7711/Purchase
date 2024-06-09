export function debounce(fn: any, wait: any) {
  let timer: any
  return function (...args: any) {
    if (timer) {
      clearTimeout(timer)
    }
    // @ts-ignore this issue
    const context = this
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}
