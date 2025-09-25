import { Card } from '@/components/Card';
import { TokenAmountInput } from '@/components/TokenAmountInput';
import { BridgeQueryTokens } from '@/config/routes';
import { useBridgeContext } from '@/pages/Bridge/context';
import { QueryUpdateFn } from '@/pages/Bridge/hooks/useBridgeQuery';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkSelect } from './NetworkSelect';

type Props = {
  // UI
  loading: boolean;
  query: BridgeQueryTokens;
  onQueryChange: QueryUpdateFn;
};

export const SourceSelector: FC<Props> = ({
  loading,
  query,
  onQueryChange,
}) => {
  const { t } = useTranslation();
  const bridge = useBridgeContext();

  console.log(bridge, query);

  return (
    <Card>
      <NetworkSelect
        label={t('From')}
        chains={bridge.availableChainIds}
        selected={query.sourceNetwork}
        onSelect={(network) =>
          onQueryChange({
            sourceNetwork: network,
            sourceNetworkQuery: '',
          })
        }
      />
      <TokenAmountInput
        id="bridge-from-amount"
        tokenId={query.sourceToken}
        estimatedFee={0n}
        tokensForAccount={bridge.bridgableTokens}
        onTokenChange={(token) =>
          onQueryChange({
            sourceToken: token,
            sourceTokenQuery: '',
          })
        }
        amount={query.amount}
        onAmountChange={(amount) => onQueryChange({ amount })}
        tokenHint={query.sourceToken && t('You pay')}
        isLoading={loading}
        onQueryChange={(q) => onQueryChange({ sourceTokenQuery: q })}
        tokenQuery={query.sourceTokenQuery}
      />
    </Card>
  );
};
