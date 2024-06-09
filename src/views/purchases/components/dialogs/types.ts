import type { ISpecialist } from '@/store/purchases_store/commons';
export interface IPurchase {
  id?: number;
  isChanged: boolean;
  is_favourite?: boolean;
  location_id?: number;
  specialist_id: number | null;
  description: string | null;
  purchase_date: string | null;
  comming_date: string | null;
  contragent_id: number | null;
  legal_id: number | null;
  payment_status_id: number | null;
  payment_type_id: number | null;
  card_holder_id: number | null;
  currency?: string | null;
  debited_currency: string | null;
  note: string | null;
  account_id: number | null;
  comments_count?: number | null;
  unread_comments_count?: number | null;
  info?: null | IInfoPurchase;
  groups: IGroup[];
  logs?: ILog[];
}

export interface IPurchaseNew {
  id?: number;
  id_new?: string;
  isChanged?: boolean;
  office_id: number | null;
  department_id: number | null;
  is_favourite?: boolean;
  location_id?: number;
  specialist_id: number | null;
  description: string | null;
  purchase_date: string | null;
  comming_date: string | null;
  contragent_id: number | null;
  legal_id: number | null;
  payment_status_id: number | null;
  payment_type_id: number | null;
  card_holder_id: number | null;
  currency?: string | null;
  debited_currency: string | null;
  note: string | null;
  account_id: number | null;
  comments_count?: number | null;
  unread_comments_count?: number | null;
  info?: null | IInfoPurchase;
  groups: IGroup[];
  logs?: ILog[];
  fav_clone?: null | number;
}

export interface IPosition {
  id: number;
  is_changed?: boolean;
  purchase_id: number;
  hash: string;
  currency: string;
  debited_currency: string;
  price: number;
  debited_price: number;
  name_id: number;
  type_id: number;
  sub_type_id: number | null;
  quantity: number;
  unit_id: number;
  status_id: number | null;
  purpose_id: number | null;
  budget_id: number | null;
  task_id: number | null;
  warehouse_id: number | null;
  activated_at: string | null;
  note: string | null;
  sn: string | null;
  item_name: {
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
  } | null;
  unit: {
    id: number;
    name: string;
  };
  approval: IApproval | null;
  logs: ILog[];
  transfers: ITransferPosition[];
}

export interface ITransferPosition {
  id: number;
  created_at: string;
  item_id: number;
  task_id: number;
  warehouse_id: number;
  active_id: number;
  warehouse: {
    id: number;
    name: string;
  };
}

export interface ILog {
  id: number;
  purchase_id: number;
  item_id: number | null;
  creator_id: number;
  data: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    description: string;
    displayname?: string;
  };
}
export interface IInfoPurchase {
  approve_status: string;
  id: number | null;
  items_sum_price: number | null;
  payings_sum_price: number | null;
  product_status: { id: number; name: string } | null;
  product_status_id: number | null;
}

export interface IGroup {
  hash?: string;
  name_id: number | null;
  type_id: number | null;
  sub_type_id: number | null;
  quantity: number | null;
  unit_id: number | null;
  debited_price: number | null;
  items: IItemGroup[];
  item_name?: { id: number; name: string } | null;
}

export interface IItemGroup {
  id?: number;
  is_new?: boolean;
  status_id: number | null;
  purpose_id: number | null;
  budget_id: number | null;
  task_id: number | null;
  warehouse_id: number | null;
  activated_at: string | null;
  note: string | null;
  approval: IApproval | null;
  sn?: string | null;
}

export interface IApproval {
  id: number;
  purchase_id: number;
  purchase_priority: null | string;
  status: string;
  type: string;
  user_id: number;
  user: ISpecialist;
}
