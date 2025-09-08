import { Stack } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountsContext, useLiveBalance } from '@core/ui';

import { Page } from '@/components/Page';
import { AccountSelect } from '@/components/AccountSelect';

import { SwapPair, SwapBody } from './components';
import { SwapStateContextProvider } from './contexts/SwapStateContext';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

const SwapPage = () => {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();
  const {
    accounts: { active },
    selectAccount,
  } = useAccountsContext();

  const [accountQuery, setAccountQuery] = useState('');

  return (
    <Page
      title={t('Swap')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Stack width="100%" gap={2}>
        <AccountSelect
          addressType="C"
          value={active}
          query={accountQuery}
          onValueChange={(newAccount) => selectAccount(newAccount.id)}
          onQueryChange={(q) => setAccountQuery(q)}
        />
        <SwapPair />
      </Stack>
      <SwapBody />
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
