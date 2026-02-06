import { alpha, styled, Stack } from '@avalabs/k2-alpine';
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
import { TxButton } from '@/components/TxButton';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

const SwapPage = () => {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();
  const {
    accounts: { active },
    selectAccount,
  } = useAccountsContext();

  const {
    updateQuery,
    performSwap,
    isConfirming,
    isAmountLoading,
    swapDisabled,
    swapError,
  } = useSwapState();

  const [accountQuery, setAccountQuery] = useState('');

  return (
    <Page
      title={t('Swap')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start', alignItems: 'stretch' }}
    >
      <Stack width="100%" flexGrow={1} gap={0.5}>
        <Stack gap={1}>
          <AccountSelect
            addressType="C"
            value={active}
            isBalanceVisible={false}
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
      </Stack>
      <SwapActionButtonsContainer>
        <Stack
          width="100%"
          flexGrow={1}
          justifyContent="flex-end"
          gap={1}
          textAlign="center"
        >
          <SwapProviderNotice />

          <TxButton
            isLoading={isConfirming || isAmountLoading}
            isDisabled={
              isConfirming ||
              isAmountLoading ||
              swapDisabled ||
              Boolean(swapError?.message)
            }
            onClick={() => performSwap()}
            title={t('Swap')}
          />
        </Stack>
      </SwapActionButtonsContainer>
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

const SwapActionButtonsContainer = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: 100,
  height: '100px',
  marginLeft: `-${theme.spacing(1.5)}`,
  marginRight: `-${theme.spacing(1.5)}`,
  paddingTop: theme.spacing(1),
  paddingInline: theme.spacing(2),
  paddingBottom: theme.spacing(1.5),
  marginBottom: `-${theme.spacing(1.5)}`,
  background: `linear-gradient(180deg, ${alpha(theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.background.default, 0)} 0%, 
	${theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.background.default} 32px)`,

  '> div': {
    background: 'unset',
  },
}));
