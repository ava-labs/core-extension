import { ChainId } from '@avalabs/core-chains-sdk';
import { TokenType } from '@avalabs/vm-module-types';

import {
  FungibleTokenBalance,
  getUniqueTokenIdGeneric,
  isBtcToken,
} from '@core/types';
import { isBitcoinTestnetCaipId } from '@core/common';

import { BTCB_ADDRESS_MAINNET, BTCB_ADDRESS_TESTNET } from '../fusion-config';

/**
 * Returns a hardcoded target token ID when the source token is constrained to only one swap route.
 *
 * Currently only BTC -> BTC.b is constrained.
 */
export const getConstrainedTargetTokenId = (
  fromToken: FungibleTokenBalance,
): string | null => {
  if (isBtcToken(fromToken)) {
    return getBtcbOnAvalanche(isBitcoinTestnetCaipId(fromToken.chainCaipId));
  }

  return null;
};

const getBtcbOnAvalanche = (isTestnet: boolean) => {
  const address = isTestnet ? BTCB_ADDRESS_TESTNET : BTCB_ADDRESS_MAINNET;
  const coreChainId = isTestnet
    ? ChainId.AVALANCHE_TESTNET_ID
    : ChainId.AVALANCHE_MAINNET_ID;

  return getUniqueTokenIdGeneric({
    type: TokenType.ERC20,
    symbol: 'BTC.b',
    coreChainId,
    address,
  });
};
