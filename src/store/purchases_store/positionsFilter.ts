import { ref } from 'vue';

const usePositionsFilters = () => {
  const filters = ref<{ [key: string]: string | number | boolean | (string | number)[] }>({
    month: '',
    year: '',
    item_id: '',
    purchase_id: '',
    task_id: '',
    note: '',
    name: '',
    name_id: '',
    document_date_from: '',
    document_date_to: '',
    delivered_from: '',
    delivered_to: '',
    price: '',
    aux_price: '',
    priority_ids: [],
    approve_statuses: [],
    product_status_ids: [],
    contragent_ids: [],
    legal_ids: [],
    type_ids: [],
    subtype_ids: [],
    purpose_ids: [],
    budget_ids: [],
    warehouse_ids: [],
    approver_ids: [],
    sn: '',
    page: 1,
    per_page: 10,
    order_by: 'id',
    order_dir: 'desc',
    only_activated: 0
  });
  const wasRemoved = ref<boolean>(false);
  const setRemoved = (val: boolean) => {
    wasRemoved.value = val;
  };
  const setPositionsFilters = (value: {
    val: string | number | (string | number)[] | boolean;
    name: string;
  }) => {
    filters.value[value.name] = value.val;
  };
  const removePositionsFilters = () => {
    filters.value = {
      month: '',
      year: '',
      item_id: '',
      purchase_id: '',
      task_id: '',
      note: '',
      name: '',
      name_id: '',
      document_date_from: '',
      document_date_to: '',
      delivered_from: '',
      delivered_to: '',
      price: '',
      aux_price: '',
      priority_ids: [],
      approve_statuses: [],
      product_status_ids: [],
      contragent_ids: [],
      legal_ids: [],
      type_ids: [],
      subtype_ids: [],
      purpose_ids: [],
      approver_ids: [],
      budget_ids: [],
      sn: '',
      warehouse_ids: [],
      with_filters: false,
      page: 1,
      per_page: 10,
      order_by: 'id',
      order_dir: 'desc',
      only_activated: 0
    };
  };
  return { filters, setPositionsFilters, removePositionsFilters, wasRemoved, setRemoved };
};

export default usePositionsFilters();
