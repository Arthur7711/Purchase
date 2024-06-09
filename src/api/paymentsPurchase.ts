import { API } from './API';

export interface ICreatePayment {
  date: string | null;
  type_id: number | null;
  price: number | null;
  debited_price: number | null;
  note?: string | null;
  document_id?: number | null;
}

export interface IPaymentDoc {
  id: number;
  file_name: string;
  file_type: number | null;
  entity_type: string;
  entity_id: number;
  real_name: string;
  document_type: number;
  document_number: string | null;
  document_date: string | null;
  delivery_date: string | null;
}

export interface IPayment {
  id: number;
  purchase_id: number;
  date: string;
  type_id: string;
  price: number;
  currency: string;
  debited_price: number;
  debited_currency: string;
  note: string | null;
  document_id: number | null;
  paying_type: {
    id: number;
    name: string;
  };
  document: IPaymentDoc | null;
}

const getPaymentsPurchase = async (id: number) => {
  const { data } = await API.get(`/purchases/${id}/payings`);

  return data;
};

const createPaymentPurchase = async (purchase_id: number, payment: ICreatePayment) => {
  const { data } = await API.post(`/purchases/${purchase_id}/payings`, {
    ...payment
  });

  return data;
};

const editPaymentPurchase = async (
  purchase_id: number,
  paying_id: number,
  payment: ICreatePayment
) => {
  const { data } = await API.put(`/purchases/${purchase_id}/payings/${paying_id}`, {
    ...payment
  });

  return data;
};

const deletePaymentPurchase = async (purchase_id: number, paying_id: number) => {
  const data = await API.delete(`/purchases/${purchase_id}/payings/${paying_id}`);
  return data;
};

export { getPaymentsPurchase, createPaymentPurchase, editPaymentPurchase, deletePaymentPurchase };
