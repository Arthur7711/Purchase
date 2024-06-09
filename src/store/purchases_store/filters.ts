import { ref } from 'vue';

const useFilters = () => {
  const params = {
    month: '',
    year: '',
    purchase_id: '',
    specialist_ids: [],
    paid_from: '',
    paid_to: '',
    types_ids: [],
    delivered_from: '',
    delivered_to: '',
    description: '',
    payment_status_ids: [],
    approve_statuses: [],
    product_status_ids: [],
    price: '',
    paying_sum: '',
    contragent_ids: [],
    legal_ids: [],
    payment_type_ids: [],
    card_holder_ids: [],
    note: '',
    type_document_ids: [],
    with_filters: true,
    page: '1',
    per_page: '30'
  };

  const filtersPurch = ref<{ [key: string]: string | number | boolean | (string | number)[] }>({
    ...params
  });

  const filtersFavourite = ref<{ [key: string]: string | number | boolean | (string | number)[] }>({
    ...params
  });

  const wasRemovedPurch = ref<boolean>(false);
  const setRemovedPurch = (val: boolean) => {
    wasRemovedPurch.value = val;
  };

  const wasRemovedFav = ref<boolean>(false);
  const setRemovedFav = (val: boolean) => {
    wasRemovedFav.value = val;
  };

  const setFiltersPurch = (value: {
    val: string | number | (string | number)[] | boolean;
    name: string;
  }) => {
    filtersPurch.value[value.name] = value.val;
  };

  const setFiltersFav = (value: {
    val: string | number | (string | number)[] | boolean;
    name: string;
  }) => {
    filtersFavourite.value[value.name] = value.val;
  };

  const removeFiltersPurch = () => {
    filtersPurch.value = { ...params };
  };

  const removeFiltersFav = () => {
    filtersFavourite.value = { ...params };
  };
  return {
    filtersFavourite,
    filtersPurch,
    setFiltersPurch,
    setFiltersFav,
    removeFiltersFav,
    removeFiltersPurch,
    wasRemovedPurch,
    wasRemovedFav,
    setRemovedPurch,
    setRemovedFav
  };
};

export default useFilters();
