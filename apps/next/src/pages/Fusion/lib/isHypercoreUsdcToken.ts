import { TokenType } from '@avalabs/vm-module-types';

import { HYPERCORE_CHAIN_ID } from '@core/common';
import { FungibleTokenBalance } from '@core/types';

/** Markr/Relay token id for HyperCore USDC collateral — mirrors web swap. */
export const HYPERLIQUID_USDC_TOKEN_ADDRESS =
  '0x00000000000000000000000000000000' as const;

/** Shared identity check used by token lists and Fusion asset mapping. */
export const isHypercoreUsdcIdentity = (coreChainId: number, symbol: string) =>
  coreChainId === HYPERCORE_CHAIN_ID && symbol.toUpperCase() === 'USDC';

/** HyperCore USDC collateral — the only HyperCore asset swappable via Markr today. */
export const isHypercoreUsdcToken = (
  token: FungibleTokenBalance | undefined,
): token is FungibleTokenBalance =>
  token !== undefined &&
  isHypercoreUsdcIdentity(token.coreChainId, token.symbol) &&
  token.type === TokenType.NATIVE;
