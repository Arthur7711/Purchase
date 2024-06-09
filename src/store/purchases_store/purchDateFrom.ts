import { ref } from 'vue';

const usePurchDateFrom = () => {
  const dateFormat = ref(0);
  const dateFrom = ref('');
  const setDateFrom = (date: string) => {
    dateFrom.value = date;
  };
  const setDateFormat = (type: number) => {
    dateFormat.value = type;
  };
  return { dateFrom, dateFormat, setDateFrom, setDateFormat };
};

export default usePurchDateFrom();
