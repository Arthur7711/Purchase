export interface IContragent {
  id: number;
  website: string;
  pending_purchases_count: number;
  received_purchases_count: number;
  canceled_purchases_count: number;
  name: string;
  inn: string;
  latest_frame_contract?: {
    delivery_date: string;
    document_date: string;
  };
}
export interface ISearchContragents {
  address: null | string;
  business_type: null | string;
  eliminated_at: null | string;
  head_name: string;
  head_position: null | string;
  inn: null | string;
  invalidated_at: null | string;
  kpp: null | string;
  name: null | string;
  ogrn: null | string;
  registered_at?: string;
  shortname?: string;
  token: string;
}
export interface IDocumentCreate {
  doc_number: string;
  doc_type: string;
  start_date: string;
  end_date: string;
  file: File | null;
  fileName: string;
  legal_entity?: string;
}
export interface ICreateContragent {
  name: string;
  business_type: string;
  // shortname: string
  head_name: string;
  head_position: string;
  registered_at: string;
  invalidated_at: string;
  contact_email: string;
  website: string;
  bank_account: string;
  bank: string;
  inn: string;
  bik: string;
  contact_position: string;
  login: string;
  password: string;
  kpp: string;
  document_number: string;
  contact_phone: string;
  eliminated_at: string;
  contact_person: string;
  ogrn: string;
  address: string;
  token: string;
  corr_account: string;
  account_holder: string;
}
export interface IUniqueNames {
  id: number;
  name: string;
  items_count: number;
}
export interface iEditConragentInfo {
  id: number;
  name: string | null;
  inn: string | null;
  business_type: string | null;
  shortname: string | null;
  address: string | null;
  ogrn: string | null;
  registered_at: string | null;
  kpp: string | null;
  head_position: string | null;
  head_name: string | null;
  eliminated_at: string | null;
  invalidated_at: string | null;
  website: string | null;
  auth_datum: {
    login: string | null;
    password: string | null;
  } | null;
  contact: {
    person: string | null;
    position: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  bank_data: {
    account_holder: string | null;
    bank: string | null;
    bank_account: string | null;
    corr_account: string | null;
    bik: string | null;
    document_number: string | null;
  } | null;
  purchases_count: number;
  pending_purchases_count: number;
  received_purchases_count: number;
  cancelled_purchases_count: number;
}
export interface IGetTimeline {
  labels: string[];
  datasets: [
    {
      label: string;
      data: {
        total_price: number;
        total_price_aux: number;
        purchases_count: number;
      }[];
    }
  ];
}
export interface ITimeline {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      borderColor: 'blue';
      borderWidth: 1.5;
    }
  ];
}
export interface IDocumentEdit {
  doc_number: string;
  doc_type: string;
  start_date: string;
  end_date: string;
  fileName: string;
  id: number;
  document_type_number: string;
  legal_entity?: string;
}
