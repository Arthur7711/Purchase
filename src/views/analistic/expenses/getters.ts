import {
  getOverviewStatistics,
  getPurposesSummary,
  getSubtypesSummary,
  getTypesSummary
} from '@/api/expenses'
import useBudgetExp from '../../../store/expenses_store/budget_exp'
import useLegalExp from '../../../store/expenses_store/legal_exp'
import useDateFrom from '../../../store/dateFrom'
import useDateTo from '../../../store/dateTo'
import useTypesExp from '../../../store/expenses_store/types_exp'
import useSubTypesExp from '../../../store/expenses_store/sub_types_exp'
import usePurposesExp from '../../../store/expenses_store/purposes_exp'

export const handleGetterTopUpdata = (onlyPaid: number | string) => {
  getPurposesSummary({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    onlyPaid: onlyPaid,
    legalId: useLegalExp.selectedLegalExp.value,
    budgetId: useBudgetExp.selectedBudgetExp.value
  })
    .then((data) => {
      usePurposesExp.setAllPurposesExp(data.data)
    })
  useTypesExp.allTypesExp.value = null
  useSubTypesExp.allSubTypesExp.value = null
}

export const handleGetterPurpChange = (onlyPaid: number | string) => {
  getTypesSummary({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    onlyPaid: onlyPaid,
    legalId: useLegalExp.selectedLegalExp.value,
    budgetId: useBudgetExp.selectedBudgetExp.value,
    purposeIds: usePurposesExp.selectedPurposesExp.value?.length
      ? usePurposesExp.selectedPurposesExp.value?.map((el) => el.id)
      : null
  })
    .then((data) => {
      useTypesExp.setAllTypesExp(data.data)
    })
}

export const handleGetterTypeChange = (onlyPaid: string | number) => {
  getSubtypesSummary({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    onlyPaid: onlyPaid,
    legalId: useLegalExp.selectedLegalExp.value,
    budgetId: useBudgetExp.selectedBudgetExp.value,
    purposeIds: usePurposesExp.selectedPurposesExp.value?.length
      ? usePurposesExp.selectedPurposesExp.value?.map((el) => el.id)
      : null,
    typeIds: useTypesExp.selectedTypesExp.value?.length
      ? useTypesExp.selectedTypesExp.value.map((el) => el.id)
      : null
  })
    .then((data) => {
      useSubTypesExp.setAllSubTypesExp(data.data)
    })
}

export const handleGetterDateChange = (onlyPaid: string | number) => {
  getPurposesSummary({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    onlyPaid: onlyPaid,
    legalId: useLegalExp.selectedLegalExp.value,
    budgetId: useBudgetExp.selectedBudgetExp.value
  })
    .then((data) => {
      usePurposesExp.setAllPurposesExp(data.data)
    })
}

export const handleGetterDatePurpChange = (onlyPaid: number | string) => {
  getTypesSummary({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    onlyPaid: onlyPaid,
    legalId: useLegalExp.selectedLegalExp.value,
    budgetId: useBudgetExp.selectedBudgetExp.value,
    purposeIds: usePurposesExp.selectedPurposesExp.value?.length
      ? usePurposesExp.selectedPurposesExp.value?.map((el) => el.id)
      : null
  })
    .then((data) => {
      useTypesExp.setAllTypesExp(data.data)
    })
}

export const handleGetterDateTypeChange = (onlyPaid: string | number) => {
  getSubtypesSummary({
    dateFrom: useDateFrom.dateFrom.value,
    dateTo: useDateTo.dateTo.value,
    onlyPaid: onlyPaid,
    legalId: useLegalExp.selectedLegalExp.value,
    budgetId: useBudgetExp.selectedBudgetExp.value,
    purposeIds: usePurposesExp.selectedPurposesExp.value?.length
      ? usePurposesExp.selectedPurposesExp.value?.map((el) => el.id)
      : null,
    typeIds: useTypesExp.selectedTypesExp.value?.length
      ? useTypesExp.selectedTypesExp.value.map((el) => el.id)
      : null
  })
    .then((data) => {
      useSubTypesExp.setAllSubTypesExp(data.data)
    })
}




