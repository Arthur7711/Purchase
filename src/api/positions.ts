import type { IPosition } from '@/views/purchases/components/dialogs/types';
import { API } from './API';
// import type { IPosition } from '@/views/purchases/components/dialogs/types';

const getPosition = async (id: number) => {
  const { data } = await API.get(`/purchase-items/${id}`);

  return data;
};

const changePosition = async (position: IPosition) => {
  const { data } = await API.put(`/purchase-items/${position.id}`, {
    ...position
  });

  return data;
};

export { getPosition, changePosition };
