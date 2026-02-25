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
    sourceTokenList,
    targetTokenList,
    sourceToken,
    targetToken,
    fromAmount,
    toAmount,
    quotesStatus,
  } = useFusionState();

  const fromTokenId = sourceToken ? getUniqueTokenId(sourceToken) : queryFromId;
  const toTokenId = targetToken ? getUniqueTokenId(targetToken) : queryToId;

  return (
    <Card>
      <Stack gap={1.5}>
        <TokenAmountInput
          id="swap-from-amount"
          tokenId={fromTokenId}
          maxAmount={sourceToken?.balance ?? 0n}
          estimatedFee={0n}
          tokensForAccount={sourceTokenList}
          onTokenChange={(value) => updateQuery({ from: value, fromQuery: '' })}
          tokenQuery={fromQuery}
          onQueryChange={(q) => updateQuery({ fromQuery: q })}
          amount={fromAmount ?? ''}
          onAmountChange={(value) => {
            updateQuery({ userAmount: value, side: 'sell' });
          }}
          tokenHint={sourceToken ? t('You pay') : undefined}
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
          amount={fromAmount ? (toAmount ?? '') : ''}
          withPresetButtons={false}
          tokenHint={sourceToken ? t('You receive') : undefined}
          isLoading={quotesStatus === 'loading'}
        />
      </Stack>
    </Card>
  );
};
