import { isNotNullish } from './typeUtils';

export const areArraysOverlapping = (
  listA: unknown[],
  listB: unknown[],
): boolean => {
  return listA.some((itemFromA) => listB.includes(itemFromA));
};

export const hasAtLeastOneElement = <T>(array: T[]): array is [T, ...T[]] =>
  array.length > 0 && isNotNullish(array[0]);
