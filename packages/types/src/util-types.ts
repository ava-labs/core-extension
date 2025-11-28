export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// A helper generic that turns only given keys (K) of type T
// from optional to required.
export type EnsureDefined<T, K extends keyof T> = T & Required<Pick<T, K>>;

// A helper generic that turns all keys of given type to "never" defined.
export type Never<T> = {
  [P in keyof T]?: never;
};

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type FirstParameter<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P[0]
  : never;

export const ACTION_HANDLED_BY_MODULE = '__handled.via.vm.modules__';

export const DEFERRED_RESPONSE: unique symbol = Symbol();

export type ExcludeUndefined<T extends object> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
};

export type PickKeys<T, K extends (keyof T)[]> = Omit<T, K[number]>;
