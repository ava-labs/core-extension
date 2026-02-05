import { FungibleTokenBalance } from '@core/types';

import { DEFAULT_SOURCE_TOKENS } from '../fusion-config';

export const sortDefaultTokensByPriority = (
  tokenA: FungibleTokenBalance,
  tokenB: FungibleTokenBalance,
) =>
  (DEFAULT_SOURCE_TOKENS as string[]).indexOf(tokenA.symbol) -
  (DEFAULT_SOURCE_TOKENS as string[]).indexOf(tokenB.symbol);
