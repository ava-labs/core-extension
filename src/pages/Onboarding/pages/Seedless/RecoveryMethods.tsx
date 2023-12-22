import {
  KeyIcon,
  Stack,
  Typography,
  UsbIcon,
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
import { FIDOModal } from './modals/FIDOModal';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { InlineBold } from '@src/components/common/InlineBold';
import { RecoveryMethodTypes } from './models';

export function RecoveryMethods() {
  const history = useHistory();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const [selectedMethod, setSelectedMethod] =
    useState<RecoveryMethodTypes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { featureFlags } = useFeatureFlagContext();
  const { oidcToken } = useOnboardingContext();

  useEffect(() => {
    if (!oidcToken) {
      history.push(OnboardingURLs.ONBOARDING_HOME);
      return;
    }
  }, [history, oidcToken, t]);

  useEffect(() => {
    if (selectedMethod) {
      setIsModalOpen(true);
    }
  }, [selectedMethod]);

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
                bold: <InlineBold />,
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
                onClick={() => setSelectedMethod(RecoveryMethodTypes.PASSKEY)}
              />
            )}
            {featureFlags[FeatureGates.SEEDLESS_MFA_AUTHENTICATOR] && (
              <MethodCard
                icon={<QRCodeIcon size={24} />}
                title={t('Authenticator')}
                description={t(
                  'Use an authenticator app as a recovery method.'
                )}
                onClick={() => setSelectedMethod(RecoveryMethodTypes.TOTP)}
              />
            )}
            {featureFlags[FeatureGates.SEEDLESS_MFA_YUBIKEY] && (
              <MethodCard
                icon={<UsbIcon size={24} />}
                title={t('Yubikey')}
                description={t('Add a Yubikey as a recovery method.')}
                onClick={() => setSelectedMethod(RecoveryMethodTypes.YUBIKEY)}
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
      {isModalOpen && selectedMethod === RecoveryMethodTypes.TOTP && (
        <AuthenticatorModal
          activeStep={AuthenticatorSteps.SCAN}
          onFinish={() => {
            capture('recoveryMethodAdded', { method: selectedMethod });
            history.push(OnboardingURLs.CREATE_PASSWORD);
          }}
          onCancel={() => {
            capture(`FidoDevice${selectedMethod}Cancelled`);
            setIsModalOpen(false);
            setSelectedMethod(null);
          }}
        />
      )}
      {isModalOpen &&
        (selectedMethod === RecoveryMethodTypes.YUBIKEY ||
          selectedMethod === RecoveryMethodTypes.PASSKEY) && (
          <FIDOModal
            onFinish={() => {
              capture(`recoveryMethodAdded`, { method: selectedMethod });
              history.push(OnboardingURLs.CREATE_PASSWORD);
            }}
            onCancel={() => {
              setIsModalOpen(false);
              capture(`FidoDevice${selectedMethod}Cancelled`);
              setSelectedMethod(null);
            }}
            selectedMethod={selectedMethod}
          />
        )}
    </>
  );
}
