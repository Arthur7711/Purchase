import { paramsValidator } from '@/helpers/paramsValitator';
import { API } from './API';
import { type IDownloadExelPurch } from './purchasesTable';
import type { IPurchaseParams } from './purchasesTable';
import type { IPurchResponse } from './purchasesTable';

export interface IFavouriteBrief {
  description: string;
  id: number;
  purchase_date: string;
}

export const postFavorite = async (id: string | number) => {
  API.post(`/favourite-purchases`, { purchase_id: id });
};

export const getDownloadExelFavouriteTable = async (params: IDownloadExelPurch) => {
  const data = API.get<{ url: string }>('/favourite-purchases.xlsx', {
    params: {
      month: paramsValidator(params?.month),
      year: paramsValidator(params?.year),
      purchase_id: paramsValidator(params?.purchase_id),
      specialist_ids: paramsValidator(params?.specialist_ids?.length)
        ? params?.specialist_ids?.map((el) => el)
        : null,
      paid_from: paramsValidator(params?.paid_from),
      paid_to: paramsValidator(params?.paid_to),
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
      columns: paramsValidator(params.columns.length) ? params.columns.map((el) => el.field) : null
    }
  });
  return data;
};

export const getFavourite = async (params: IPurchaseParams, mounted?: boolean) => {
  const data = await API.get<IPurchResponse>(`/favourite-purchases`, {
    params: {
      month: paramsValidator(params?.month),
      year: paramsValidator(params?.year),
      purchase_id: paramsValidator(params?.purchase_id),
      specialist_ids: paramsValidator(params?.specialist_ids?.length)
        ? params?.specialist_ids?.map((el) => el)
        : null,
      paid_from: paramsValidator(params?.paid_from),
      paid_to: paramsValidator(params?.paid_to),
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
      page: !mounted ? paramsValidator(params.page) : 1,
      per_page: paramsValidator(params.per_page),
      type_ids: paramsValidator(params.types_ids?.length) ? params.types_ids?.map((el) => el) : null
    }
  });
  return data;
};

export const getFavouriteNonFilters = async (params: IPurchaseParams, mounted?: boolean) => {
  const data = await API.get<IPurchResponse>(`/favourite-purchases`, {
    params: {
      month: paramsValidator(params?.month),
      year: paramsValidator(params?.year),
      purchase_id: paramsValidator(params?.purchase_id),
      specialist_ids: paramsValidator(params?.specialist_ids?.length)
        ? params?.specialist_ids?.map((el) => el)
        : null,
      paid_from: paramsValidator(params?.paid_from),
      paid_to: paramsValidator(params?.paid_to),
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
      with_filters: false,
      page: !mounted ? paramsValidator(params.page) : 1,
      per_page: paramsValidator(params.per_page)
    }
  });
  return data;
};

export const deleteFavourite = async (id: string | number) => {
  API.delete(`/favourite-purchases/${id}`);
};

export const deleteFavouriteArr = async (ids: (string | number)[]) => {
  API.delete(`/favourite-purchases`, { data: { purchase_ids: ids } });
};

export const getFavouriteTypes = async () => {
  const data = API.get(`favourite-purchases/types`);
  return data;
};

export const getFavouriteBrief = async () => {
  const data = API.get('/favourite-purchases/brief');

  return data;
};
