import { API } from './API';
import useCommonsInfo from '@/store/purchases_store/commons';
import { getBudgetExp } from '@/api/expenses';
import { getOfficePurposes } from '@/api/offices';
import useBudgetExp from '@/store/expenses_store/budget_exp';
import { getSafes } from './safes';
import useSafes from '@/store/safes';

export interface IRates {
  [key: string]: number;
}
interface IParamsTypes {
  with_subtypes?: boolean;
  location_id?: number;
}

interface IParamsRates {
  date?: string | null;
  currencies?: string[] | null;
}

interface IDocType {
  id: string | number;
  name: string;
  entity_types: string[];
}

// commons for the purchasing modal
const getSpecialists = async () => {
  const { data } = await API.get('/specialists');
  return data;
};

const getContragents = async () => {
  const { data } = await API.get('/ref/contragents');
  return data;
};

const getPaymentTypes = async () => {
  const { data } = await API.get('/ref/payment-types');
  return data;
};

const getRates = async (paramsRates: IParamsRates = {}) => {
  const { data } = await API.get<IRates>('/ref/exchange-rates', {
    params: paramsRates
  });
  return data;
};

const getItemNames = async () => {
  const { data } = await API.get('/ref/item-names');
  return data;
};

const getTypes = async (paramsTypes: IParamsTypes = {}) => {
  const { data } = await API.get('/ref/types', {
    params: paramsTypes
  });
  return data;
};

const getMeasureUnits = async () => {
  const { data } = await API.get('/ref/measure-units');
  return data;
};

const getWarehouses = async (location_id?: number) => {
  const { data } = await API.get('/ref/warehouses', { params: { location_id } });
  return data;
};

export const getLegalEntities = async () => {
  const { data } = await API.get(`/ref/legal-entities`);
  return data;
};
const getPayingTypes = async () => {
  const { data } = await API.get(`/ref/paying-types`);
  return data;
};

export const getCardHolders = async () => {
  const { data } = await API.get(`/ref/card-holders`);
  return data;
};

const getAllDataPurchase = async (location_id?: number) => {
  if (!useCommonsInfo.isActualCommonsCard.value) {
    const APIes = {
      legalEntities: getLegalEntities,
      specialists: getSpecialists,
      contragents: getContragents,
      paymentTypes: getPaymentTypes,
      itemNames: getItemNames,
      measureUnits: getMeasureUnits,
      cardHolders: getCardHolders,
      payingTypes: getPayingTypes
    };

    Object.entries(APIes).forEach(async (item) => {
      const result = await item[1]();

      useCommonsInfo.setCommons({ name: item[0], value: result });
    });
    if (location_id) {
      await Promise.all([
        getWarehouses(location_id).then((res) =>
          useCommonsInfo.setCommons({ name: 'warehouses', value: res })
        ),
        getTypes({ with_subtypes: true, location_id }).then((res) =>
          useCommonsInfo.setCommons({ name: 'types', value: res })
        ),
        getOfficePurposes().then((res) =>
          useCommonsInfo.setCommons({ name: 'purposes', value: res.data })
        ),
        getBudgetExp().then((res) => useBudgetExp.setAllBudgetExp(res.data)),
        getSafes(location_id).then((res) => useSafes.setSafes(res))
      ]);
    } else {
      await Promise.all([
        getWarehouses().then((res) =>
          useCommonsInfo.setCommons({ name: 'warehouses', value: res })
        ),
        getTypes({ with_subtypes: true }).then((res) =>
          useCommonsInfo.setCommons({ name: 'types', value: res })
        ),
        getOfficePurposes().then((res) =>
          useCommonsInfo.setCommons({ name: 'purposes', value: res.data })
        ),
        getBudgetExp().then((res) => useBudgetExp.setAllBudgetExp(res.data)),
        getSafes().then((res) => useSafes.setSafes(res))
      ]);
    }

    useCommonsInfo.setIsActualCommons(true);
  }
};

// general commons
const getPaymentStatuses = async () => {
  const { data } = await API.get('/ref/payment-statuses');
  return data;
};

const getProductStatuses = async () => {
  const { data } = await API.get('/ref/product-statuses');
  return data;
};

const getDocTypes = async () => {
  const data = API.get<IDocType[]>('/ref/document-types');
  return data;
};

const getAllData = async () => {
  const APIes = {
    paymentStatuses: getPaymentStatuses,
    productStatuses: getProductStatuses,
    document_types: getDocTypes
  };

  Object.entries(APIes).forEach(async (item) => {
    const result = await item[1]();

    if (item[0] === 'document_types') {
      useCommonsInfo.setCommons({
        name: 'document_types_purchase',
        value: result.data.filter((el: IDocType) => el.entity_types.includes('purchase'))
      });
      useCommonsInfo.setCommons({
        name: 'document_types_contragent',
        value: result.data.filter((el: IDocType) => el.entity_types.includes('contragent'))
      });
    } else {
      useCommonsInfo.setCommons({ name: item[0], value: result });
    }
  });
};

export {
  getSpecialists,
  getContragents,
  getPaymentTypes,
  getPaymentStatuses,
  getRates,
  getItemNames,
  getDocTypes,
  getProductStatuses,
  getAllDataPurchase,
  getAllData
};
