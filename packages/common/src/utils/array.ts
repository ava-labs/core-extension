import { isNotNullish } from './typeUtils';

export const areArraysOverlapping = (
  listA: unknown[],
  listB: unknown[],
): boolean => {
  return listA.some((itemFromA) => listB.includes(itemFromA));
};

export const hasAtLeastOneElement = <T>(
  array: T[] | readonly T[],
): array is [T, ...T[]] => array.length > 0 && isNotNullish(array[0]);

export const hasAtLeastTwoElements = <T>(
  array: T[] | readonly T[],
): array is [T, T, ...T[]] =>
  hasAtLeastOneElement(array) && isNotNullish(array[1]);
