import type { IPurchase, IPurchaseNew } from '../../dialogs/types';

export interface PropsCardLayout {
  type: string;
  purchase: IPurchase | IPurchaseNew | null;
  validation: { purchase_data: { [key: string]: string } } | null;
  taskId: string | null;
  isLoading: boolean;
  showPurch: boolean;
  isCompletedPurchase?: boolean;
  isCompletedGroups: boolean;
}
