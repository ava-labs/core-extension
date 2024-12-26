import { useEffect, useState } from 'react';
import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { useTranslation } from 'react-i18next';
import {
  MenuItem,
  Select,
  Stack,
  Typography,
  ExternalLinkIcon,
  Button,
} from '@avalabs/core-k2-components';
import { PageNav } from '../../components/PageNav';
import {
  ONBOARDING_EVENT_NAMES,
  OnboardingPhase,
  OnboardingURLs,
} from '@src/background/services/onboarding/models';
import { useHistory } from 'react-router-dom';
import { WalletType } from '@avalabs/types';
import {
  KeystoneConnector,
  KeystoneConnectorData,
} from '@src/components/keystone/KeystoneConnector';

enum KeystoneDevice {
  Keystone3 = 'USB (Keystone 3 Pro)',
  KeystoneEssential = 'QR code (Keystone Essential/Pro)',
}

enum KeystoneConnectStep {
  CONNECT_DEVICE,
  CALC_ADDRESSES,
  STEP,
}

export function KeystoneConnect() {
  const { capture } = useAnalyticsContext();
  const [selectedDevice, setSelectedDevice] = useState<KeystoneDevice>(
    KeystoneDevice.Keystone3,
  );
  const [showKeystoneConnector, setShowKeystoneConnector] =
    useState<boolean>(false);
  const { t } = useTranslation();
  const history = useHistory();
  const {
    setXpub,
    setXpubXP,
    setPublicKeys,
    setOnboardingPhase,
    setOnboardingWalletType,
  } = useOnboardingContext();
  const [hasPublicKeys, setHasPublicKeys] = useState(false);
  const [step, setStep] = useState<KeystoneConnectStep>(
    KeystoneConnectStep.CONNECT_DEVICE,
  );

  useEffect(() => {
    setOnboardingPhase(OnboardingPhase.KEYSTONE);
    setOnboardingWalletType(WalletType.Keystone);
    capture(ONBOARDING_EVENT_NAMES.keystone);
  }, [capture, setOnboardingPhase, setOnboardingWalletType]);

  const handleDeviceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDevice(event.target.value as KeystoneDevice);
  };

  const handleNext = () => {
    if (
      selectedDevice === KeystoneDevice.Keystone3 &&
      step === KeystoneConnectStep.CONNECT_DEVICE
    ) {
      setShowKeystoneConnector(true);
    } else if (step === KeystoneConnectStep.CALC_ADDRESSES) {
      history.push(OnboardingURLs.CREATE_PASSWORD);
    } else {
      history.push(OnboardingURLs.KEYSTONE);
    }
  };

  const onSuccess = (data: KeystoneConnectorData) => {
    setXpub(data.xpub);
    setXpubXP(data.xpubXP);
    setPublicKeys(data.publicKeys);
    setHasPublicKeys(data.hasPublicKeys);
    setStep(KeystoneConnectStep.CALC_ADDRESSES);
  };

  // const shouldShowDeviceSelection = step !== KeystoneConnectStep.CALC_ADDRESSES &&

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    >
      <OnboardingStepHeader
        testId="connect-keystone-usb"
        title={t('Connect your Keystone')}
      />
      {step != KeystoneConnectStep.CALC_ADDRESSES && (
        <Stack>
          <Typography variant="body2" sx={{ mb: 2, mt: 20 }}>
            {t('Select your device')}
          </Typography>
          <Select
            value={selectedDevice}
            onChange={handleDeviceChange}
            fullWidth
          >
            <MenuItem value={KeystoneDevice.Keystone3}>
              {KeystoneDevice.Keystone3}
            </MenuItem>
            <MenuItem value={KeystoneDevice.KeystoneEssential}>
              {KeystoneDevice.KeystoneEssential}
            </MenuItem>
          </Select>
        </Stack>
      )}

      {showKeystoneConnector && <KeystoneConnector onSuccess={onSuccess} />}

      <PageNav
        onBack={() => {
          capture('OnboardingCancelled', {
            step: OnboardingPhase.KEYSTONE_USB,
          });
          history.goBack();
        }}
        onNext={handleNext}
        disableNext={
          !hasPublicKeys && step === KeystoneConnectStep.CALC_ADDRESSES
        }
        expand={true}
        steps={KeystoneConnectStep.STEP}
        activeStep={step}
      >
        <Button
          variant="text"
          onClick={() => {
            window.open('https://keyst.one/', '_blank', 'noreferrer');
          }}
        >
          <ExternalLinkIcon size={16} sx={{ color: 'secondary.main' }} />
          <Typography
            variant="caption"
            sx={{
              ml: 1,
              color: 'secondary.main',
            }}
          >
            {t('Keystone Support')}
          </Typography>
        </Button>
      </PageNav>
    </Stack>
  );
}
