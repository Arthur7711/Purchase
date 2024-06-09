import { paramsValidator } from '@/helpers/paramsValitator';
import { API } from './API';

export interface IPositionsParams {
  month?: string | number;
  year?: string | number;
  date_from?: string | number;
  date_to?: string | number;
  item_id?: string | number;
  purchase_id?: string | number;
  task_id?: string | number;
  note?: string | number;
  name?: string | number;
  name_id?: string | number;
  document_date_from?: string | number;
  document_date_to?: string | number;
  delivered_from?: string | number;
  delivered_to?: string | number;
  price?: string | number;
  aux_price?: string | number;
  priority_ids?: (string | number)[];
  approve_statuses?: (string | number)[];
  product_status_ids?: (string | number)[];
  contragent_ids?: (string | number)[];
  legal_ids?: (string | number)[];
  type_ids?: (string | number)[];
  subtype_ids?: (string | number)[];
  purpose_ids?: (string | number)[];
  approver_ids?: (string | number)[];
  budget_ids?: (string | number)[];
  warehouse_ids?: (string | number)[];
  sn?: string;
  with_filters?: boolean;
  page?: number;
  per_page?: number;
  order_by?: string;
  order_dir?: string;
  only_activated?: number;
}

export interface IPositionData {
  id: number;
  purchase_id: number;
  hash: string;
  currency: string;
  price: number;
  name_id: number;
  type_id: number;
  sub_type_id: number;
  quantity: number;
  unit_id: number;
  status_id: number;
  purpose_id: number;
  budget_id: number;
  task_id: number;
  warehouse_id: number;
  activated_at: string;
  note: string;
  status: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    name: string;
  };
  subtype: {
    id: number;
    name: string;
  };
  item_name: {
    id: number;
    name: string;
  };
  unit: {
    id: number;
    name: string;
  };
  purpose: {
    id: number;
    name: string;
  };
  budget: {
    id: number;
    name: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
  document: {
    id: number;
    file_name: string;
    file_type: number;
    entity_type: string;
    entity_id: number;
    real_name: string;
    document_type: number;
    document_number: string;
    document_date: string;
    delivery_date: string;
  };
  task: {
    id: number;
    body: string;
    user_id: number;
    user: {
      id: number;
      samaccountname: string;
      displayname: string;
      description: string;
    };
  };
  approval: {
    id: number;
    type: string;
    status: string;
    purchase_priority: number;
    user: {
      id: number;
      samaccountname: string;
      displayname: string;
      description: string;
    };
  };
  purchase: {
    id: number;
    purchase_date: string;
    legal_id: number;
    legal_entity: {
      id: number;
      name: string;
    };
    contragent_id: number;
    contragent: {
      id: number;
      name: string;
    };
  };
}

export interface IPositionResponse {
  total_price: number;
  total_price_usd: number;
  activated_total_price: number;
  activated_total_price_usd: number;
  filters: {
    name: string;
    options: {
      id: number;
      name: string;
    }[];
  }[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  data: IPositionData[];
}

export const getPositions = (params: IPositionsParams) => {
  const data = API.get<IPositionResponse>(`/purchase-items`, {
    params: {
      month: paramsValidator(params.month) ? params.month : null,
      year: paramsValidator(params.year) ? params.year : null,
      date_from:
        paramsValidator(params?.date_from) && params.date_from !== '0001-01-01'
          ? params.date_from
          : null,
      date_to:
        paramsValidator(params?.date_to) && params.date_from !== '0001-01-01'
          ? params.date_to
          : null,
      item_id: paramsValidator(params.item_id) ? params.item_id : null,
      purchase_id: paramsValidator(params.purchase_id) ? params.purchase_id : null,
      task_id: paramsValidator(params.task_id) ? params.task_id : null,
      note: paramsValidator(params.note) ? params.note : null,
      name: paramsValidator(params.name) ? params.name : null,
      name_id: paramsValidator(params.name_id) ? params.name_id : null,
      document_date_from: paramsValidator(params.document_date_from)
        ? params.document_date_from
        : null,
      document_date_to: paramsValidator(params.document_date_to) ? params.document_date_to : null,
      delivered_from: paramsValidator(params.delivered_from) ? params.delivered_from : null,
      delivered_to: paramsValidator(params.delivered_to) ? params.delivered_to : null,
      price: paramsValidator(params.price) ? String(params.price).replace(',', '.') : null,
      aux_price: paramsValidator(params.aux_price)
        ? String(params.aux_price).replace(',', '.')
        : null,
      priority_ids: paramsValidator(params.priority_ids?.length) ? params.priority_ids : null,
      approve_statuses: paramsValidator(params.approve_statuses) ? params.approve_statuses : null,
      product_status_ids: paramsValidator(params.product_status_ids?.length)
        ? params.product_status_ids
        : null,
      approver_ids: params.approver_ids?.length ? params.approver_ids.map((el) => el) : null,
      contragent_ids: paramsValidator(params.contragent_ids) ? params.contragent_ids : null,
      legal_ids: paramsValidator(params.legal_ids) ? params.legal_ids : null,
      type_ids: paramsValidator(params.type_ids) ? params.type_ids : null,
      subtype_ids: paramsValidator(params.subtype_ids) ? params.subtype_ids : null,
      purpose_ids: paramsValidator(params.purpose_ids) ? params.purpose_ids : null,
      budget_ids: paramsValidator(params.budget_ids) ? params.budget_ids : null,
      warehouse_ids: paramsValidator(params.warehouse_ids) ? params.warehouse_ids : null,
      with_filters: params.with_filters ? params.with_filters : false,
      page: paramsValidator(params.page?.toString()) ? params.page : 1,
      sn: paramsValidator(params.sn),
      per_page: 20,
      order_by: paramsValidator(params.order_by?.toString()) ? params.order_by : 'id',
      order_dir: paramsValidator(params.order_dir?.toString()) ? params.order_dir : 'desc',
      only_activated: params.only_activated || null
    }
  });
  return data;
};

export interface IDownloadExelPositions extends IPositionsParams {
  columns: { id: string | number; field: string; name: string; active: boolean }[];
}

export const downloadExcelPositions = async (params: IDownloadExelPositions) => {
  const data = API.get<{ url: string }>('/purchase-items.xlsx', {
    params: {
      month: paramsValidator(params.month) ? params.month : null,
      year: paramsValidator(params.year) ? params.year : null,
      date_from:
        paramsValidator(params?.date_from) && params.date_from !== '0001-01-01'
          ? params.date_from
          : null,
      date_to:
        paramsValidator(params?.date_to) && params.date_from !== '0001-01-01'
          ? params.date_to
          : null,
      item_id: paramsValidator(params.item_id) ? params.item_id : null,
      purchase_id: paramsValidator(params.purchase_id) ? params.purchase_id : null,
      task_id: paramsValidator(params.task_id) ? params.task_id : null,
      note: paramsValidator(params.note) ? params.note : null,
      name: paramsValidator(params.name) ? params.name : null,
      name_id: paramsValidator(params.name_id) ? params.name_id : null,
      document_date_from: paramsValidator(params.document_date_from)
        ? params.document_date_from
        : null,
      document_date_to: paramsValidator(params.document_date_to) ? params.document_date_to : null,
      delivered_from: paramsValidator(params.delivered_from) ? params.delivered_from : null,
      delivered_to: paramsValidator(params.delivered_to) ? params.delivered_to : null,
      price_from: paramsValidator(params.price) ? params.price : null,
      aux_price_from: paramsValidator(params.aux_price) ? params.aux_price : null,
      priority_ids: paramsValidator(params.priority_ids?.length) ? params.priority_ids : null,
      approve_statuses: paramsValidator(params.approve_statuses) ? params.approve_statuses : null,
      product_status_ids: paramsValidator(params.product_status_ids?.length)
        ? params.product_status_ids
        : null,
      contragent_ids: paramsValidator(params.contragent_ids) ? params.contragent_ids : null,
      legal_ids: paramsValidator(params.legal_ids) ? params.legal_ids : null,
      type_ids: paramsValidator(params.type_ids) ? params.type_ids : null,
      subtype_ids: paramsValidator(params.subtype_ids) ? params.subtype_ids : null,
      purpose_ids: paramsValidator(params.purpose_ids) ? params.purpose_ids : null,
      budget_ids: paramsValidator(params.budget_ids) ? params.budget_ids : null,
      warehouse_ids: paramsValidator(params.warehouse_ids) ? params.warehouse_ids : null,
      with_filters: params.with_filters ? params.with_filters : false,
      columns: paramsValidator(params.columns.length) ? params.columns.map((el) => el.field) : null,
      only_activated: params.only_activated || null
    }
  });
  return data;
};
