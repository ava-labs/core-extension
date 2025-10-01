import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { useBridgeState } from '@/pages/Bridge/contexts';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkSelect } from './NetworkSelect';

type Props = {
  // UI
  loading: boolean;
};

export const SourceSelector: FC<Props> = ({ loading }) => {
  const { t } = useTranslation();
  const bridge = useBridgeState();
  const { updateQuery, ...query } = bridge.query;

  return (
    <Card>
      <NetworkSelect
        label={t('From')}
        chains={bridge.sourceChainIds}
        selected={query.sourceNetwork}
        onSelect={(sourceNetwork) => {
          updateQuery({
            sourceNetwork,
            sourceToken: '',
            sourceTokenQuery: '',
          });
        }}
      />
      <TokenAmountInput
        id="bridge-from-amount"
        tokenId={query.sourceToken}
        tokensForAccount={bridge.sourceTokens}
        onTokenChange={(token) =>
          updateQuery({
            sourceToken: token,
            sourceTokenQuery: '',
          })
        }
        amount={query.amount}
        onAmountChange={(amount) => updateQuery({ amount })}
        tokenHint={query.sourceToken && t('You pay')}
        isLoading={loading}
        onQueryChange={(q) => updateQuery({ sourceTokenQuery: q })}
        tokenQuery={query.sourceTokenQuery}
      />
    </Card>
  );
};
