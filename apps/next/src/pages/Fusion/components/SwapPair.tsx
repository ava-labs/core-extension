import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { getUniqueTokenId } from '@core/types';

import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';

import { useFusionState } from '../contexts';

export const SwapPair = () => {
  const { t } = useTranslation();
  const {
    fromId: queryFromId,
    fromQuery,
    toId: queryToId,
    toQuery,
    updateQuery,
    sourceTokens,
    targetTokens,
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    isAmountLoading,
  } = useFusionState();

  const fromTokenId = fromToken ? getUniqueTokenId(fromToken) : queryFromId;
  const toTokenId = toToken ? getUniqueTokenId(toToken) : queryToId;

  return (
    <Card>
      <Stack gap={1.5}>
        <TokenAmountInput
          id="swap-from-amount"
          tokenId={fromTokenId}
          maxAmount={fromToken?.balance ?? 0n}
          estimatedFee={0n}
          tokensForAccount={sourceTokens}
          onTokenChange={(value) => updateQuery({ from: value, fromQuery: '' })}
          tokenQuery={fromQuery}
          onQueryChange={(q) => updateQuery({ fromQuery: q })}
          amount={fromAmount ?? ''}
          onAmountChange={(value) => {
            updateQuery({ userAmount: value, side: 'sell' });
          }}
          tokenHint={fromToken ? t('You pay') : undefined}
        />
        <TokenAmountInput
          autoFocus={false}
          id="swap-to-amount"
          tokenId={toTokenId}
          tokensForAccount={targetTokens}
          onTokenChange={(value) => updateQuery({ to: value, toQuery: '' })}
          tokenQuery={toQuery}
          onQueryChange={(q) => updateQuery({ toQuery: q })}
          isAmountReadOnly
          amount={fromAmount ? (toAmount ?? '') : ''}
          withPresetButtons={false}
          tokenHint={fromToken ? t('You receive') : undefined}
          isLoading={isAmountLoading}
        />
      </Stack>
    </Card>
  );
};
