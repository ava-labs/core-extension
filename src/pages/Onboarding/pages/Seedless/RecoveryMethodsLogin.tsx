import {
  KeyIcon,
  QRCodeIcon,
  Skeleton,
  Stack,
  Typography,
  UsbIcon,
  styled,
  toast,
} from '@avalabs/k2-components';
import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { Trans, useTranslation } from 'react-i18next';
import { MethodCard } from './components/MethodCard';
import { PageNav } from '../../components/PageNav';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { CubeSigner, envs } from '@cubist-labs/cubesigner-sdk';
import { TOTPModal } from './modals/TOTPModal';

export enum Methods {
  PASSKEY = 'passkey',
  AUTHENTICATOR = 'totp',
  YUBIKEY = 'yubikey',
}

export const Bold = styled('span')`
  font-weight: bold;
`;

export function RecoveryMethodsLogin() {
  const history = useHistory();
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<Methods | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { featureFlags } = useFeatureFlagContext();
  const { oidcToken } = useOnboardingContext();
  const [configuredMfas, setConfiguredMfas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!oidcToken) {
      toast.error(t('Seedless login error'));
      history.push(OnboardingURLs.ONBOARDING_HOME);
      return;
    }
  }, [history, oidcToken, t]);

  useEffect(() => {
    setIsLoading(true);
    const getMfas = async () => {
      if (!oidcToken) {
        return false;
      }
      const cubesigner = new CubeSigner({
        orgId: process.env.SEEDLESS_ORG_ID || '',
        env: envs[process.env.CUBESIGNER_ENV || ''],
      });
      const identity = await cubesigner.oidcProveIdentity(
        oidcToken,
        process.env.SEEDLESS_ORG_ID || ''
      );
      const configuredMfa = identity.user_info?.configured_mfa;
      if (configuredMfa) {
        const mfas = configuredMfa.map((mfa) => mfa.type);

        setConfiguredMfas(mfas);
      }
      setIsLoading(false);
    };
    getMfas();
  }, [oidcToken]);

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
          title={t('Verify Recovery Methods')}
        />
        <Stack
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ mb: 5 }}>
            <Trans i18nKey="Verify your recovery method(s) to continue." />
          </Typography>
          <Stack
            sx={{
              textAlign: 'left',
              rowGap: 1,
            }}
          >
            {isLoading && (
              <>
                <Skeleton width="100%" height="150px" />
                <Skeleton width="100%" height="150px" />
              </>
            )}
            {featureFlags[FeatureGates.SEEDLESS_MFA_PASSKEY] &&
              configuredMfas.includes(Methods.PASSKEY) && (
                <MethodCard
                  icon={<KeyIcon size={24} />}
                  title={t('Passkey')}
                  description={t('Add a Passkey as a recovery method.')}
                  onClick={() => setSelectedMethod(Methods.PASSKEY)}
                  isActive={selectedMethod === Methods.PASSKEY}
                />
              )}
            {featureFlags[FeatureGates.SEEDLESS_MFA_AUTHENTICATOR] &&
              configuredMfas.includes(Methods.AUTHENTICATOR) && (
                <MethodCard
                  icon={<QRCodeIcon size={24} />}
                  title={t('Authenticator')}
                  description={t(
                    'Verify an authenticator app as a recovery method.'
                  )}
                  onClick={() => setSelectedMethod(Methods.AUTHENTICATOR)}
                  isActive={selectedMethod === Methods.AUTHENTICATOR}
                />
              )}
            {featureFlags[FeatureGates.SEEDLESS_MFA_YUBIKEY] &&
              configuredMfas.includes(Methods.YUBIKEY) && (
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
        <TOTPModal
          onFinish={() => {
            history.push(OnboardingURLs.CREATE_PASSWORD);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
