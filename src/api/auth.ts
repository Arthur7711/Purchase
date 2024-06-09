import { API } from './API';

export const getAuthUser = async () => {
  const data = await API.get('user');

  return data;
};

export const getReferences = async () => {
  const data = await API.get('/ref/locations');
  return data;
};
export const updateReferences = async (location_id: number) => {
  const data = await API.patch('/user/location', { location_id });
  return data;
};
