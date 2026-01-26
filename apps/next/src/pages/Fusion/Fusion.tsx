import { alpha, Button, styled, Stack } from '@avalabs/k2-alpine';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountsContext, useLiveBalance } from '@core/ui';

import { Page } from '@/components/Page';
import { AccountSelect } from '@/components/AccountSelect';
import { LoadingScreen } from '@/components/LoadingScreen';

import { FusionStateContextProvider, useFusionState } from './contexts';
import { SwapErrorMessage, SwapPair } from './components';

const POLLED_BALANCES = [
  VmTokenType.NATIVE,
  VmTokenType.ERC20,
  // TODO: Add SPL tokens
] as VmTokenType[];

const FusionPage = () => {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();
  const {
    accounts: { active },
    selectAccount,
  } = useAccountsContext();

  const { isConfirming, isReadyToTransfer, updateQuery, transfer } =
    useFusionState();

  const [accountQuery, setAccountQuery] = useState('');

  return (
    <Page
      title={t('Fusion')} // TODO: rename to swap
      withBackButton
      contentProps={{ justifyContent: 'flex-start', alignItems: 'stretch' }}
    >
      <Suspense fallback={<LoadingScreen />}>
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
                });
              }}
              onQueryChange={(q) => setAccountQuery(q)}
            />
            <SwapPair />
          </Stack>
          <SwapErrorMessage />
        </Stack>
      </Suspense>
      <SwapActionButtonsContainer>
        <Stack
          width="100%"
          flexGrow={1}
          justifyContent="flex-end"
          gap={1}
          textAlign="center"
        >
          <Button
            fullWidth
            size="extension"
            variant="contained"
            color="primary"
            onClick={() => transfer()} // TODO: Pass in the user-selected quote if applicable
            disabled={isConfirming || !isReadyToTransfer}
            loading={isConfirming || !isReadyToTransfer}
          >
            {t('Swap')}
          </Button>
        </Stack>
      </SwapActionButtonsContainer>
    </Page>
  );
};

export const Fusion = () => {
  return (
    <FusionStateContextProvider>
      <FusionPage />
    </FusionStateContextProvider>
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
