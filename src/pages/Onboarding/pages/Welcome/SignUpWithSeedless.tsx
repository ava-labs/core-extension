import {
  Button,
  Stack,
  Typography,
  ListIcon,
  Divider,
  KeystoneIcon,
  LedgerIcon,
  Tooltip,
} from '@avalabs/k2-components';
import { BrandName } from '@src/components/icons/BrandName';
import { Logo } from '@src/components/icons/Logo';
import { useTranslation, Trans } from 'react-i18next';
import { TypographyLink } from '../../components/TypographyLink';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useHistory } from 'react-router-dom';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import { IconButton } from '@mui/material';
import { GoogleButton } from '../Seedless/components/GoogleButton';
import { AppleButton } from '../Seedless/components/AppleButton';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import { useState } from 'react';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function SignUpWithSeedles() {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { featureFlags } = useFeatureFlagContext();
  const history = useHistory();
  const [isAuthenticationInProgress, setIsAuthenticationInProgress] =
    useState(false);

  return (
    <>
      <Stack
        sx={{
          width: '322px',
          textAlign: 'center',
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Logo height={25} />
          <BrandName height={17} margin="0 0 0 12px" />
        </Stack>
        <Stack sx={{ mt: 6, mb: 2 }}>
          <Typography variant="h4">{t('Sign Up with...')}</Typography>
        </Stack>
        <Stack sx={{ rowGap: 2 }}>
          {featureFlags[FeatureGates.SEEDLESS_ONBOARDING_GOOGLE] && (
            <GoogleButton setIsLoading={setIsAuthenticationInProgress} />
          )}
          {featureFlags[FeatureGates.SEEDLESS_ONBOARDING_APPLE] && (
            <AppleButton setIsLoading={setIsAuthenticationInProgress} />
          )}
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Divider sx={{ flexGrow: 4, mr: 1 }} />

            <Typography>
              <Trans i18nKey="Or" />
            </Typography>

            <Divider sx={{ flexGrow: 4, ml: 1.5 }} />
          </Stack>
          <Button
            sx={{ width: '100%' }}
            data-testid="create-wallet-seed-phrase-button"
            color="secondary"
            size="large"
            endIcon={<ListIcon size={20} />}
            onClick={() => {
              history.push(OnboardingURLs.CREATE_WALLET);
              capture('RecoveryPhraseClicked');
            }}
          >
            {t('Recovery Phrase')}
          </Button>
        </Stack>
        <Stack sx={{ mt: 8, rowGap: 1 }}>
          <TypographyLink
            onClick={() => {
              history.push(OnboardingURLs.SIGN_IN);
              capture('AlreadyHaveAWalletClicked');
            }}
            data-testid="access-existing-wallet-button"
          >
            {t('Already Have a Wallet?')}
          </TypographyLink>
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'center',
              columnGap: 3,
            }}
          >
            <Tooltip title={t('Ledger')} placement="bottom">
              <IconButton
                onClick={() => history.push(OnboardingURLs.LEDGER)}
                data-testid="access-with-ledger"
              >
                <LedgerIcon size={24} />
              </IconButton>
            </Tooltip>
            {featureFlags[FeatureGates.KEYSTONE] && (
              <Tooltip title={t('Keystone')} placement="bottom">
                <IconButton
                  onClick={() => history.push(OnboardingURLs.KEYSTONE)}
                  data-testid="access-with-seed-keystone"
                >
                  <KeystoneIcon size={24} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('Seed Phrase')} placement="bottom">
              <IconButton
                onClick={() => history.push(OnboardingURLs.SEED_PHRASE)}
                data-testid="access-with-seed-phrase"
              >
                <ListIcon size={24} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
      {isAuthenticationInProgress && <LoadingOverlay />}
    </>
  );
}
