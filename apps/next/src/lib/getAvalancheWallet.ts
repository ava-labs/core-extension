import { Avalanche } from '@avalabs/core-wallets-sdk';

import { isPrimaryAccount, stripAddressPrefix } from '@core/common';
import {
  AvmCapableAccount,
  isAvmCapableAccount,
  PvmCapableAccount,
  XPAddresses,
} from '@core/types';

export const getAvalancheWallet = async (
  account: AvmCapableAccount | PvmCapableAccount,
  addresses: XPAddresses,
  provider: Avalanche.JsonRpcProvider,
) => {
  const xpAddress = isAvmCapableAccount(account)
    ? account.addressAVM
    : account.addressPVM;

  const addressesToUse = isPrimaryAccount(account)
    ? [
        ...addresses.externalAddresses.map(({ address }) =>
          stripAddressPrefix(address),
        ),
        ...addresses.internalAddresses.map(({ address }) =>
          stripAddressPrefix(address),
        ),
      ]
    : [stripAddressPrefix(xpAddress)];

  return new Avalanche.AddressWallet(
    account.addressC,
    stripAddressPrefix(account.addressCoreEth),
    addressesToUse,
    stripAddressPrefix(xpAddress),
    provider,
  );
};
