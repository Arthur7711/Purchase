import { API } from './API';
import { paramsValidator } from '../helpers/paramsValitator';

export interface Specialist {
  id: number;
  samaccountname: string;
  displayname: string;
  description: string;
}

export interface ProductStatus {
  id: number;
  name: string;
}

export interface Contragent {
  id: number;
  name: string;
}

export interface LegalEntity {
  id: number;
  name: string;
}

export interface PaymentType {
  id: number;
  name: string;
}

export interface PaymentStatus {
  id: number;
  name: string;
}

export interface Paying {
  id: number;
  purchase_id: number;
  date: string;
}

export interface Info {
  id: number;
  items_sum_price: number;
  payings_sum_price: number;
  product_status_id: number;
  approve_status: string;
  product_status: ProductStatus;
}

export interface CardHolder {
  id: number;
  name: string;
  bank_id: string;
  legal_id: number;
  payment_type_id: number;
  deleted_at: string;
  legal_ids: number[];
}

interface FilterOption {
  id: number | string;
  name: string;
}

export interface Filter {
  name: string;
  options: FilterOption[];
}

export interface Item {
  id: number;
  specialist_id: number;
  currency: string;
  description: string;
  purchase_date: string;
  comming_date: string;
  contragent_id: number;
  legal_id: number;
  payment_status_id: number;
  payment_type_id: number;
  card_holder_id: number;
  debited_currency: string;
  specialist: Specialist;
  payings: Paying[];
  info: Info;
  is_favourite: boolean;
  payment_status: PaymentStatus;
  contragent: Contragent;
  legal_entity: LegalEntity;
  payment_type: PaymentType;
  card_holder: CardHolder;
  doc_invoices_exists: boolean;
  doc_contract_exists: boolean;
  doc_closing_exists: boolean;
  doc_other_exists: boolean;
  deleted_items_count: number;
  cancelled_items_count: number;
  new_items_count: number;
  in_process_items_count: number;
  approving_items_count: number;
  received_items_count: number;
  rejected_items_count: number;
  accepted_items_count: number;
  pending_items_count: number;
  no_approve_items_count: number;
}

export interface IPurchResponse {
  total_price: number;
  total_price_usd: number;
  filters: Filter[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  data: Item[];
}

export interface IPurchaseParams {
  month?: string | number;
  year?: string | number;
  date_from?: string;
  date_to?: string;
  purchase_id?: string | number;
  specialist_ids?: (string | number)[];
  paid_from?: string | number;
  paid_to?: string | number;
  delivered_from?: string;
  delivered_to?: string;
  description?: string;
  payment_status_ids?: (string | number)[];
  approve_statuses?: (string | number)[];
  product_status_ids?: (string | number)[];
  price?: string | number;
  paying_sum?: string | number;
  contragent_ids?: (string | number)[];
  legal_ids?: (string | number)[];
  payment_type_ids?: (string | number)[];
  card_holder_ids?: (string | number)[];
  note?: string;
  type_document_ids?: (string | number)[];
  with_filters?: boolean;
  page?: string | number;
  per_page?: string | number;
  types_ids?: (string | number)[];
}

export const getPurchases = async (params: IPurchaseParams) => {
  const data = await API.get<IPurchResponse>(`/purchases`, {
    params: {
      month: paramsValidator(params?.month),
      year: paramsValidator(params?.year),
      date_from:
        paramsValidator(params?.date_from) && params.date_from !== '0001-01-01'
          ? params.date_from
          : null,
      date_to:
        paramsValidator(params?.date_to) && params.date_from !== '0001-01-01'
          ? params.date_to
          : null,
      purchase_id: paramsValidator(params?.purchase_id),
      specialist_ids: paramsValidator(params?.specialist_ids?.length)
        ? params?.specialist_ids?.map((el) => el)
        : null,
      paid_from: paramsValidator(params?.paid_from),
      paid_to: paramsValidator(params?.paid_to),
      delivered_from: paramsValidator(params?.delivered_from),
      delivered_to: paramsValidator(params?.delivered_to),
      description: paramsValidator(params?.description),
      payment_status_ids:
        paramsValidator(params?.payment_status_ids?.length) && params?.payment_status_ids?.length
          ? params?.payment_status_ids?.length > 1
            ? params?.payment_status_ids?.map((el) => el)
            : params?.payment_status_ids
          : null,
      approve_statuses: paramsValidator(params?.approve_statuses?.length)
        ? params?.approve_statuses?.map((el) => el)
        : null,
      product_status_ids: paramsValidator(params.product_status_ids?.length)
        ? params.product_status_ids?.map((el) => el)
        : null,
      price: paramsValidator(params.price) ? String(params.price).replace(',', '.') : null,
      paying_sum: paramsValidator(params.paying_sum)
        ? String(params.paying_sum).replace(',', '.')
        : null,
      contragent_ids: paramsValidator(params.contragent_ids?.length)
        ? params.contragent_ids?.map((el) => el)
        : null,
      legal_ids: paramsValidator(params.legal_ids?.length)
        ? params.legal_ids?.map((el) => el)
        : null,
      payment_type_ids: paramsValidator(params.payment_type_ids?.length)
        ? params.payment_type_ids?.map((el) => el)
        : null,
      card_holder_ids: paramsValidator(params.card_holder_ids?.length)
        ? params.card_holder_ids?.map((el) => el)
        : null,
      note: paramsValidator(params.note),
      type_document_ids: paramsValidator(params.type_document_ids?.length)
        ? params.type_document_ids?.map((el) => el)
        : null,
      with_filters: paramsValidator(params.with_filters),
      page: paramsValidator(params.page),
      per_page: paramsValidator(params.per_page)
    }
  });
  return data;
};

export const getPurchasesNonFilters = async (params: IPurchaseParams) => {
  const data = await API.get<IPurchResponse>(`/purchases`, {
    params: {
      month: paramsValidator(params?.month),
      year: paramsValidator(params?.year),
      date_from:
        paramsValidator(params?.date_from) && params.date_from !== '0001-01-01'
          ? params.date_from
          : null,
      date_to:
        paramsValidator(params?.date_to) && params.date_from !== '0001-01-01'
          ? params.date_to
          : null,
      purchase_id: paramsValidator(params?.purchase_id),
      specialist_ids: paramsValidator(params?.specialist_ids?.length)
        ? params?.specialist_ids?.map((el) => el)
        : null,
      paid_from: paramsValidator(params?.paid_from),
      paid_to: paramsValidator(params?.paid_to),
      delivered_to: paramsValidator(params?.delivered_to),
      delivered_from: paramsValidator(params?.delivered_from),
      description: paramsValidator(params?.description),
      payment_status_ids:
        paramsValidator(params?.payment_status_ids?.length) && params?.payment_status_ids?.length
          ? params?.payment_status_ids?.length > 1
            ? params?.payment_status_ids?.map((el) => el)
            : params?.payment_status_ids
          : null,
      approve_statuses: paramsValidator(params?.approve_statuses?.length)
        ? params?.approve_statuses?.map((el) => el)
        : null,
      product_status_ids: paramsValidator(params.product_status_ids?.length)
        ? params.product_status_ids?.map((el) => el)
        : null,
      price: paramsValidator(params.price) ? String(params.price).replace(',', '.') : null,
      paying_sum: paramsValidator(params.paying_sum)
        ? String(params.paying_sum).replace(',', '.')
        : null,
      contragent_ids: paramsValidator(params.contragent_ids?.length)
        ? params.contragent_ids?.map((el) => el)
        : null,
      legal_ids: paramsValidator(params.legal_ids?.length)
        ? params.legal_ids?.map((el) => el)
        : null,
      payment_type_ids: paramsValidator(params.payment_type_ids?.length)
        ? params.payment_type_ids?.map((el) => el)
        : null,
      card_holder_ids: paramsValidator(params.card_holder_ids?.length)
        ? params.card_holder_ids?.map((el) => el)
        : null,
      note: paramsValidator(params.note),
      type_document_ids: paramsValidator(params.type_document_ids?.length)
        ? params.type_document_ids?.map((el) => el)
        : null,
      with_filters: false,
      page: paramsValidator(params.page),
      per_page: paramsValidator(params.per_page)
    }
  });
  return data;
};

export const getPaymentStatuses = async () => {
  const data = API.get<{ id: string | number; name: string }[]>('/ref/payment-statuses');
  return data;
};

export const getProductStatuses = async () => {
  const data = API.get<{ id: string | number; name: string }[]>('/ref/product-statuses');
  return data;
};

export interface IDownloadExelPurch extends IPurchaseParams {
  columns: { id: string | number; field: string; name: string; active: boolean }[];
}

export const getDownloadExelPurchasesTable = async (params: IDownloadExelPurch) => {
  const data = API.get<{ url: string }>('purchases.xlsx', {
    params: {
      month: paramsValidator(params?.month),
      year: paramsValidator(params?.year),
      date_from:
        paramsValidator(params?.date_from) && params.date_from !== '0001-01-01'
          ? params.date_from
          : null,
      date_to:
        paramsValidator(params?.date_to) && params.date_from !== '0001-01-01'
          ? params.date_to
          : null,
      purchase_id: paramsValidator(params?.purchase_id),
      specialist_ids: paramsValidator(params?.specialist_ids?.length)
        ? params?.specialist_ids?.map((el) => el)
        : null,
      paid_from: paramsValidator(params?.paid_from),
      paid_to: paramsValidator(params?.paid_to),
      delivered_to: paramsValidator(params?.delivered_to),
      delivered_from: paramsValidator(params?.delivered_from),
      description: paramsValidator(params?.description),
      payment_status_ids:
        paramsValidator(params?.payment_status_ids?.length) && params?.payment_status_ids?.length
          ? params?.payment_status_ids?.length > 1
            ? params?.payment_status_ids?.map((el) => el)
            : params?.payment_status_ids
          : null,
      approve_statuses: paramsValidator(params?.approve_statuses?.length)
        ? params?.approve_statuses?.map((el) => el)
        : null,
      product_status_ids: paramsValidator(params.product_status_ids?.length)
        ? params.product_status_ids?.map((el) => el)
        : null,
      price: paramsValidator(params.price) ? String(params.price).replace(',', '.') : null,
      paying_sum: paramsValidator(params.paying_sum)
        ? String(params.paying_sum).replace(',', '.')
        : null,
      contragent_ids: paramsValidator(params.contragent_ids?.length)
        ? params.contragent_ids?.map((el) => el)
        : null,
      legal_ids: paramsValidator(params.legal_ids?.length)
        ? params.legal_ids?.map((el) => el)
        : null,
      payment_type_ids: paramsValidator(params.payment_type_ids?.length)
        ? params.payment_type_ids?.map((el) => el)
        : null,
      card_holder_ids: paramsValidator(params.card_holder_ids?.length)
        ? params.card_holder_ids?.map((el) => el)
        : null,
      note: paramsValidator(params.note),
      type_document_ids: paramsValidator(params.type_document_ids?.length)
        ? params.type_document_ids?.map((el) => el)
        : null,
      columns: paramsValidator(params.columns.length) ? params.columns.map((el) => el.field) : null
    }
  });
  return data;
};
