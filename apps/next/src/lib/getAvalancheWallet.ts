import { Avalanche } from '@avalabs/core-wallets-sdk';

import { stripAddressPrefix } from '@core/common';
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

  return new Avalanche.AddressWallet(
    account.addressC,
    stripAddressPrefix(account.addressCoreEth),
    [
      ...addresses.externalAddresses.map(({ address }) =>
        stripAddressPrefix(address),
      ),
      ...addresses.internalAddresses.map(({ address }) =>
        stripAddressPrefix(address),
      ),
    ],
    stripAddressPrefix(xpAddress),
    provider,
  );
};
