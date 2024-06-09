import type { LocationQuery, LocationQueryValue } from 'vue-router';

const getFiltersParamsNonEmpty = (filters: {
  [key: string]: string | number | boolean | (string | number)[];
}): LocationQuery => {
  const filtersNonEmpty: LocationQuery = {};

  for (const key in filters) {
    if (
      filters[key] &&
      key !== 'date_to' &&
      key !== 'date_from' &&
      key !== 'date' &&
      key !== 'page' &&
      key !== 'per_page'
    )
      filtersNonEmpty[key] = filters[key] as LocationQueryValue | LocationQueryValue[];
  }

  return filtersNonEmpty;
};

export { getFiltersParamsNonEmpty };
