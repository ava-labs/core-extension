import { Stack } from '@avalabs/k2-alpine';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useAccountsContext } from '@core/ui';
import { getUniqueTokenId } from '@core/types';

import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';

import { useSwapQuery, useSwapTokens } from '../hooks';
import { PairFlipper } from './PairFlipper';

export const SwapPair = () => {
  const { t } = useTranslation();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const {
    fromId: queryFromId,
    fromQuery,
    toId: queryToId,
    toQuery,
    srcAmount,
    update: updateQuery,
  } = useSwapQuery();

  const { sourceTokens, targetTokens, fromToken, toToken } = useSwapTokens(
    activeAccount,
    queryFromId,
    queryToId,
  );

  const fromTokenId = fromToken ? getUniqueTokenId(fromToken) : queryFromId;
  const toTokenId = toToken ? getUniqueTokenId(toToken) : queryToId;

  // Token pair is only flippable if we already have some tokens selected
  // and the "to" token has balance (is present in the source tokens list).
  const canFlip = Boolean(
    fromToken &&
      toToken &&
      sourceTokens.some(
        (sourceToken) =>
          getUniqueTokenId(sourceToken) === getUniqueTokenId(toToken),
      ),
  );

  const handleFlip = useCallback(
    () =>
      updateQuery({
        from: toTokenId,
        fromQuery: '',
        to: fromTokenId,
        toQuery: '',
      }),
    [updateQuery, fromTokenId, toTokenId],
  );

  return (
    <Card>
      <Stack gap={1}>
        <TokenAmountInput
          id="swap-from-amount"
          tokenId={fromTokenId}
          maxAmount={fromToken?.balance ?? 0n}
          estimatedFee={0n}
          tokensForAccount={sourceTokens}
          onTokenChange={(value) => updateQuery({ from: value, fromQuery: '' })}
          tokenQuery={fromQuery}
          onQueryChange={(q) => updateQuery({ fromQuery: q })}
          amount={srcAmount}
          onAmountChange={(value) => updateQuery({ srcAmount: value })}
          tokenHint={fromToken ? t('You pay') : undefined}
        />
        <PairFlipper disabled={!canFlip} onClick={handleFlip} />
        <TokenAmountInput
          autoFocus={false}
          id="swap-to-amount"
          tokenId={toTokenId}
          tokensForAccount={targetTokens}
          onTokenChange={(value) => updateQuery({ to: value, toQuery: '' })}
          tokenQuery={toQuery}
          onQueryChange={(q) => updateQuery({ toQuery: q })}
          amount="0"
          onAmountChange={() => {}}
          withPresetButtons={false}
          tokenHint={fromToken ? t('You receive') : undefined}
        />
      </Stack>
    </Card>
  );
};
