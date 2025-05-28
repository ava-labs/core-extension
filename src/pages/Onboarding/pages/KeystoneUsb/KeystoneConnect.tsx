import { useMemo, useEffect, useState, useCallback } from 'react';
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
  useTheme,
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
  const [inProgress, setInProgress] = useState(false);
  const {
    setXpub,
    setXpubXP,
    setPublicKeys,
    setOnboardingPhase,
    setOnboardingWalletType,
    setMasterFingerprint,
  } = useOnboardingContext();
  const [hasPublicKeys, setHasPublicKeys] = useState(false);
  const [step, setStep] = useState<KeystoneConnectStep>(
    KeystoneConnectStep.CONNECT_DEVICE,
  );
  const theme = useTheme();

  useEffect(() => {
    setOnboardingPhase(OnboardingPhase.KEYSTONE);
    setOnboardingWalletType(WalletType.Keystone);
    capture(ONBOARDING_EVENT_NAMES.keystone);
  }, [capture, setOnboardingPhase, setOnboardingWalletType]);

  const disableNext = useMemo(() => {
    return (
      (!hasPublicKeys && step === KeystoneConnectStep.CALC_ADDRESSES) ||
      inProgress
    );
  }, [hasPublicKeys, inProgress, step]);

  const handleDeviceChange = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const nextSelectedDevice = event.target.value as KeystoneDevice;
      setSelectedDevice(nextSelectedDevice);
      if (nextSelectedDevice !== KeystoneDevice.Keystone3) {
        setShowKeystoneConnector(false);
      }
      setStep(KeystoneConnectStep.CONNECT_DEVICE);
      setInProgress(false);
    },
    [],
  );

  const handleNext = useCallback(() => {
    setInProgress(true);
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
  }, [history, selectedDevice, step, setInProgress, setShowKeystoneConnector]);

  const onSuccess = (data: KeystoneConnectorData) => {
    setXpub(data.xpub);
    setXpubXP(data.xpubXP);
    setMasterFingerprint(data.masterFingerprint);
    setPublicKeys(data.publicKeys);
    setHasPublicKeys(data.hasPublicKeys);
    setStep(KeystoneConnectStep.CALC_ADDRESSES);
    setInProgress(false);
  };

  const content = useMemo(() => {
    const mapper = {
      [KeystoneConnectStep.CONNECT_DEVICE]: {
        title: t('Connect your Keystone'),
        subTitle: t('Select the device you are using'),
      },
      [KeystoneConnectStep.CALC_ADDRESSES]: {
        title: t('Confirm Derived Addresses'),
        subTitle: t('There are addresses derived from your Keystone device'),
      },
    };

    return mapper[step];
  }, [step, t]);

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
        title={content.title}
      />
      <Stack sx={{ flexGrow: 1, pt: 1, px: 6 }}>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          {content.subTitle}
        </Typography>
        <Stack
          sx={{
            width: theme.spacing(44),
            alignSelf: 'center',
            mt: 7.5,
          }}
        >
          {step != KeystoneConnectStep.CALC_ADDRESSES && (
            <Select
              value={selectedDevice}
              label={t('Select your device')}
              inputLabelProps={{
                sx: {
                  transform: 'none',
                  fontSize: theme.typography.body2.fontSize,
                },
              }}
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
          )}
          {showKeystoneConnector && <KeystoneConnector onSuccess={onSuccess} />}
        </Stack>
      </Stack>

      <PageNav
        onBack={() => {
          capture('OnboardingCancelled', {
            step: OnboardingPhase.KEYSTONE_USB,
          });
          history.goBack();
        }}
        onNext={handleNext}
        disableNext={disableNext}
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
