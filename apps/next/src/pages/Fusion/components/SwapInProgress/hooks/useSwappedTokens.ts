import { useMemo } from 'react';
import { Transfer } from '@avalabs/fusion-sdk';

import { isNotNullish } from '@core/common';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { lookupTokenByAssetInfo } from '../../../lib/lookupTokenByAssetInfo';
import { useTransferTokensLookup } from '../../../hooks/useTransferTokensLookup';

type TokenAmountInfo = {
  token: FungibleTokenBalance;
  tokenId: string;
  amount: bigint;
  type: 'paid' | 'received';
};

export const useSwappedTokens = (transfer: Transfer): TokenAmountInfo[] => {
  const tokensByChainId = useTransferTokensLookup(transfer);

  return useMemo(() => {
    const inputToken = lookupTokenByAssetInfo(
      tokensByChainId[transfer.sourceChain.chainId] ?? [],
      transfer.sourceAsset,
    );
    const input: TokenAmountInfo | undefined = inputToken
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

    const output: TokenAmountInfo | undefined = outputToken
      ? {
          type: 'received',
          token: outputToken,
          tokenId: getUniqueTokenId(outputToken),
          amount: transfer.amountOut,
        }
      : undefined;

    const fees: (TokenAmountInfo | undefined)[] = transfer.fees.map((fee) => {
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
      }, new Map<string, TokenAmountInfo>())
      .values()
      .toArray()
      .toSorted(paidFirst);
  }, [transfer, tokensByChainId]);
};

const paidFirst = (a: TokenAmountInfo, b: TokenAmountInfo) => {
  if (a.type === 'paid') return -1;
  if (b.type === 'paid') return 1;
  return 0;
};
