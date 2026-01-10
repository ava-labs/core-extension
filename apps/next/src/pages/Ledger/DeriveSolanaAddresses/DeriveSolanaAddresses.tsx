import { SolanaGlowLogo } from '@/components/ConnectLedger';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';
import { FullscreenModal } from '@/components/FullscreenModal';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useOpenApp } from '@/hooks/useOpenApp';
import { Typography } from '@avalabs/k2-alpine';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorState } from './components/ErrorState';
import { FlowManager } from './components/FlowManager';

export const DeriveSolanaAddresses: FC = () => {
  const { walletDetails } = useWalletContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const [initialAccountState, setInitialAccountState] = useState(active);

  const openApp = useOpenApp();
  const { t } = useTranslation();

  const leavePage = () => {
    openApp({});
    window.close();
  };

  useEffect(() => {
    setInitialAccountState((prev) => prev ?? active);
  }, [active]);

  const isNoWallet = !walletDetails?.id;
  const isAlreadyActivated = initialAccountState?.addressSVM;

  return (
    <>
      <FullscreenAnimatedBackground />
      <FullscreenModal open withCoreLogo withAppInfo withLanguageSelector>
        {isNoWallet ? (
          <LoadingScreen />
        ) : isAlreadyActivated ? (
          <ErrorState
            title=""
            content={
              <>
                <SolanaGlowLogo height="auto" flexGrow={0} />
                <Typography variant="h2" mt={-3} mx={8}>
                  {t('Solana is already active for the selected wallet')}
                </Typography>
              </>
            }
            actionLabel={t('Done')}
            action={leavePage}
          />
        ) : (
          <FlowManager walletId={walletDetails.id} onCloseApp={leavePage} />
        )}
      </FullscreenModal>
    </>
  );
};
