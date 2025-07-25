import { Account } from '@core/types';

export function getAllAddressesForAccount(acc: Partial<Account>) {
  return getAllAddressesForAccountUnfiltered(acc).filter(
    (addr): addr is string => typeof addr === 'string',
  );
}

export function getAllAddressesForAccounts(accounts: Account[]): string[] {
  return accounts
    .flatMap(getAllAddressesForAccount)
    .filter((v) => typeof v === 'string');
}

export function isMissingAnyAddress(acc: Partial<Account>) {
  return getAllAddressesForAccountUnfiltered(acc).some((addr) => !addr);
}

function getAllAddressesForAccountUnfiltered(acc: Partial<Account>) {
  return [
    acc.addressC,
    acc.addressBTC,
    acc.addressAVM,
    acc.addressPVM,
    acc.addressCoreEth,
    acc.addressHVM,
    acc.addressSVM,
  ];
}
