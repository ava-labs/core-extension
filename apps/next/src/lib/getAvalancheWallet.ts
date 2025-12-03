import { Avalanche } from '@avalabs/core-wallets-sdk';

import { stripAddressPrefix } from '@core/common';
import {
  AvmCapableAccount,
  isAvmCapableAccount,
  PvmCapableAccount,
} from '@core/types';

export const getAvalancheWallet = (
  account: AvmCapableAccount | PvmCapableAccount,
  provider: Avalanche.JsonRpcProvider,
) => {
  const xpAddress = isAvmCapableAccount(account)
    ? account.addressAVM
    : account.addressPVM;

  return new Avalanche.AddressWallet(
    account.addressC,
    stripAddressPrefix(account.addressCoreEth),
    Array.isArray(account.xpAddresses) && account.xpAddresses?.length > 0
      ? account.xpAddresses.map((xp) => stripAddressPrefix(xp.address))
      : [stripAddressPrefix(xpAddress)],
    stripAddressPrefix(xpAddress),
    provider,
  );
};
