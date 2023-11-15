import {
  Stack,
  Typography,
  ListIcon,
  Divider,
  KeystoneIcon,
  LedgerIcon,
  IconButton,
  styled,
} from '@avalabs/k2-components';
import { BrandName } from '@src/components/icons/BrandName';
import { Logo } from '@src/components/icons/Logo';
import { useTranslation, Trans } from 'react-i18next';
import { TypographyLink } from '../../components/TypographyLink';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useHistory } from 'react-router-dom';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import { GoogleButton } from '../Seedless/components/GoogleButton';
import { AppleButton } from '../Seedless/components/AppleButton';
import { useState } from 'react';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';

const RoundButton = styled(Stack)`
  justify-items: center;
  align-items: center;
  row-gap: 8px;
  cursor: pointer;
  width: 64px;
`;

export function SignIn() {
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();
  const history = useHistory();
  const [isAuthenticationInProgress, setIsAuthenticationInProgress] =
    useState(false);

  return (
    <Stack sx={{ top: '15%', position: 'relative' }}>
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
        <Stack sx={{ mb: 8 }}>
          <Typography variant="h3">{t('Sign In with...')}</Typography>
        </Stack>
        <Stack sx={{ rowGap: 2 }}>
          {featureFlags[FeatureGates.SEEDLESS_ONBOARDING_GOOGLE] && (
            <GoogleButton setIsLoading={setIsAuthenticationInProgress} />
          )}
          {featureFlags[FeatureGates.SEEDLESS_ONBOARDING_APPLE] && (
            <AppleButton />
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
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'center',
              columnGap: 1,
            }}
          >
            <RoundButton
              onClick={() => history.push(OnboardingURLs.SEED_PHRASE)}
              data-testid="access-with-seed-phrase"
            >
              <IconButton
                variant="contained"
                color="secondary"
                size="small"
                sx={{ width: '32px', height: '32px' }}
              >
                <ListIcon size={24} />
              </IconButton>
              <Typography variant="caption">{t('Recovery Phrase')}</Typography>
            </RoundButton>
            <RoundButton
              onClick={() => history.push(OnboardingURLs.LEDGER)}
              data-testid="access-with-ledger"
            >
              <IconButton
                variant="contained"
                color="secondary"
                size="small"
                sx={{ width: '32px', height: '32px' }}
              >
                <LedgerIcon size={24} />
              </IconButton>
              <Typography variant="caption">{t('Ledger')}</Typography>
            </RoundButton>
            {featureFlags[FeatureGates.KEYSTONE] && (
              <RoundButton
                onClick={() => history.push(OnboardingURLs.KEYSTONE)}
                data-testid="access-with-keystone"
              >
                <IconButton
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ width: '32px', height: '32px' }}
                >
                  <KeystoneIcon size={24} />
                </IconButton>
                <Typography variant="caption">{t('Keystone')}</Typography>
              </RoundButton>
            )}
          </Stack>
        </Stack>
        <Stack sx={{ mt: 8, rowGap: 2 }}>
          <TypographyLink
            onClick={() => history.push(OnboardingURLs.ONBOARDING_HOME)}
            data-test-id="sign-up-page-button"
          >
            {t('Sign Up')}
          </TypographyLink>
        </Stack>
      </Stack>
      {isAuthenticationInProgress && <LoadingOverlay />}
    </Stack>
  );
}
