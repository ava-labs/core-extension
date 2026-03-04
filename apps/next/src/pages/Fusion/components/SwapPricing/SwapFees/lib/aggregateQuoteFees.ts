import { bigintToBig } from '@core/common';
import { AggregatedFees, TokenAmount } from '../types';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';
import { lookupTokenByAssetInfo } from '@/pages/Fusion/lib/lookupTokenByAssetInfo';
import { Quote } from '@avalabs/unified-asset-transfer';

export const aggregateQuoteFees = (
  quote: Quote,
  tokenLookup: Record<string, FungibleTokenBalance[]>,
) =>
  quote.fees.reduce(
    (acc, fee) => {
      const assetInfo = lookupTokenByAssetInfo(
        tokenLookup[fee.chainId] ?? [],
        fee.token,
      );

      if (assetInfo) {
        const existingTokenAmount = acc.tokenAmounts.find(
          (tokenAmount) =>
            getUniqueTokenId(tokenAmount.token) === getUniqueTokenId(assetInfo),
        );

        if (existingTokenAmount) {
          existingTokenAmount.amount += fee.amount;
        } else {
          acc.tokenAmounts.push({
            token: assetInfo,
            amount: fee.amount,
          });
        }
      }

      if (
        !assetInfo ||
        !assetInfo.priceInCurrency ||
        assetInfo.priceInCurrency === 0
      ) {
        return acc;
      }

      const feeAmount = bigintToBig(fee.amount, assetInfo.decimals);
      const feeAmountInCurrency = feeAmount
        .mul(assetInfo.priceInCurrency)
        .toNumber();

      acc.amountInFiatCurrency += feeAmountInCurrency;

      return acc;
    },
    {
      amountInFiatCurrency: 0,
      tokenAmounts: [] as TokenAmount[],
    } as AggregatedFees,
  );
