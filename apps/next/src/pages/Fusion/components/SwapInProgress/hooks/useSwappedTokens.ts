import { useMemo } from 'react';
import { Transfer } from '@avalabs/unified-asset-transfer';

import { isNotNullish } from '@core/common';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { lookupTokenByAssetInfo } from '../../../lib/lookupTokenByAssetInfo';
import { useTransferTokensLookup } from '../../../hooks/useTransferTokensLookup';

type TokemAmountInfo = {
  token: FungibleTokenBalance;
  tokenId: string;
  amount: bigint;
  type: 'paid' | 'received';
};

export const useSwappedTokens = (transfer: Transfer): TokemAmountInfo[] => {
  const tokensByChainId = useTransferTokensLookup(transfer);

  return useMemo(() => {
    const inputToken = lookupTokenByAssetInfo(
      tokensByChainId[transfer.sourceChain.chainId] ?? [],
      transfer.sourceAsset,
    );
    const input: TokemAmountInfo | undefined = inputToken
      ? {
          type: 'paid',
          token: inputToken,
          tokenId: getUniqueTokenId(inputToken),
          amount: transfer.amountIn,
        }
      : undefined;

    const outputToken = lookupTokenByAssetInfo(
      tokensByChainId[transfer.targetChain.chainId] ?? [],
      transfer.targetAsset,
    );

    const output: TokemAmountInfo | undefined = outputToken
      ? {
          type: 'received',
          token: outputToken,
          tokenId: getUniqueTokenId(outputToken),
          amount: transfer.amountOut,
        }
      : undefined;

    const fees: (TokemAmountInfo | undefined)[] = transfer.fees.map((fee) => {
      const token = lookupTokenByAssetInfo(
        tokensByChainId[fee.chainId] ?? [],
        fee.token,
      );

      return token
        ? {
            type: 'paid',
            token,
            tokenId: getUniqueTokenId(token),
            amount: fee.amount,
          }
        : undefined;
    });

    return [input, output, ...fees]
      .filter(isNotNullish)
      .reduce((lookup, info) => {
        const existing = lookup.get(info.tokenId);
        if (existing) {
          if (info.type === existing.type) {
            existing.amount += info.amount;
          } else {
            existing.amount -= info.amount;
          }
        } else {
          lookup.set(info.tokenId, info);
        }
        return lookup;
      }, new Map<string, TokemAmountInfo>())
      .values()
      .toArray()
      .toSorted(paidFirst);
  }, [transfer, tokensByChainId]);
};

const paidFirst = (a: TokemAmountInfo, b: TokemAmountInfo) => {
  if (a.type === 'paid') return -1;
  if (b.type === 'paid') return 1;
  return 0;
};
