import { Account } from '@src/background/services/accounts/models';

export default function getAllAddressesForAccount(acc: Partial<Account>) {
  return [
    acc.addressC,
    acc.addressBTC,
    acc.addressAVM,
    acc.addressPVM,
    acc.addressCoreEth,
    acc.addressHVM,
    acc.addressSVM,
  ].filter((addr): addr is string => typeof addr === 'string');
}
