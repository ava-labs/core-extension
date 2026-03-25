import { Divider, Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

import { getUniqueTokenId } from '@core/types';

import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';

import { useFusionState } from '../contexts';
import { bigIntToString } from '@avalabs/core-utils-sdk';

export const SwapPair = () => {
  const { t } = useTranslation();
  const {
    fromId: queryFromId,
    fromQuery,
    toId: queryToId,
    toQuery,
    updateQuery,
    sourceTokenList,
    targetTokenList,
    sourceToken,
    targetToken,
    userAmount,
    toAmount,
    quotesStatus,
    selectedQuote,
    fee,
    feeError,
    isFeeLoading,
    maxSwapAmount,
    isMaxSwapAmountLoading,
  } = useFusionState();

  const fromTokenId = sourceToken ? getUniqueTokenId(sourceToken) : queryFromId;
  const toTokenId = targetToken ? getUniqueTokenId(targetToken) : queryToId;

  const onAmountChange = useCallback(
    (amount: string, isMax: boolean) => {
      if (!sourceToken) {
        return;
      }

      if (isMax) {
        updateQuery({
          userAmount: bigIntToString(maxSwapAmount, sourceToken.decimals),
        });
      } else {
        updateQuery({
          userAmount: amount,
        });
      }
    },
    [updateQuery, sourceToken, maxSwapAmount],
  );

  return (
    <Card>
      <Stack gap={1.5}>
        <TokenAmountInput
          id="swap-from-amount"
          tokenId={fromTokenId}
          maxAmount={maxSwapAmount}
          estimatedFee={fee}
          tokensForAccount={sourceTokenList}
          onTokenChange={(value) =>
            updateQuery({
              from: value,
              fromQuery: '',
              userAmount: '',
            })
          }
          tokenQuery={fromQuery}
          onQueryChange={(q) => updateQuery({ fromQuery: q })}
          isLoading={isFeeLoading || (isMaxSwapAmountLoading && !feeError)}
          amount={userAmount}
          onAmountChange={onAmountChange}
          tokenHint={sourceToken ? t('You pay') : undefined}
          withPresetButtons={!feeError}
        />
        <Divider sx={{ mx: 2 }} />
        <TokenAmountInput
          autoFocus={false}
          id="swap-to-amount"
          tokenId={toTokenId}
          tokensForAccount={targetTokenList}
          onTokenChange={(value) => updateQuery({ to: value, toQuery: '' })}
          tokenQuery={toQuery}
          onQueryChange={(q) => updateQuery({ toQuery: q })}
          isAmountReadOnly
          amount={isFeeLoading ? '' : userAmount ? (toAmount ?? '') : ''}
          withPresetButtons={false}
          tokenHint={sourceToken ? t('You receive') : undefined}
          isLoading={
            isFeeLoading || (quotesStatus === 'loading' && !selectedQuote)
          }
        />
      </Stack>
    </Card>
  );
};
