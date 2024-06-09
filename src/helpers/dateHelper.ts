/* eslint-disable no-irregular-whitespace */
import dateConverter from './dateConverter';
import { format } from 'date-fns';
import usePurchDateFrom from '../store/purchases_store/purchDateFrom';
import usePurchDateTo from '../store/purchases_store/purchDateTo';

// ⣾⡇⣿⣿⡇⣾⣿⣿⣿⣿⣿⣿⣿⣿⣄⢻⣦⡀⠁⢸⡌⠻⣿⣿⣿⡽⣿⣿
// ⡇⣿⠹⣿⡇⡟⠛⣉⠁⠉⠉⠻⡿⣿⣿⣿⣿⣿⣦⣄⡉⠂⠈⠙⢿⣿⣝⣿
// ⠤⢿⡄⠹⣧⣷⣸⡇⠄⠄⠲⢰⣌⣾⣿⣿⣿⣿⣿⣿⣶⣤⣤⡀⠄⠈⠻⢮
// ⠄⢸⣧⠄⢘⢻⣿⡇⢀⣀⠄⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡀⠄⢀
// ⠄⠈⣿⡆⢸⣿⣿⣿⣬⣭⣴⣿⣿⣿⣿⣿⣿⣿⣯⠝⠛⠛⠙⢿⡿⠃⠄⢸
// ⠄⠄⢿⣿⡀⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⡾⠁⢠⡇⢀
// ⠄⠄⢸⣿⡇⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣏⣫⣻⡟⢀⠄⣿⣷⣾
// ⠄⠄⢸⣿⡇⠄⠈⠙⠿⣿⣿⣿⣮⣿⣿⣿⣿⣿⣿⣿⣿⡿⢠⠊⢀⡇⣿⣿
// ⠒⠤⠄⣿⡇⢀⡲⠄⠄⠈⠙⠻⢿⣿⣿⠿⠿⠟⠛⠋⠁⣰⠇⠄⢸⣿⣿⣿

// ⊂_ヽ
// 　 ＼＼ Λ＿Λ
// 　　 ＼(　ˇωˇ)
// 　　　 　⌒ヽ
// 　　　/ 　 へ＼
// 　　 /　　/　＼＼
// 　　 ﾚ　ノ　　 ヽ_つ
// 　　/　/
// 　 /　/|
// 　(　(ヽ
// 　|　|、＼
// 　| 丿 ＼ ⌒)
// 　| |　　) /
// `ノ )　　Lﾉ
// (_／

//all the time
export const setDateFormat = (val: string | number) => {
  if (val.toString() === '3') {
    usePurchDateFrom.setDateFrom('0001-01-01');
    const dateTo = dateConverter(new Date().toString());
    usePurchDateTo.setDateTo(dateTo);
  }
};

//one month
export const monthChange = (v: string) => {
  const date = dateConverter(v);
  const dateToString = new Date(Number(date.split('-')[0]), Number(date.split('-')[1]), 0);
  const dateTo = dateConverter(dateToString.toString());
  usePurchDateFrom.setDateFrom(date);
  usePurchDateTo.setDateTo(dateTo);
};

//half year
export const halfYearChange = () => {
  const dateFrom = format(new Date().setMonth(new Date().getMonth() - 6), 'yyyy-MM-dd');
  const dateTo = format(new Date(), 'yyyy-MM-dd');
  usePurchDateFrom.setDateFrom(dateFrom);
  usePurchDateTo.setDateTo(dateTo);
};

//full year
export const yearChange = (v: string) => {
  const date = dateConverter(v);
  const dateToString = new Date(Number(date.split('-')[0]), 12, 0);
  const dateTo = dateConverter(dateToString.toString());
  usePurchDateFrom.setDateFrom(date);
  usePurchDateTo.setDateTo(dateTo);
};

//custom
export const customDateFrom = (v: string) => {
  const date = dateConverter(v);
  usePurchDateFrom.setDateFrom(date);
};

//custom
export const customDateTo = (v: string) => {
  const date = dateConverter(v);
  usePurchDateTo.setDateTo(date);
};
