import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Stack } from '@avalabs/k2-alpine';
import { bigIntToString } from '@avalabs/core-utils-sdk';

import { FeatureGates, getUniqueTokenId } from '@core/types';
import { useFeatureFlagContext } from '@core/ui';

import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';

import { useFusionState } from '../contexts';
import { calculateNativeFee } from '../lib/calculateNativeFee';
import { usePinnedMaxAmount } from '../hooks/usePinnedMaxAmount';

export const SwapPair = () => {
  const { t } = useTranslation();
  const { isFlagEnabled } = useFeatureFlagContext();
  const {
    fromId: queryFromId,
    fromQuery,
    toId: queryToId,
    toQuery,
    updateQuery,
    sourceTokenList,
    targetTokenList,
    fetchNextTargetTokenPage,
    isTargetTokenListLoading,
    isTargetTokenListFetching,
    targetChainOptions,
    selectedTargetChainId,
    setSelectedTargetChainId,
    setIsTargetSelectOpen,
    onTargetTokenChange,
    sourceToken,
    targetToken,
    userAmount,
    toAmount,
    quotesStatus,
    selectedQuote,
    currentRequiredTokens,
    minimumRequiredTokens,
  } = useFusionState();

  const fromTokenId = sourceToken ? getUniqueTokenId(sourceToken) : queryFromId;
  const targetTokenId = targetToken ? getUniqueTokenId(targetToken) : queryToId;
  const isTargetSameAsSource = targetTokenId === fromTokenId;
  const toTokenId = isTargetSameAsSource ? '' : targetTokenId;
  const isAvalancheCctEnabled = isFlagEnabled(
    FeatureGates.FUSION_AVALANCHE_CCT,
  );
  const chainFilterMode = isAvalancheCctEnabled
    ? 'avalanche-cct'
    : 'group-avalanche';

  const { maxAmount, pin, unpin } = usePinnedMaxAmount(
    sourceToken,
    currentRequiredTokens.state === 'complete'
      ? currentRequiredTokens
      : minimumRequiredTokens,
  );
  const fee = calculateNativeFee(minimumRequiredTokens);

  const onAmountChange = useCallback(
    (amount: string, isMax: boolean) => {
      if (!sourceToken) {
        unpin();
        return;
      }

      if (isMax && maxAmount) {
        updateQuery({
          userAmount: bigIntToString(maxAmount, sourceToken.decimals),
        });
        pin();
      } else {
        updateQuery({
          userAmount: amount,
        });
        unpin();
      }
    },
    [updateQuery, sourceToken, maxAmount, pin, unpin],
  );

  return (
    <Card>
      <Stack gap={1.5}>
        <TokenAmountInput
          id="swap-from-amount"
          tokenId={fromTokenId}
          maxAmount={maxAmount}
          estimatedFee={fee}
          tokensForAccount={sourceTokenList}
          onTokenChange={(value) => {
            unpin();
            updateQuery({
              from: value,
              fromQuery: '',
              userAmount: '',
            });
          }}
          tokenQuery={fromQuery}
          onQueryChange={(q) => updateQuery({ fromQuery: q })}
          isLoading={
            minimumRequiredTokens.state === 'loading' ||
            minimumRequiredTokens.state === 'idle'
          }
          amount={userAmount}
          onAmountChange={onAmountChange}
          tokenHint={sourceToken ? t('You pay') : undefined}
          withPresetButtons={minimumRequiredTokens.state === 'complete'}
          chainFilterMode={chainFilterMode}
        />
        <Divider sx={{ mx: 2 }} />
        <TokenAmountInput
          autoFocus={false}
          id="swap-to-amount"
          tokenId={toTokenId}
          tokensForAccount={targetTokenList}
          onTokenChange={(value) => {
            unpin();
            onTargetTokenChange(value);
          }}
          tokenQuery={toQuery}
          onQueryChange={(q) => updateQuery({ toQuery: q })}
          isAmountReadOnly
          amount={userAmount ? (toAmount ?? '') : ''}
          withPresetButtons={false}
          tokenHint={sourceToken ? t('You receive') : undefined}
          isLoading={
            minimumRequiredTokens.state === 'loading' ||
            (quotesStatus === 'loading' && !selectedQuote)
          }
          chainFilterMode={chainFilterMode}
          onEndReached={fetchNextTargetTokenPage}
          defaultChainId="avalanche"
          externalChainOptions={
            targetChainOptions.length > 0 ? targetChainOptions : undefined
          }
          onChainChange={setSelectedTargetChainId}
          selectedChainId={selectedTargetChainId}
          onOpenChange={setIsTargetSelectOpen}
          isLoadingTokens={
            isTargetTokenListLoading || isTargetTokenListFetching
          }
          selectedTokenFallback={isTargetSameAsSource ? undefined : targetToken}
        />
      </Stack>
    </Card>
  );
};
