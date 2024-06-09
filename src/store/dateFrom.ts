import { ref } from 'vue';

const useDateFrom = () => {
  const dateFrom = ref('');
  const setDateFrom = (date: string) => {
    dateFrom.value = date;
  };

  return { dateFrom, setDateFrom };
};

export default useDateFrom();
