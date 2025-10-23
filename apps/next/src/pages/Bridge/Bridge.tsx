import { TokenType } from '@avalabs/vm-module-types';
import { useLiveBalance } from '@core/ui';
import { FC } from 'react';

import { Page } from '@/components/Page';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useTranslation } from 'react-i18next';
import { BridgeInProgress } from './components/BridgeInProgress';
import { BridgeTransactionForm } from './components/BridgeTransactionForm';
import {
  BridgeQueryProvider,
  BridgeStateProvider,
  NextUnifiedBridgeProvider,
  useBridgeQuery,
  useNextUnifiedBridgeContext,
} from './contexts';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

const BridgePage: FC = () => {
  useLiveBalance(POLLED_BALANCES);
  const { t } = useTranslation();
  const { isReady, isTxConfirming } = useNextUnifiedBridgeContext();
  const { transactionId } = useBridgeQuery();

  if (!isReady) {
    return <LoadingScreen />;
  }

  const isConfirming = isTxConfirming(transactionId) || true;
  const title = isConfirming ? t('Bridge Transfer in Progress') : t('Bridge');
  const BridgeStatePage = isConfirming
    ? BridgeInProgress
    : BridgeTransactionForm;

  return (
    <BridgeStateProvider>
      <Page
        title={title}
        withBackButton
        contentProps={{
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          width: 1,
          height: 1,
          gap: isConfirming ? 1 : 0.5,
        }}
      >
        <BridgeStatePage />
      </Page>
    </BridgeStateProvider>
  );
};

export const Bridge = () => {
  return (
    <BridgeQueryProvider>
      {({ sourceNetwork }) => (
        <NextUnifiedBridgeProvider sourceNetworkId={sourceNetwork}>
          <BridgePage />
        </NextUnifiedBridgeProvider>
      )}
    </BridgeQueryProvider>
  );
};
