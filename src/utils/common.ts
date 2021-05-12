export const isInArray = (value: string, array: any[]): boolean => {
  return array.indexOf(value) > -1;
};

export default {
  isInArray,
};
