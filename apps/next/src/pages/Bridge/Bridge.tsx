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
  useBridgeQuery,
  useNextUnifiedBridgeContext,
} from './contexts';
import { getPageContentProps } from './lib/getPageContentProps';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

const BridgePage: FC = () => {
  useLiveBalance(POLLED_BALANCES);
  const { t } = useTranslation();
  const { isReady, isTxConfirming } = useNextUnifiedBridgeContext();
  const { transactionId } = useBridgeQuery();

  if (!isReady) {
    return <LoadingScreen />;
  }

  const isConfirming = isTxConfirming(transactionId); // || true; // TODO: remove this before merging
  const title = isConfirming
    ? t('Bridge transfer in progress...')
    : t('Bridge');
  const BridgeStatePage = isConfirming
    ? BridgeInProgress
    : BridgeTransactionForm;

  return (
    <BridgeStateProvider>
      <Page
        title={title}
        withBackButton
        contentProps={getPageContentProps(isConfirming)}
      >
        <BridgeStatePage />
      </Page>
    </BridgeStateProvider>
  );
};

export const Bridge = () => {
  return (
    <BridgeQueryProvider>
      <BridgePage />
    </BridgeQueryProvider>
  );
};
