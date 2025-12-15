import { Account, AddressType } from '@core/types';

const ADDRESS_PROP_BY_TYPE: Record<AddressType, keyof Account> = {
  C: 'addressC',
  PVM: 'addressPVM',
  CoreEth: 'addressCoreEth',
  HVM: 'addressHVM',
  AVM: 'addressAVM',
  BTC: 'addressBTC',
  SVM: 'addressSVM',
};

export const getAddressByType = (account: Account, type: AddressType) =>
  account[ADDRESS_PROP_BY_TYPE[type]] as string | undefined;
