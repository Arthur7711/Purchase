import { API } from './API';
interface IGetNomenclatureitems {
  type_id?: string;
  sub_type_id?: string;
  q?: string;
  search_mode?: string;
  order_by?: string;
  order_dir?: string;
  page?: string;
  per_page?: string;
}
export const getNomenclatureTypes = async () => {
  const data = await API.get('/nomenclature/types');
  return data;
};
export const getNomenclatureItemNames = async ({
  type_id,
  sub_type_id,
  q,
  search_mode,
  order_by,
  order_dir,
  page,
  per_page
}: IGetNomenclatureitems) => {
  const data = await API.get('/nomenclature/item-names', {
    params: {
      type_id,
      sub_type_id,
      q,
      search_mode,
      order_by,
      order_dir,
      page,
      per_page: 50
    }
  });
  return data;
};
export const unionNomenclatures = async ({
  ids,
  name
}: {
  ids: (string | number)[];
  name: string;
}) => {
  const res = await API.post('/nomenclature/item-names/union', { ids, name });
  return res;
};
export const editNomenclature = async ({ id, name }: { id: string | number; name: string }) => {
  const res = await API.put(`/nomenclature/item-names/${id}`, { name });
  return res;
};
export const deleteNomenclatures = async ({ ids }: { ids: (number | string)[] }) => {
  const res = await API.delete(`/nomenclature/item-names`, { data: { ids } });
  return res;
};
export const searchNomenclature = async (paramsData: {
  q: string;
  type_id?: number | null;
  sub_type_id?: number | null;
  page?: number | null;
  is_raw?: boolean;
}) => {
  const data = await API.get('/nomenclature/search', {
    params: {
      q: paramsData.q,
      is_raw: paramsData.is_raw,
      type_id: paramsData.type_id,
      sub_type_id: paramsData.sub_type_id,
      page: paramsData.page
    }
  });
  return data;
};
