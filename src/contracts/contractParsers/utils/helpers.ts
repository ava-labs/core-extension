import { bigToLocaleString, bnToBig, hexToBN } from '@avalabs/utils-sdk';
import { BigNumber } from 'ethers';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceERC20,
} from '@src/background/services/balances/models';

export function isAvaxToken(address: string) {
  return address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
}

export function getAmount(
  amount: BigNumber,
  token: TokenWithBalanceERC20 | NetworkTokenWithBalance
) {
  const bn = hexToBN(amount.toHexString());
  const amountValue = bigToLocaleString(bnToBig(bn, token.decimals), 4);
  const amountUSDValue =
    (Number(token.priceUSD) * Number(amountValue)).toFixed(2) ?? '';
  return {
    bn,
    amountValue,
    amountUSDValue,
  };
}
