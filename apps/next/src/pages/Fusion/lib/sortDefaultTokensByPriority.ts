import { ChainId } from '@avalabs/core-chains-sdk';
import { FungibleTokenBalance } from '@core/types';

import { DEFAULT_SOURCE_TOKENS } from '../fusion-config';

const getDefaultSourceChainPriority = (token: FungibleTokenBalance) =>
  token.symbol === 'AVAX' && token.coreChainId === ChainId.AVALANCHE_MAINNET_ID
    ? -1
    : 0;

export const sortDefaultTokensByPriority = (
  tokenA: FungibleTokenBalance,
  tokenB: FungibleTokenBalance,
) => {
  const tokenPriority =
    (DEFAULT_SOURCE_TOKENS as string[]).indexOf(tokenA.symbol) -
    (DEFAULT_SOURCE_TOKENS as string[]).indexOf(tokenB.symbol);

  return tokenPriority === 0
    ? getDefaultSourceChainPriority(tokenA) -
        getDefaultSourceChainPriority(tokenB)
    : tokenPriority;
};
