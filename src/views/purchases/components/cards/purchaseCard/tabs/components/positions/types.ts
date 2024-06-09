import type { IGroup } from '@/views/purchases/components/dialogs/types';

export interface PropGroupPositions {
  group: IGroup | null;
  isOnceGroup: boolean;
  commons: { [key: string]: { [key: number]: string } } | null;
  type: string;
  currency: string | null;
  isGeneratedDescription: boolean;
  taskId: string | null;
  paymentStatusId: number | null;
  indexGroup: number;
  description: string | null;
}
