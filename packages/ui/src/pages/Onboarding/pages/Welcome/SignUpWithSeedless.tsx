import { Button, Stack } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { useFeatureFlagContext } from '@/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@core/service-worker';
import { useHistory } from 'react-router-dom';
import { OnboardingURLs } from '@core/service-worker';
import { GoogleButton } from '../Seedless/components/GoogleButton';
import { AppleButton } from '../Seedless/components/AppleButton';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { useRef, useState, useEffect } from 'react';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { ExistingWalletOptions } from '../Seedless/components/ExistingWalletOptions';
import { BrandName } from '@/components/icons/BrandName';

export function SignUpWithSeedless() {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { featureFlags } = useFeatureFlagContext();
  const history = useHistory();
  const [isAuthenticationInProgress, setIsAuthenticationInProgress] =
    useState(false);
  const scrimRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const [showExistingWalletOption, setShowExistingWalletOption] =
    useState(false);

  useEffect(() => {
    const handleClickInShim = (event: MouseEvent) => {
      const { target } = event;
      const overlayClicked = scrimRef.current?.contains(target as Node);
      const optionsClicked = optionsRef.current?.contains(target as Node);
      if (overlayClicked && !optionsClicked) {
        setShowExistingWalletOption(false);
      }
    };
    document.addEventListener('mousedown', handleClickInShim);

    return () => {
      document.removeEventListener('mousedown', handleClickInShim);
    };
  }, [scrimRef, setShowExistingWalletOption]);

  return (
    <>
      <Stack
        sx={{
          width: '322px',
          textAlign: 'center',
          height: '100%',
        }}
        ref={scrimRef}
      >
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '40%',
          }}
        >
          <BrandName width={120} />
        </Stack>

        <Stack sx={{ rowGap: 2, height: '40%' }}>
          {featureFlags[FeatureGates.SEEDLESS_ONBOARDING_GOOGLE] && (
            <GoogleButton setIsLoading={setIsAuthenticationInProgress} />
          )}
          {featureFlags[FeatureGates.SEEDLESS_ONBOARDING_APPLE] && (
            <AppleButton setIsLoading={setIsAuthenticationInProgress} />
          )}
          <Stack
            sx={{
              pt: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
              rowGap: 2,
            }}
          >
            <Button
              sx={{ width: '100%' }}
              data-testid="create-wallet-seed-phrase-button"
              color="secondary"
              size="large"
              onClick={() => {
                history.push(OnboardingURLs.CREATE_WALLET);
                capture('RecoveryPhraseClicked');
              }}
            >
              {t('Manually Create New Wallet')}
            </Button>
            <Button
              sx={{ width: '100%' }}
              data-testid="access-existing-wallet-button"
              color="secondary"
              size="large"
              onClick={() => {
                setShowExistingWalletOption(true);
              }}
            >
              {t('Access Existing Wallet')}
            </Button>
          </Stack>
        </Stack>
        {showExistingWalletOption && (
          <ExistingWalletOptions
            ref={optionsRef}
            setShowExistingWalletOption={setShowExistingWalletOption}
          />
        )}
      </Stack>
      {isAuthenticationInProgress && <LoadingOverlay />}
    </>
  );
}
