import { format } from 'date-fns';
import { API } from './API';

export interface IPurposesOffices {
  id: number | string;
  name: string;
  is_by_office_staff: boolean;
  default_budget: {
    id: number;
    max_sum: number | null;
    name: string;
    office_id: number;
  } | null;
}

export const getOfficePurposes = async () => {
  const data = API.get<IPurposesOffices[]>(`/ref/purposes`);
  return data;
};

export interface IOfficesOverview {
  id: number;
  name: string;
  aux_price_sum: string | number;
  prev_aux_price_sum: string | number;
  staff_avg: string | number;
  prev_staff_avg: string | number;
  per_staff_aux_price_sum: string | number;
  prev_per_staff_aux_price_sum: string | number;
  diff_per_staff_aux_price_sum: string | number;
  percent_per_staff_aux_price_sum: string | number;
}

export const getOfficesOverview = async (date_from: string, date_to: string) => {
  const data = API.get<IOfficesOverview[]>(`/statistics/offices/overview`, {
    params: {
      date_from: date_from ? date_from : format(new Date(), 'YYYY-dd-mm'),
      date_to: date_to
    }
  });
  return data;
};

interface Label {
  id: number;
  name: string;
  is_by_office_staff: boolean;
}

interface DataItem {
  aux_price_sum: number;
  prev_aux_price_sum: number;
  per_staff_aux_price_sum: number;
  prev_per_staff_aux_price_sum: number;
  diff_per_staff_aux_price_sum: number;
  percent_per_staff_aux_price_sum: number;
  per_office_staff_aux_price_sum: number;
  prev_per_office_staff_aux_price_sum: number;
  diff_per_office_staff_aux_price_sum: number;
  percent_per_office_staff_aux_price_sum: number;
}

export interface Dataset {
  label: {
    id: number;
    name: string;
    staff_avg: number;
    prev_staff_avg: number;
    office_staff_avg: number;
    prev_office_staff_avg: number;
  };
  data: DataItem[];
}

export interface IOfficeTableData {
  labels: Label[];
  datasets: Dataset[];
}

interface IGetOfficesTable {
  date_to: string;
  date_from: string;
  offices_ids?: (string | number)[] | null;
  purpose_ids?: (string | number)[] | null;
}
export const getOfficesTableData = async (params: IGetOfficesTable) => {
  const data = API.get<IOfficeTableData>('/statistics/offices/details', {
    params: {
      date_from: params.date_from,
      date_to: params.date_to,
      office_ids: params.offices_ids ? params.offices_ids : null,
      purpose_ids: params.purpose_ids ? params.purpose_ids : null
    }
  });
  return data;
};
