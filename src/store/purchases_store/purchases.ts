import { ref, computed } from 'vue';
import type {
  IPurchase,
  IPosition,
  IPurchaseNew
} from '@/views/purchases/components/dialogs/types';
import type { IDocumentPurchase } from '@/api/attachments';

const usePurchasesInfo = () => {
  const updateTablePurchases = ref(false);
  const updateTablePositions = ref(false);
  const selectedPurchase = ref<IPurchase | null>(null);
  const selectedNewPurchase = ref<IPurchaseNew | null>(null);
  const selectedPosition = ref<IPosition | null>(null);
  const selectedCurtailedPurchIndex = ref<number | null>(null);
  const selectedCurtailedPosIndex = ref<number | null>(null);
  const docsPurchase = ref<IDocumentPurchase[]>([]);
  const pricePurchase = ref<number>(0);
  const changePurpose = ref(false);
  const curtailedPurchases = ref<(IPurchase | IPurchaseNew)[]>([]);
  const curtailedPositions = ref<IPosition[]>([]);

  const countNewCurtailedPurchase = computed(() =>
    curtailedPurchases.value.reduce((acc, prev) => {
      if (!prev?.id) {
        return (acc += 1);
      } else return (acc += 0);
    }, 0)
  );

  const setUpdateTable = (value: boolean) => {
    updateTablePurchases.value = value;
  };

  const setSelectedIndex = (value: number | null) => {
    selectedCurtailedPurchIndex.value = value;
  };

  const setSelectedIndexPos = (value: number | null) => {
    selectedCurtailedPosIndex.value = value;
  };

  const addCurtailedPurchase = (value: IPurchase | IPurchaseNew) => {
    if (selectedCurtailedPurchIndex.value !== null) {
      curtailedPurchases.value.splice(selectedCurtailedPurchIndex.value, 0, value);

      setSelectedIndex(null);
    } else {
      curtailedPurchases.value.push(value);
    }
  };

  const addCurtailedPosition = (value: IPosition) => {
    if (selectedCurtailedPosIndex.value !== null) {
      curtailedPositions.value.splice(selectedCurtailedPosIndex.value, 0, value);

      setSelectedIndexPos(null);
    } else {
      curtailedPositions.value.push(value);
    }
  };

  const deleteCurtailedPurchase = (index: number) => {
    curtailedPurchases.value.splice(index, 1);

    selectedCurtailedPurchIndex.value = index;
  };

  const deleteCurtailedPosition = (index: number) => {
    curtailedPositions.value.splice(index, 1);
    selectedCurtailedPosIndex.value = index;
  };

  const setLocaleStorageCurtailedPurchase = (value: (IPurchase | IPurchaseNew)[]) => {
    localStorage.setItem('purchases', JSON.stringify(value));
  };

  const getLocaleStorageCurtailedPurchase = () => {
    const purchs: string | null = localStorage.getItem('purchases');

    if (purchs) {
      curtailedPurchases.value = JSON.parse(purchs);
    }
  };

  const setLocaleStorageCurtailedPosition = (value: IPosition[]) => {
    localStorage.setItem('positions', JSON.stringify(value));
  };

  const getLocaleStorageCurtailedPosition = () => {
    const positions: string | null = localStorage.getItem('positions');

    if (positions) {
      curtailedPositions.value = JSON.parse(positions);
    }
  };

  const setCurtailedPurchases = (value: (IPurchase | IPurchaseNew)[]) => {
    curtailedPurchases.value = value;
  };

  const setCurtailedPositions = (value: IPosition[]) => {
    curtailedPositions.value = value;
  };

  const setUpdatePositionTable = (value: boolean) => {
    updateTablePositions.value = value;
  };

  const setSelectedPurchase = (purchase: IPurchase | null) => {
    selectedPurchase.value = purchase;
  };

  const setSelectedNewPurchase = (purchase: IPurchaseNew | null) => {
    selectedNewPurchase.value = purchase;
  };

  const setChangePurpose = (value: boolean) => {
    changePurpose.value = value;
  };

  const setSelectedPosition = (position: IPosition | null) => {
    selectedPosition.value = position;
  };

  const setDocsPurchase = (docs: IDocumentPurchase[]) => {
    docsPurchase.value = docs;
  };

  const setPricePurchase = (price: number) => {
    pricePurchase.value = price;
  };

  return {
    changePurpose,
    curtailedPurchases,
    docsPurchase,
    pricePurchase,
    updateTablePurchases,
    updateTablePositions,
    selectedPurchase,
    selectedPosition,
    selectedNewPurchase,
    setSelectedPurchase,
    setSelectedNewPurchase,
    setUpdatePositionTable,
    setSelectedPosition,
    setCurtailedPurchases,
    setSelectedIndex,
    addCurtailedPurchase,
    deleteCurtailedPurchase,
    setLocaleStorageCurtailedPurchase,
    getLocaleStorageCurtailedPurchase,
    setUpdateTable,
    setDocsPurchase,
    setPricePurchase,
    setChangePurpose,
    countNewCurtailedPurchase,
    addCurtailedPosition,
    deleteCurtailedPosition,
    setLocaleStorageCurtailedPosition,
    getLocaleStorageCurtailedPosition,
    setCurtailedPositions,
    curtailedPositions,
    setSelectedIndexPos
  };
};

export default usePurchasesInfo();
