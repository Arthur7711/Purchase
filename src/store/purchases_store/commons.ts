import { ref } from 'vue';
import type { CardHolder } from '../../api/purchasesTable';
import type { IPurposesOffices } from '@/api/offices';

export interface ISpecialist {
  id: number;
  samaccountname: string;
  displayname: string;
  description: string;
  title?: string;
  vacation?: IVacation | null;
}

export interface IVacation {
  id: number;
  date_from: string | null;
  date_to: string | null;
  vacation_status: number | null;
  vacation_type: number | null;
  type: {
    id: number;
    name: string;
    eng_name: string;
  } | null;
}

export interface ILegalExp {
  id: number;
  name: string;
  office_id: number;
  is_default: boolean;
}

export interface ILegalCurrency {
  legal_id: number;
  type_id: number;
  currencies: string[];
}

export interface IPaymentType {
  id: number;
  name: string;
  icon: string;
  legal_currencies: ILegalCurrency[];
}

export interface ICommonDefault {
  id: number;
  name: string;
}

export interface IDocTypes {
  id: string | number;
  name: string;
  entity_types: string[];
}

export interface IMeasureUnit {
  id: number;
  name: string;
  is_integer: boolean;
  shortname: string;
}

export interface IType {
  id: number;
  name: string;
  subtypes: ICommonDefault[];
}

const useCommonsInfo = () => {
  const isActualCommonsCard = ref(false);
  const commons = ref<{
    [key: string]:
      | ICommonDefault[]
      | ISpecialist[]
      | IPaymentType[]
      | ILegalExp[]
      | IDocTypes[]
      | IMeasureUnit[]
      | CardHolder[]
      | IPurposesOffices[];
  }>({
    specialists: [],
    contragents: [],
    paymentTypes: [],
    payingTypes: [],
    paymentStatuses: [],
    productStatuses: [],
    document_types_purchase: [],
    document_types_contragent: [],
    itemNames: [],
    types: [],
    measureUnits: [],
    legalEntities: [],
    cardHolders: [],
    warehouses: [],
    purposes: []
  });

  const setCommons = (payload: {
    name: string;
    value:
      | ICommonDefault[]
      | ISpecialist[]
      | IPaymentType[]
      | ILegalExp[]
      | IDocTypes[]
      | IMeasureUnit[]
      | CardHolder[]
      | IPurposesOffices[];
  }) => {
    commons.value[payload.name] = payload.value;
  };

  const setIsActualCommons = (value: boolean) => {
    isActualCommonsCard.value = value;
  };

  return {
    isActualCommonsCard,
    setIsActualCommons,
    commons,
    setCommons
  };
};

export default useCommonsInfo();
