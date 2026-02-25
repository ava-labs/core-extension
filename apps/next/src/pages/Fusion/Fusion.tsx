import { alpha, Button, styled, Stack } from '@avalabs/k2-alpine';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';

import { useLiveBalance } from '@core/ui';

import { Page } from '@/components/Page';

import { FusionStateContextProvider, useFusionState } from './contexts';
import { SwapContent } from './SwapContent';

const POLLED_BALANCES = [
  VmTokenType.NATIVE,
  VmTokenType.ERC20,
  VmTokenType.SPL,
] as VmTokenType[];

const FusionPage = () => {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();

  const { isConfirming, transfer, status } = useFusionState();

  return (
    <Page
      title={t('Swap')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start', alignItems: 'stretch' }}
    >
      <SwapContent />
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
            onClick={() => transfer()}
            disabled={isConfirming || status !== 'ready-to-transfer'}
            loading={isConfirming}
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
