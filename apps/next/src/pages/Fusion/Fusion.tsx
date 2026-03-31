import { alpha, Button, styled, Stack, Tooltip } from '@avalabs/k2-alpine';
import { TokenType as VmTokenType } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';

import { useLiveBalance } from '@core/ui';

import { Page } from '@/components/Page';

import { FusionStateContextProvider, useFusionState } from './contexts';
import { SwapContent } from './SwapContent';
import { SwapProviderNotice } from './components/SwapProviderNotice';

const POLLED_BALANCES = [
  VmTokenType.NATIVE,
  VmTokenType.ERC20,
  VmTokenType.SPL,
] as VmTokenType[];

const FusionPage = () => {
  useLiveBalance(POLLED_BALANCES);

  const { t } = useTranslation();

  const { isConfirming, transfer, status, priceImpactSeverity, formError } =
    useFusionState();

  const isCriticalPriceImpact = priceImpactSeverity === 'critical';
  const isSwapDisabled =
    isConfirming ||
    status !== 'ready-to-transfer' ||
    isCriticalPriceImpact ||
    Boolean(formError);

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
          <SwapProviderNotice />
          <Tooltip
            title={
              isCriticalPriceImpact
                ? t(
                    'Price impact is the effect of your swap on the price of a token. It is influenced by your order size and available liquidity. Core has no control over price impact.',
                  )
                : ''
            }
          >
            <span>
              <Button
                fullWidth
                size="extension"
                variant="contained"
                color="primary"
                onClick={() => transfer()}
                disabled={isSwapDisabled}
                loading={isConfirming}
              >
                {t('Swap')}
              </Button>
            </span>
          </Tooltip>
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
