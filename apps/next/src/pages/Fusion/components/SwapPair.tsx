import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

import { getUniqueTokenId, isNativeToken } from '@core/types';

import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';

import { useFusionState } from '../contexts';
import { useUpdateToMaxAmount } from '../hooks/useUpdateToMaxAmount';

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
    useMaxAmount,
    fee,
    isFeeLoading,
    feeError,
    additiveFees,
  } = useFusionState();

  const fromTokenId = sourceToken ? getUniqueTokenId(sourceToken) : queryFromId;
  const toTokenId = targetToken ? getUniqueTokenId(targetToken) : queryToId;

  const onAmountChange = useCallback(
    (amount: string, isMax: boolean) => {
      if (!sourceToken) {
        return;
      }

      const needsMaxAmountCalculation =
        isMax && (isNativeToken(sourceToken) || additiveFees.length > 0);

      updateQuery({
        userAmount: amount,
        useMaxAmount: needsMaxAmountCalculation,
      });
    },
    [updateQuery, sourceToken, additiveFees],
  );

  useUpdateToMaxAmount(fee, isFeeLoading, feeError, additiveFees);

  return (
    <Card>
      <Stack gap={1.5}>
        <TokenAmountInput
          id="swap-from-amount"
          tokenId={fromTokenId}
          maxAmount={sourceToken?.balance ?? 0n}
          estimatedFee={fee}
          tokensForAccount={sourceTokenList}
          onTokenChange={(value) =>
            updateQuery({
              from: value,
              fromQuery: '',
              userAmount: '',
              useMaxAmount: false,
            })
          }
          tokenQuery={fromQuery}
          onQueryChange={(q) => updateQuery({ fromQuery: q })}
          isLoading={useMaxAmount || isFeeLoading}
          amount={useMaxAmount ? '' : userAmount}
          onAmountChange={onAmountChange}
          tokenHint={sourceToken ? t('You pay') : undefined}
          withPresetButtons
        />
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
