import { Blockchain } from '@avalabs/core-bridge-sdk';
import type { TokenWithBalance } from '@avalabs/vm-module-types';

export function findTokenForAsset(
  symbol: string,
  nativeChain: Blockchain,
  tokens: TokenWithBalance[],
) {
  // When the source is Avalanche use the wrapped version of the symbol e.g. BTC.b
  const wrappedSymbol = getWrappedSymbol(symbol, nativeChain);

  return tokens.find((t) => t.symbol === symbol || t.symbol === wrappedSymbol);
}

function getWrappedSymbol(symbol: string, chain: Blockchain): string {
  if (chain === Blockchain.ETHEREUM) {
    return `${symbol}.e`;
  } else if (chain === Blockchain.BITCOIN) {
    return `${symbol}.b`;
  }
  return symbol;
}
