import { Button, Stack } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountsContext, useLiveBalance } from '@core/ui';

import { Page } from '@/components/Page';
import { AccountSelect } from '@/components/AccountSelect';

import { SwapStateContextProvider, useSwapState } from './contexts';
import {
  SwapErrorMessage,
  SwapPair,
  SwapSettings,
  CoreFeeNotice,
  SwapProviderNotice,
} from './components';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

const SwapPage = () => {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();
  const {
    accounts: { active },
    selectAccount,
  } = useAccountsContext();

  const { updateQuery, performSwap, isConfirming, isAmountLoading } =
    useSwapState();

  const [accountQuery, setAccountQuery] = useState('');

  return (
    <Page
      title={t('Swap')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Stack width="100%" flexGrow={1} gap={0.5}>
        <Stack gap={2}>
          <AccountSelect
            addressType="C"
            value={active}
            query={accountQuery}
            onValueChange={(newAccount) => {
              selectAccount(newAccount.id);
              updateQuery({
                userAmount: '',
                side: 'sell',
              });
            }}
            onQueryChange={(q) => setAccountQuery(q)}
          />
          <SwapPair />
        </Stack>
        <SwapErrorMessage />
        <SwapSettings />
        <CoreFeeNotice />
        <Stack
          width="100%"
          flexGrow={1}
          justifyContent="flex-end"
          gap={1}
          textAlign="center"
        >
          <SwapProviderNotice />
          <Button
            fullWidth
            size="extension"
            variant="contained"
            color="primary"
            onClick={() => performSwap()}
            disabled={isConfirming || isAmountLoading}
            loading={isConfirming || isAmountLoading}
          >
            {t('Swap')}
          </Button>
        </Stack>
      </Stack>
    </Page>
  );
};

export const Swap = () => {
  return (
    <SwapStateContextProvider>
      <SwapPage />
    </SwapStateContextProvider>
  );
};
