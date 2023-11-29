import {
  KeyIcon,
  Stack,
  Typography,
  UsbIcon,
  styled,
  QRCodeIcon,
} from '@avalabs/k2-components';
import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { Trans, useTranslation } from 'react-i18next';
import { MethodCard } from './components/MethodCard';
import { PageNav } from '../../components/PageNav';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import {
  AuthenticatorModal,
  AuthenticatorSteps,
} from './modals/AuthenticatorModal';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';

export enum Methods {
  PASSKEY = 'passkey',
  AUTHENTICATOR = 'totp',
  YUBIKEY = 'yubikey',
}

export const Bold = styled('span')`
  font-weight: bold;
`;

export function RecoveryMethods() {
  const history = useHistory();
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<Methods | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { featureFlags } = useFeatureFlagContext();
  const { oidcToken } = useOnboardingContext();

  useEffect(() => {
    if (!oidcToken) {
      history.push(OnboardingURLs.ONBOARDING_HOME);
      return;
    }
  }, [history, oidcToken, t]);

  return (
    <>
      <Stack
        sx={{
          width: '420px',
          height: '100%',
        }}
      >
        <OnboardingStepHeader
          testId="copy-phrase"
          title={t('Add Recovery Methods')}
        />
        <Stack
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ mb: 5 }}>
            <Trans
              i18nKey="Add <bold>one</bold> recovery method to continue."
              components={{
                bold: <Bold />,
              }}
            />
          </Typography>
          <Stack
            sx={{
              textAlign: 'left',
              rowGap: 1,
            }}
          >
            {featureFlags[FeatureGates.SEEDLESS_MFA_PASSKEY] && (
              <MethodCard
                icon={<KeyIcon size={24} />}
                title={t('Passkey')}
                description={t('Add a Passkey as a recovery method.')}
                onClick={() => setSelectedMethod(Methods.PASSKEY)}
                isActive={selectedMethod === Methods.PASSKEY}
              />
            )}
            {featureFlags[FeatureGates.SEEDLESS_MFA_AUTHENTICATOR] && (
              <MethodCard
                icon={<QRCodeIcon size={24} />}
                title={t('Authenticator')}
                description={t(
                  'Use an authenticator app as a recovery method.'
                )}
                onClick={() => setSelectedMethod(Methods.AUTHENTICATOR)}
                isActive={selectedMethod === Methods.AUTHENTICATOR}
              />
            )}
            {featureFlags[FeatureGates.SEEDLESS_MFA_YUBIKEY] && (
              <MethodCard
                icon={<UsbIcon size={24} />}
                title={t('Yubikey ')}
                description={t('Add a Yubikey as a recovery method.')}
                onClick={() => setSelectedMethod(Methods.YUBIKEY)}
                isActive={selectedMethod === Methods.YUBIKEY}
              />
            )}
          </Stack>
        </Stack>

        <PageNav
          onBack={() => {
            history.goBack();
          }}
          onNext={() => {
            setIsModalOpen(true);
          }}
          activeStep={0}
          steps={3}
          disableNext={!selectedMethod}
        />
      </Stack>
      {isModalOpen && selectedMethod === Methods.AUTHENTICATOR && (
        <AuthenticatorModal
          activeStep={AuthenticatorSteps.SCAN}
          onFinish={() => {
            history.push(OnboardingURLs.CREATE_PASSWORD);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
