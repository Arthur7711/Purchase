import { API, APIFormData } from './API';
import type { ICreateContragent, IDocumentCreate } from '../views/suppliers/types';

import { format } from 'date-fns';

export const getContragents = async (param?: {
  name?: string;
  inn?: string;
  page?: number;
  is_active_contract?: boolean;
  legal_id?: number
}) => {
  const data = await API.get('contragents', { params: { per_page: 50, ...param } });
  return data;
};
export const searchContragents = async (q: string) => {
  const { data } = await API.get('contragents/search', { params: { q } });
  return data;
};
export const getFileTypes = async () => {
  const data = await API.get('ref/file-types');
  return data;
};
export const getDocumentTypes = async () => {
  const data = await API.get('ref/document-types');
  return data;
};

export interface ILegal {
  id: number;
  name: string;
  office_id: number;
  is_default: boolean;
}

export const getLegalEntities = async () => {
  const data = await API.get<ILegal[]>('/ref/legal-entities');
  return data;
};

export const postContragent = async (requestData: ICreateContragent) => {
  const data = await API.post('contragents', {
    ...requestData,
    eliminated_at: requestData.eliminated_at
      ? format(new Date(requestData.eliminated_at), 'y-MM-dd')
      : '',
    invalidated_at: requestData.invalidated_at
      ? format(new Date(requestData.invalidated_at), 'y-MM-dd')
      : ''
  });
  return data;
};
export const postContragentFile = async ({
  requestData,
  id,
  entity_type = 'contragent'
}: {
  requestData: IDocumentCreate;
  id: number;
  entity_type?: string;
  file_type?: string;
}) => {
  const formData = new FormData();
  if (requestData.file) {
    formData.append('file', requestData.file);
    formData.append('entity_type', entity_type);
    formData.append('document_type', requestData.doc_type);
    formData.append('entity_id', `${id}`);
    requestData.doc_number ? formData.append('document_number', requestData.doc_number) : null;
    requestData.legal_entity ? formData.append('legal_id', requestData.legal_entity) : null;
    requestData.start_date
      ? formData.append('document_date', format(new Date(requestData.start_date), 'y-MM-dd'))
      : null;
    requestData.end_date
      ? formData.append('delivery_date', format(new Date(requestData.end_date), 'y-MM-dd'))
      : null;
    const data = await APIFormData.post('attachments', formData);
    return data;
  }
};

export const getEditContragentInfo = async (id: string) => {
  const data = await API.get(`contragents/${id}`);
  return data;
};
export const editContragentInfo = async (id: string, requestData: ICreateContragent) => {
  const data = await API.put(`contragents/${id}`, requestData);
  return data;
};
export const deleteContragentInfo = async (id: string) => {
  const data = await API.delete(`contragents/${id}`);
  return data;
};
export const getUniqueNames = async (id: string) => {
  const data = await API.get(`contragents/${id}/item-names`);
  return data;
};
export const getSupplierTimeline = async (id: string) => {
  const data = await API.get(`/statistics/contragents/timeline`, {
    params: { id, date_from: '0001-01-01', date_to: '0001-01-01' }
  });
  return data;
};
export const getSupplierSummary = async (id: string) => {
  const data = await API.get(`/statistics/contragents/summary`, {
    params: { id, date_from: '0001-01-01', date_to: '0001-01-01' }
  });
  return data;
};
export const getSupplierTypesSummary = async ({
  contragent_id,
  date_from,
  date_to,
  only_paid
}: {
  contragent_id: string;
  date_from: string;
  date_to: string;
  only_paid: number;
}) => {
  const data = await API.get(`/statistics/types/summary`, {
    params: { contragent_id, date_from, date_to, only_paid }
  });
  return data;
};
export const getSupplierComments = async (id: string) => {
  const data = await API.get(`/contragents/${id}/comments`);
  return data;
};
export const postSupplierComments = async ({
  entity_type = 'contragent',
  entity_id,
  comment
}: {
  entity_type?: string;
  entity_id: number;
  comment: string;
}) => {
  const data = await API.post(`/comments`, {
    entity_type,
    entity_id,
    comment
  });
  return data;
};
export const deleteSupplierComments = async (id: number) => {
  const data = await API.delete(`/comments/${id}`);
  return data;
};
export const getAttachements = async (id: string, params: { [key: string]: number | string }) => {
  const data = await API.get(`/contragents/${id}/attachments`, {
    params: {
      per_page: 100,
      ...params
    }
  });
  return data;
};
export const EditAttachements = async ({
  file_id,
  real_name,
  document_type,
  document_number,
  document_date,
  delivery_date,
  legal_id
}: {
  file_id: string | number;
  real_name?: string;
  document_type?: number;
  document_number?: string;
  document_date?: string;
  delivery_date?: string;
  legal_id?: string | number;
}) => {
  const data = await API.patch(`/attachments/${file_id}`, {
    real_name: real_name || '',
    document_type,
    document_number: document_number || '',
    document_date: document_date ? format(new Date(document_date), 'y-MM-dd') : '',
    delivery_date: delivery_date ? format(new Date(delivery_date), 'y-MM-dd') : '',
    legal_id: legal_id
  });
  return data;
};
export const deleteAttachements = async (file_id: number) => {
  const data = await API.delete(`/attachments/${file_id}`);
  return data;
};
