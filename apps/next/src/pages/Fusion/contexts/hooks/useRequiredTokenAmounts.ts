import { useMemo } from 'react';
import { Quote, Chain, TokenType, TransferManager } from '@avalabs/fusion-sdk';

import { getUniqueTokenId } from '@core/types';

import { RequiredToken, RequiredTokenAmounts } from '../../types';
import { getAdditiveFees } from '../../lib/getAdditiveFees';
import { lookupTokenByAssetInfo } from '../../lib/lookupTokenByAssetInfo';
import { useTransferTokensLookup } from '../../hooks/useTransferTokensLookup';

import { useNativeFeeEstimate } from './useNativeFeeEstimate';
import { applyBuffer } from '../../lib/applyBuffer';

const NO_RESULT: RequiredTokenAmounts = {
  state: 'idle',
  tokens: [],
};

const getFeeBuffer = (
  type: 'network-fee' | 'additive-fee',
  sourceChain: Chain,
) => {
  if (sourceChain.chainId.startsWith('bip122:')) {
    return 0.1; // 10% buffer for Bitcoin transactions
  }

  if (type === 'network-fee') {
    return 0.6; // 60% buffer for network fees
  }

  return 0.3; // 30% buffer for additive fees
};

export const useRequiredTokenAmounts = (
  manager: TransferManager | undefined,
  quote: Quote | null,
): RequiredTokenAmounts => {
  const {
    fee: nativeFee,
    isFeeLoading,
    feeError,
  } = useNativeFeeEstimate(manager, quote);
  const tokenLookup = useTransferTokensLookup(quote);

  return useMemo(() => {
    if (!quote) {
      return NO_RESULT;
    }

    const inputToken = lookupTokenByAssetInfo(
      tokenLookup[quote.sourceChain.chainId] ?? [],
      quote.assetIn,
    );

    if (!inputToken) {
      // Should never happen, mostly satisfying the type checker.
      return {
        state: 'incomplete',
        tokens: [],
      };
    }

    const requiredTokens: RequiredToken[] = [];

    requiredTokens.push({
      token: inputToken,
      id: getUniqueTokenId(inputToken),
      amounts: [[quote.amountIn, 'input']],
      total: quote.amountIn,
    });

    const nativeToken = lookupTokenByAssetInfo(
      tokenLookup[quote.sourceChain.chainId] ?? [],
      { type: TokenType.NATIVE },
    );

    if (
      nativeToken &&
      typeof nativeFee === 'bigint' &&
      !isFeeLoading &&
      !feeError
    ) {
      const buffered = applyBuffer(
        nativeFee,
        nativeToken.decimals,
        getFeeBuffer('network-fee', quote.sourceChain),
      );
      requiredTokens.push({
        token: nativeToken,
        id: getUniqueTokenId(nativeToken),
        amounts: [[buffered, 'network-fee']],
        total: buffered,
      });
    }

    const additiveFees = getAdditiveFees(quote);

    for (const additiveFee of additiveFees) {
      const feeToken = lookupTokenByAssetInfo(
        tokenLookup[additiveFee.chainId] ?? [],
        additiveFee.token,
      );

      if (feeToken) {
        const buffered = applyBuffer(
          additiveFee.amount,
          feeToken.decimals,
          getFeeBuffer('additive-fee', quote.sourceChain),
        );
        requiredTokens.push({
          token: feeToken,
          id: getUniqueTokenId(feeToken),
          amounts: [[buffered, 'additive-fee']],
          total: buffered,
        });
      }
    }

    const aggregatedById = requiredTokens.reduce<Record<string, RequiredToken>>(
      (acc, item) => {
        const existing = acc[item.id];

        if (existing) {
          existing.amounts.push(...item.amounts);
          existing.total += item.total;
        } else {
          acc[item.id] = item;
        }

        return acc;
      },
      {},
    );

    return {
      state: isFeeLoading ? 'loading' : feeError ? 'incomplete' : 'complete',
      tokens: Object.values(aggregatedById),
    };
  }, [quote, tokenLookup, nativeFee, isFeeLoading, feeError]);
};
