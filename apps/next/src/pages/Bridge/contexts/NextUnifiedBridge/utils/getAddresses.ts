import { Chain } from '@avalabs/bridge-unified';
import { assert, isBitcoinCaipId } from '@core/common';
import { Account, UnifiedBridgeError } from '@core/types';

type Addresses = {
  fromAddress: string;
  toAddress: string;
};

export function getAddresses(
  account: Account,
  sourceChain: Chain,
  targetChain: Chain,
): Addresses {
  const isFromBitcoin = isBitcoinCaipId(sourceChain.chainId);
  const isToBitcoin = isBitcoinCaipId(targetChain.chainId);

  if (isFromBitcoin || isToBitcoin) {
    assert(account.addressBTC, UnifiedBridgeError.NonBitcoinAccount);

    return {
      fromAddress: isFromBitcoin ? account.addressBTC : account.addressC,
      toAddress: isFromBitcoin ? account.addressC : account.addressBTC,
    };
  }

  return {
    fromAddress: account.addressC,
    toAddress: account.addressC,
  };
}
