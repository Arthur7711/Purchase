export default function dateConverter(str: string) {
  const date = new Date(str);
  if (str.length > 10) {
    if (str?.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)) {
      return str.split('.').reverse().join('-');
    }
  }
  const mnth = ('0' + (date.getMonth() + 1)).slice(-2),
    day = ('0' + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join('-');
}
