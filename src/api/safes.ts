import { API } from './API';
import type { ISafe } from '@/store/safes';

const getSafes = async (location_id?: number) => {
  const { data } = location_id ? await API.get<ISafe[]>('/safes', { params: { location_id } }) : await API.get<ISafe[]>('/safes')
  return data
}


export { getSafes }