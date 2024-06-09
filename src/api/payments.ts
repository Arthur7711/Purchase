import { paramsValidator } from '@/helpers/paramsValitator';
import { API } from './API';

export interface IPaymentsData {
  filters: Array<{
    name: string;
    options: Array<{
      id: number;
      name: string;
    }>;
  }>;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  data: Array<{
    id: number;
    purchase_id: number;
    date: string;
    type_id: number;
    price: number;
    currency: string;
    debited_price: number;
    debited_currency: string;
    note: string;
    paying_type: {
      id: number;
      name: string;
    };
    purchase: {
      id: number;
      description: string;
      legal_id: number;
      payment_type_id: number;
      payment_status_id: number;
      contragent_id: number;
      card_holder_id: number;
      legal_entity: {
        id: number;
        name: string;
      };
      contragent: {
        id: number;
        name: string;
      };
      payment_type: {
        id: number;
        name: string;
      };
      payment_status: {
        id: number;
        name: string;
      };
      card_holder: {
        id: number;
        name: string;
        bank_id: string;
        payment_type_id: number;
        deleted_at: string;
        legal_ids: number[];
      };
    };
  }>;
}

export interface IPaymentsParams {
  date_from?: string;
  date_to?: string;
  paying_type_ids?: (string | number)[];
  payment_type_ids?: (string | number)[];
  payment_status_ids?: (string | number)[];
  card_holder_ids?: (string | number)[];
  legal_ids?: (string | number)[];
  contragent_ids?: (string | number)[];
  purchase_id?: (string | number)[];
  price?: string | number;
  debited_price?: string | number;
  note?: string;
  description?: string;
  with_filters?: boolean;
  order_by?: string;
  order_dir?: string;
  page?: string | number;
  per_page?: string | number;
}

export const getPaymentData = async (params: IPaymentsParams) => {
  const data = API.get<IPaymentsData>(`/payings`, {
    params: {
      date_from:
        paramsValidator(params?.date_from) && params.date_from !== '0001-01-01'
          ? params.date_from
          : null,
      date_to:
        paramsValidator(params?.date_to) && params.date_from !== '0001-01-01'
          ? params.date_to
          : null,
      paying_type_ids: paramsValidator(params.paying_type_ids?.length)
        ? params.paying_type_ids
        : null,
      payment_type_ids: paramsValidator(params.payment_type_ids?.length)
        ? params.payment_type_ids?.map((el) => el)
        : null,
      payment_status_ids: paramsValidator(params.payment_status_ids?.length)
        ? params.payment_status_ids?.map((el) => el)
        : null,
      card_holder_ids: paramsValidator(params.card_holder_ids?.length)
        ? params.card_holder_ids?.map((el) => el)
        : null,
      legal_ids: paramsValidator(params.legal_ids?.length)
        ? params.legal_ids?.map((el) => el)
        : null,
      contragent_ids: paramsValidator(params.contragent_ids?.length)
        ? params.contragent_ids?.map((el) => el)
        : null,
      purchase_id: paramsValidator(params.purchase_id) ? params.purchase_id : null,
      description: paramsValidator(params.description),
      price: paramsValidator(params.price) ? String(params.price).replace(',', '.') : null,
      debited_price: paramsValidator(params.debited_price)
        ? String(params.debited_price).replace(',', '.')
        : null,
      note: paramsValidator(params.note) ? params.note : null,
      with_filters: params.with_filters ? true : false,
      order_by: paramsValidator(params.order_by) ? params.order_by : null,
      order_dir: paramsValidator(params.order_dir) ? params.order_dir : null,
      page: paramsValidator(params.page) ? params.page : null,
      per_page: paramsValidator(params.per_page) ? params.per_page : null
    }
  });
  return data;
};

export const getPayingTypes = () => {
  const data = API.get<{ id: string | number; name: string }[]>('ref/paying-types');
  return data;
};
