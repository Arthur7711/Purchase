import { API, APIFormData } from './API';
import type { ISpecialist } from '@/store/purchases_store/commons';

export interface IComment {
    id: number,
    user_id: number,
    files: {
        delivery_date: string | null
        document_date: string | null
        document_number: number | string | null
        document_type: number | null
        entity_id: number
        entity_type: string
        file_name: string
        file_type: number
        id: number
        real_name: string
    }[]
    created_at: string,
    entity_type: string,
    entity_id: number,
    comment: string,
    user: ISpecialist
}

export interface ICreateComment {
  file: File | null
}

const getPurchaseComments = async (id: number) => {
    const { data } = await API.get(`/purchases/${id}/comments`
    )
    
    return data
};

const postPurchaseComments = async (entity_id: number, comment: string) => {
    const {data} = await API.post(`/comments`, {
        entity_type: 'purchase',
        entity_id,
        comment
    })
    return data
};

const deletePurchaseComments = async (id: number) => {
    const data = await API.delete(`/comments/${id}`)
    return data
};

const postCommentFile = async ({
  requestData,
  id,
  entity_type = 'comment',
  file_type
}: {
  requestData:  ICreateComment
  id: number
  entity_type: string
  file_type: string | null
  
}) => {
  const formData = new FormData()
  if (requestData.file) {
    formData.append('file', requestData.file)
    formData.append('entity_type', entity_type)
    if (file_type) formData.append('file_type', file_type)
    formData.append('entity_id', `${id}`)
    
    const data = await APIFormData.post('attachments', formData)
    return data
  }
}



export { getPurchaseComments, postPurchaseComments, deletePurchaseComments, postCommentFile }