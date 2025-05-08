import { EnsureDefined, ExcludeUndefined } from '@core/types';

export const omitUndefined = <T extends Record<PropertyKey, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as ExcludeUndefined<T>;

export const hasDefined = <T extends object, K extends keyof T>(
  obj: T,
  key: K,
): obj is EnsureDefined<T, K> => {
  return obj[key] !== undefined;
};
