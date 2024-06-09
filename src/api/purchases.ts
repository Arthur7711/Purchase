import { API } from './API';
import type { IPurchase, IPurchaseNew } from '@/views/purchases/components/dialogs/types';

const createItemName = async (name: string) => {
  const { data } = await API.post('/nomenclature/item-names', {
    name
  });

  return data;
};

const createPurchase = async (purchase: IPurchaseNew) => {
  const { data } = await API.post('/purchases', {
    ...purchase
  });

  return data;
};

const changePurchase = async (purchase: IPurchase) => {
  const { data } = await API.put(`/purchases/${purchase.id}`, {
    ...purchase
  });

  return data;
};

const getPurchase = async (id: number) => {
  const { data } = await API.get(`/purchases/${id}`);

  return data;
};

const changeStatusPurchase = async (id: number, status_id: number) => {
  const { data } = await API.patch(`/purchases/${id}/status`, {
    status_id
  });

  return data;
};

const changePurposePurchase = async (id: number, purpose_id: number, activated_at?: string) => {
  const { data } =
    !activated_at && activated_at !== null
      ? await API.patch(`/purchases/${id}/purpose`, {
          purpose_id
        })
      : await API.patch(`/purchases/${id}/purpose`, {
          purpose_id,
          activated_at
        });

  return data;
};

const changeBudgetPurchase = async (id: number, budget_id: number) => {
  const { data } = await API.patch(`/purchases/${id}/budget`, {
    budget_id
  });

  return data;
};

const changeWarehousePurchase = async (id: number, warehouse_id: number) => {
  const { data } = await API.patch(`/purchases/${id}/warehouse`, {
    warehouse_id
  });

  return data;
};
const changeTaskIDPurchase = async (id: number, task_id: number) => {
  const { data } = await API.patch(`/purchases/${id}/task`, {
    task_id
  });

  return data;
};

export {
  createPurchase,
  createItemName,
  getPurchase,
  changeStatusPurchase,
  changePurposePurchase,
  changeBudgetPurchase,
  changeWarehousePurchase,
  changeTaskIDPurchase,
  changePurchase
};
