export const isInArray = (value: string, array: any[]): boolean => {
  return array.indexOf(value) > -1;
};

export const wait = (waitTime: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), waitTime);
  });
};

export const noop = () => {};

export default {
  isInArray,
  wait,
};
