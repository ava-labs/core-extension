import { Account } from '@core/types';

/**
 * Generic utility type that extracts all properties starting with "address" from a given type
 */
type ExtractAddressProperties<T> = {
  [K in keyof T as K extends `address${string}` ? K : never]: T[K];
};

type AccountAddresses = ExtractAddressProperties<Account>;

type RequiredAccountAddresses = Required<AccountAddresses>;

type EmptyAccountAddresses = {
  [K in keyof RequiredAccountAddresses]: undefined;
};

export const emptyAccountAddresses = (): EmptyAccountAddresses => ({
  addressC: undefined,
  addressBTC: undefined,
  addressAVM: undefined,
  addressPVM: undefined,
  addressCoreEth: undefined,
  addressHVM: undefined,
  addressSVM: undefined,
});
