export const checkObjectAtLeastOneField = (obj: object): boolean => {
  return Object.values(obj).some(
    (value) => value !== null && value !== undefined && value !== ""
  );
};
