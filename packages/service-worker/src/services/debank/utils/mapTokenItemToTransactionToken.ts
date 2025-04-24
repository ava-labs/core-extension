import Big from 'big.js';
import { DebankTokenItem, TransactionToken } from '@core/types';
import { bigToBigInt } from '@avalabs/core-utils-sdk';

export const mapTokenItemToTransactionToken = (
  t: DebankTokenItem,
): TransactionToken => ({
  address: t.id,
  decimals: t.decimals,
  symbol: t.symbol,
  name: t.name,
  logoUri: t.logo_url,

  amount: bigToBigInt(Big(t.amount), t.decimals),
  usdValue: t.usd_value,
  usdPrice: t.price,

  isScam: t.is_scam,
  isInfinity: t.is_infinity,
  isSuspicious: t.is_suspicious,
});
