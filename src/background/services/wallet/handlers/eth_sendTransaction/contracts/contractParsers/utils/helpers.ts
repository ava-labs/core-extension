import { bigToLocaleString, bnToBig, hexToBN } from '@avalabs/core-utils-sdk';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
} from '@src/background/services/balances/models';

export function isNetworkToken(address: string) {
  return address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
}

export function getAmount(
  amount: bigint,
  token: TokenWithBalanceERC20 | NetworkTokenWithBalance
) {
  const bn = hexToBN(amount.toString(16));
  const amountValue = bigToLocaleString(bnToBig(bn, token.decimals), 4);
  const amountUSDValue =
    (Number(token.priceUSD) * Number(amountValue)).toFixed(2) ?? '';
  return {
    bn,
    amountValue,
    amountUSDValue,
  };
}
