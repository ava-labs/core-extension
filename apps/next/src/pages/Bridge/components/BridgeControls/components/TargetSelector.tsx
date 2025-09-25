import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { BridgeQueryTokens } from '@/config/routes';
import { useBridgeContext } from '@/pages/Bridge/context';
import { QueryUpdateFn } from '@/pages/Bridge/hooks/useBridgeQuery';

import { getUniqueTokenId } from '@core/types';
import { noop } from 'lodash';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkSelect } from './NetworkSelect';

type Props = {
  onQueryChange: QueryUpdateFn;
  query: BridgeQueryTokens;
};

export const TargetSelector: FC<Props> = ({ query, onQueryChange }) => {
  const { t } = useTranslation();

  const { possibleTargetChains, receiveAmount, transferableAssets } =
    useBridgeContext();

  return (
    <Card>
      <NetworkSelect
        label={t('To')}
        chains={possibleTargetChains}
        selected={query.targetNetwork}
        onSelect={(network) => onQueryChange({ targetNetwork: network })}
      />
      <TokenAmountInput
        autoFocus={false}
        id="bridge-to-amount"
        tokenId={query.targetToken ?? getUniqueTokenId(transferableAssets[0]!)}
        tokensForAccount={transferableAssets}
        onTokenChange={(token) =>
          onQueryChange({ targetToken: token, targetTokenQuery: '' })
        }
        tokenQuery={query.targetTokenQuery}
        onQueryChange={(q) => onQueryChange({ targetTokenQuery: q })}
        amount={receiveAmount?.toString() ?? ''}
        onAmountChange={noop}
        withPresetButtons={false}
        tokenHint={query.targetToken && t('You receive')}
        isLoading={false}
      />
    </Card>
  );
};
