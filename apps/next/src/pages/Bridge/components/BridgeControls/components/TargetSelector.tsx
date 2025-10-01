import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { useBridgeState } from '@/pages/Bridge/contexts';

import { noop } from 'lodash';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkSelect } from './NetworkSelect';

type Props = {
  // UI
  loading: boolean;
};

export const TargetSelector: FC<Props> = () => {
  const { t } = useTranslation();

  const { query } = useBridgeState();
  const { targetNetwork, targetToken, updateQuery } = query;

  return (
    <Card>
      <NetworkSelect
        label={t('To')}
        chains={[targetNetwork]}
        selected={targetNetwork}
        onSelect={() => {}}
      />
      <TokenAmountInput
        autoFocus={false}
        id="bridge-to-amount"
        tokenId={targetToken}
        tokensForAccount={[]}
        onTokenChange={(token) =>
          updateQuery({ targetToken: token, targetTokenQuery: '' })
        }
        tokenQuery={query.targetTokenQuery}
        onQueryChange={(q) => updateQuery({ targetTokenQuery: q })}
        amount={query.amount ?? ''}
        onAmountChange={noop}
        withPresetButtons={false}
        tokenHint={query.targetToken && t('You receive')}
        isLoading={false}
      />
    </Card>
  );
};
