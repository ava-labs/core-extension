import { formatAndLog } from './logging';
import { isDevelopment } from './environment';

export const sumByProperty = <O extends Record<T, unknown>, T extends keyof O>(
  values: O[],
  key: T,
): number => {
  return values.reduce((acc, curr, index) => {
    const value = curr[key];

    if (typeof value === 'number') {
      return acc + value;
    }

    // Log out instances when provided list contains non-numeric values
    if (isDevelopment()) {
      formatAndLog(
        `sumByProperty(): object at index ${index} was ignored. Property ${String(
          key,
        )} does not contain a number:`,
        curr,
      );
    }

    return acc;
  }, 0);
};
