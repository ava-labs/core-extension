import {
  Button,
  Stack,
  Typography,
  KeystoneIcon,
  LedgerIcon,
  ArrowLeftIcon,
  ShieldLockIcon,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useHistory } from 'react-router-dom';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import { GoogleButton } from '../Seedless/components/GoogleButton';
import { AppleButton } from '../Seedless/components/AppleButton';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import { useState } from 'react';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Overlay } from '@src/components/common/Overlay';
import { ExistingWalletButton } from '../Seedless/components/ExistingWalletButton';
import { BlinkingLogo } from '@src/components/icons/BlinkLogo';

export function SignUpWithSeedles() {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { featureFlags } = useFeatureFlagContext();
  const history = useHistory();
  const [isAuthenticationInProgress, setIsAuthenticationInProgress] =
    useState(false);

  const [showExistingWalletOption, setShowExistingWalletOption] =
    useState(false);

  return (
    <>
      <Stack
        sx={{
          width: '322px',
          textAlign: 'center',
          height: '100%',
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '40%',
          }}
        >
          <BlinkingLogo height={150} />
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
          <Overlay>
            <Stack sx={{ width: 480, alignItems: 'flex-start', rowGap: 5 }}>
              <ArrowLeftIcon
                size={32}
                onClick={() => {
                  setShowExistingWalletOption(false);
                }}
              />
              <Typography variant="h3" sx={{ textAlign: 'left' }}>
                {t('How would you like to access your existing wallet?')}
              </Typography>
              <Stack>
                <Stack sx={{ flexDirection: 'row', columnGap: 3, pb: 3 }}>
                  <ExistingWalletButton
                    data-testid="access-with-seed-phrase"
                    icon={<ShieldLockIcon size={30} />}
                    text={t('Enter recovery phrase')}
                    onClick={() => {
                      history.push(OnboardingURLs.SEED_PHRASE);
                    }}
                  />
                  <ExistingWalletButton
                    data-testid="access-with-ledger"
                    icon={<LedgerIcon size={30} />}
                    text={t('Add using Ledger')}
                    onClick={() => {
                      history.push(OnboardingURLs.LEDGER);
                    }}
                  />
                </Stack>
                {featureFlags[FeatureGates.KEYSTONE] && (
                  <Stack sx={{ flexDirection: 'row' }}>
                    <ExistingWalletButton
                      data-testid="access-with-seed-keystone"
                      icon={<KeystoneIcon size={30} />}
                      text={t('Add using Keystone')}
                      onClick={() => {
                        history.push(OnboardingURLs.KEYSTONE);
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Overlay>
        )}
      </Stack>
      {isAuthenticationInProgress && <LoadingOverlay />}
    </>
  );
}
