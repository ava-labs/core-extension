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
    [stripAddressPrefix(xpAddress)],
    stripAddressPrefix(xpAddress),
    provider,
  );
};
