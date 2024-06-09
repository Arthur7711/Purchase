import { API, APIFormData } from './API';

export interface IDocumentPurchase {
  id: number;
  file_name: string;
  file_type: number;
  entity_type: string;
  entity_id: number;
  real_name: string;
  document_type: number;
  document_number: string | null;
  document_date: string | null;
  delivery_date: string | null;
  item_ids: number[];
  is_related: boolean;
}

export interface ICreateDocumentPurchase {
  id?: number;
  file?: File | null;
  file_name?: string | null;
  file_type: number | string | null;
  entity_id: number | null;
  entity_type: string;
  item_ids: number[];
  real_name?: string | null;
  document_type: number | null;
  document_number: string | null;
  document_date?: string | string[] | Date | Date[] | null;
  delivery_date?: string | string[] | Date | Date[] | null;
  price?: number | null;
  debited_price?: number | null;
}

const getDocsPurchase = async (id: number) => {
  const { data } = await API.get(`/purchases/${id}/attachments`);

  return data;
};

const postAttachment = async (info: ICreateDocumentPurchase) => {
  const formData = new FormData();
  type typeInfo = keyof typeof info;

  for (const key in info) {
    if (info[key as typeInfo])
      if (Array.isArray(info[key as typeInfo])) {
        if (info.document_type === 3 && info[key as typeInfo]) {
          const arr = info[key as typeInfo] as unknown[];
          arr.forEach((item: any) => {
            formData.append(`${key}[]`, item);
          });
        }
      } else {
        formData.append(key, info[key as typeInfo] as string | Blob);
      }
  }

  const { data } = await APIFormData.post('attachments', formData);
  return data;
};

const postRelatedAttachment = async (purchase_id: number, file_id: number) => {
  const { data } = await API.post(`/purchases/${purchase_id}/related-attachments`, { file_id });
  return data;
};

const deleteAttachment = async (file_id: number) => {
  const data = await API.delete(`/attachments/${file_id}`);
  return data;
};

const deleteRelatedAttachment = async (purchase_id: number, file_id: number) => {
  const data = await API.delete(`/purchases/${purchase_id}/related-attachments/${file_id}`);
  return data;
};

const editDocumentPurchase = async (
  file_id: number,
  document: {
    real_name?: string | null;
    document_type: string | number;
    item_ids: number[] | null;
    document_number: string | null;
    document_date: string | null;
    delivery_date: string | null;
  }
) => {
  let dataDocument: {
    real_name?: string | null;
    document_type: string | number;
    item_ids?: number[] | null;
    document_number: string | null;
    document_date: string | null;
    delivery_date?: string | null;
  } | null = null;

  if (document.document_type !== 3) {
    dataDocument = {
      real_name: document.real_name,
      document_type: document.document_type,
      document_number: document.document_number,
      document_date: document.document_date
    };
  } else dataDocument = { ...document };

  const { data } = await API.patch(`/attachments/${file_id}`, {
    ...dataDocument
  });
  return data;
};

const searchDocs = async (
  q: string,
  entity_type: string,
  page: number | null,
  except_entity_id?: number,
  per_page?: number | null
) => {
  const { data } = await API.get(`/attachments/search`, {
    params: {
      q,
      entity_type,
      page,
      except_entity_id,
      per_page
    }
  });
  return data;
};

export {
  getDocsPurchase,
  postAttachment,
  postRelatedAttachment,
  editDocumentPurchase,
  deleteAttachment,
  deleteRelatedAttachment,
  searchDocs
};
