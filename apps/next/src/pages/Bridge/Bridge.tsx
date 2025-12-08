import { TokenType } from '@avalabs/vm-module-types';
import { useLiveBalance } from '@core/ui';
import { FC } from 'react';

import { Page } from '@/components/Page';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useTranslation } from 'react-i18next';
import { BridgeSanctions } from './components';
import { BridgeInProgress } from './components/BridgeInProgress';
import { BridgeTransactionForm } from './components/BridgeTransactionForm';
import {
  BridgeQueryProvider,
  BridgeStateProvider,
  useBridgeQuery,
  useNextUnifiedBridgeContext,
} from './contexts';
import { useBridgeTxHandlers } from './hooks';
import { getPageContentProps } from './lib/getPageContentProps';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

const BridgePage: FC = () => {
  useLiveBalance(POLLED_BALANCES);
  const { t } = useTranslation();
  const { state } = useNextUnifiedBridgeContext();
  const { transactionId } = useBridgeQuery();

  const txHandlers = useBridgeTxHandlers();

  if (txHandlers.isAddressBlocked) {
    return <BridgeSanctions />;
  }

  const pendingTransfer = state.pendingTransfers[transactionId];
  const isInProgress = pendingTransfer != null;
  const title = isInProgress
    ? t('Bridge transfer {{action}}', {
        action: pendingTransfer.completedAt
          ? pendingTransfer.errorCode
            ? t('failed')
            : t('completed')
          : t('in progress...'),
      })
    : t('Bridge');

  return (
    <Page
      title={title}
      withBackButton
      contentProps={getPageContentProps(isInProgress)}
    >
      {isInProgress ? (
        <BridgeInProgress transfer={pendingTransfer} />
      ) : (
        <BridgeTransactionForm
          transactionError={txHandlers.error}
          onSuccess={txHandlers.onSuccess}
          onRejected={txHandlers.onRejected}
          onFailure={txHandlers.onFailure}
        />
      )}
    </Page>
  );
};

export const Bridge = () => {
  const { isReady } = useNextUnifiedBridgeContext();
  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <BridgeQueryProvider>
      <BridgeStateProvider>
        <BridgePage />
      </BridgeStateProvider>
    </BridgeQueryProvider>
  );
};
