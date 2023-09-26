export const areArraysOverlapping = (
  listA: unknown[],
  listB: unknown[]
): boolean => {
  return listA.some((itemFromA) => listB.includes(itemFromA));
};
