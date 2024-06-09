import { API } from './API'

const getApprovalsTask = async (task_id: number) => {
    const { data } = await API.get(`/tasks/${task_id}/approvals`
    )
    
    return data
}

const getApprovalsPurchase = async (str: string) => {
    const { data } = await API.get(`/approvers`, {
        params:
            { q: str }
        }
    )
    
    return data
}

const deleteApprovals = async (item_ids: (number | undefined)[] ) => {
    const { data } = await API.delete(`/purchase-items/approval`, {
        data: { item_ids }
        }
    )
    
    return data
}

const setTaskApprover = async (item_ids: (number | undefined)[], approval_id: number ) => {
    const { data } = await API.patch(`/purchase-items/task-approval`, {
        item_ids, approval_id
        }
    )
    
    return data
}

const setPurchaseApprover = async (item_ids: (number | undefined)[], user_id: number, purchase_id: number ) => {
    const { data } = await API.post(`/purchases/${purchase_id}/accepted-approvals`, {
        item_ids, user_id
        }
    )
    
    return data
}

const sendApprovalRequest = async (item_ids: (number | undefined)[], user_id: number, purchase_id: number, description: string | null ) => {
    const { data } = await API.post(`/purchases/${purchase_id}/approvals`, {
            item_ids, user_id, description
        }
    )
    
    return data
}

export {  getApprovalsTask, getApprovalsPurchase, deleteApprovals, setTaskApprover, setPurchaseApprover, sendApprovalRequest }