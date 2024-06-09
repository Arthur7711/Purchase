export const paramsValidator = (val: any) => {
  if (Array.isArray(val)) {
    return val.length > 1 ? val : val.length === 1 && !!val[0] && val[0] !== 0 ? val : null;
  }

  return val ? val : null;
};
