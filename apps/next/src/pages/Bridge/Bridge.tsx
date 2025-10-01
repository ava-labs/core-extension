import { Button, Stack, StackProps, toast } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import { useAccountsContext, useLiveBalance } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountSelect } from '@/components/AccountSelect';
import { Page } from '@/components/Page';

import { LoadingScreen } from '@/components/LoadingScreen';
import {
  BridgeControls,
  BridgeErrorMessage,
  BridgeProviderNotice,
  CoreFeeNotice,
} from './components';
import {
  BridgeQueryProvider,
  BridgeStateProvider,
  NextUnifiedBridgeProvider,
  useBridgeQuery,
  useNextUnifiedBridgeContext,
} from './contexts';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];
const contentProps: StackProps = {
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  width: 1,
  height: 1,
  gap: 0.5,
};

const BridgePage: FC = () => {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();
  const {
    accounts: { active },
    selectAccount,
  } = useAccountsContext();
  const [accountQuery, setAccountQuery] = useState('');
  const [bridgeError, setBridgeError] = useState<string>('');

  const { updateQuery } = useBridgeQuery();

  const performBridge = () => {
    toast.error('Not implemented');
    setBridgeError('Not implemented');
  };

  const isConfirming = false;
  const isAmountLoading = false;

  return (
    <Page title={t('Bridge')} withBackButton contentProps={contentProps}>
      <Stack gap={2}>
        <AccountSelect
          addressType="C"
          value={active}
          query={accountQuery}
          onValueChange={(newAccount) => {
            selectAccount(newAccount.id);
            updateQuery({
              amount: '',
            });
          }}
          onQueryChange={setAccountQuery}
        />
        <BridgeControls onQueryChange={updateQuery} />
      </Stack>
      <BridgeErrorMessage error={bridgeError} />
      <CoreFeeNotice />
      <Stack
        width="100%"
        flexGrow={1}
        justifyContent="flex-end"
        gap={1}
        textAlign="center"
      >
        <BridgeProviderNotice />
        <Button
          fullWidth
          size="extension"
          variant="contained"
          color="primary"
          onClick={performBridge}
          disabled={isConfirming || isAmountLoading}
          loading={isConfirming || isAmountLoading}
        >
          {t('Bridge')}
        </Button>
      </Stack>
    </Page>
  );
};

const BridgePageLoader: FC = () => {
  const { isReady } = useNextUnifiedBridgeContext();
  if (!isReady) {
    return <LoadingScreen />;
  }
  return (
    <BridgeStateProvider>
      <BridgePage />
    </BridgeStateProvider>
  );
};

export const Bridge = () => {
  return (
    <BridgeQueryProvider>
      {({ sourceNetwork }) => (
        <NextUnifiedBridgeProvider sourceNetworkId={sourceNetwork}>
          <BridgePageLoader />
        </NextUnifiedBridgeProvider>
      )}
    </BridgeQueryProvider>
  );
};
