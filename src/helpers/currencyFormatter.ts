export const curFormatter = (num: number | string) => {
  let res = 0 || '';
  const isInteger = Number.isInteger(Number(num));

  if (typeof num === 'number') {
    const numb: number = Number(num.toFixed(isInteger ? 0 : 2));
    res = Intl.NumberFormat('ru-Ru').format(numb);
  } else if (typeof num === 'string') {
    res = Intl.NumberFormat('ru-Ru').format(Number(Number(num).toFixed(isInteger ? 0 : 2)));
  }
  return res;
};
