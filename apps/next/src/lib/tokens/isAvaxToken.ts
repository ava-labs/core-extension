import type { FungibleTokenBalance } from '@core/types';
import { TokenType } from '@avalabs/vm-module-types';

export const isAvaxToken = (
  token: FungibleTokenBalance,
): token is FungibleTokenBalance & { type: TokenType.NATIVE } =>
  token.type === TokenType.NATIVE && token.symbol === 'AVAX';
