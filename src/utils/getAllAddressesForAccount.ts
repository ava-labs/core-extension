import { Account } from '@src/background/services/accounts/models';

export default function getAllAddressesForAccount(acc: Account) {
  return [
    acc.addressC,
    acc.addressBTC,
    acc.addressAVM,
    acc.addressPVM,
    acc.addressCoreEth,
  ];
}
