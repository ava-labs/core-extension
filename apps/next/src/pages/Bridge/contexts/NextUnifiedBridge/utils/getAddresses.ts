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

  const { addressBTC, addressC } = account;

  if (isFromBitcoin || isToBitcoin) {
    assert(addressBTC, UnifiedBridgeError.NonBitcoinAccount);
  }

  const fromAddress = isFromBitcoin ? addressBTC! : addressC;
  const toAddress = isFromBitcoin ? addressC : addressBTC!;

  return {
    fromAddress,
    toAddress,
  };
}
