import { TokenBalanceChange } from './types';

/**
 * Helper function to find a token in balance change array by address
 */
export function findTokenInBalanceChange(
  balanceChangeArray: TokenBalanceChange[],
  tokenAddress: string,
  isNative: boolean,
): TokenBalanceChange | undefined {
  if (!balanceChangeArray || balanceChangeArray.length === 0) {
    return undefined;
  }

  for (const item of balanceChangeArray) {
    const token = item.token;
    if (!token) continue;

    // For native tokens, match by checking if token has no address or zero address
    if (isNative) {
      if (
        !token.address ||
        token.address === '0x0000000000000000000000000000000000000000'
      ) {
        return item;
      }
    } else {
      // For ERC20 tokens, match by address (case-insensitive)
      if (
        token.address &&
        token.address.toLowerCase() === tokenAddress.toLowerCase()
      ) {
        return item;
      }
    }
  }

  return undefined;
}
