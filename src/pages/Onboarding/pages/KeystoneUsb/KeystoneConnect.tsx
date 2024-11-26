import { useEffect, useState } from 'react';
import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { Trans, useTranslation } from 'react-i18next';
import { LedgerWrongVersionOverlay } from '../../../Ledger/LedgerWrongVersionOverlay';
import {
  InfoCircleIcon,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
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
  Keystone3 = 'Keystone 3',
  Keystone = 'Keystone Essential/Pro',
}

enum KeystoneConnectStep {
  CONNECT_DEVICE,
  CALC_ADDRESSES,
  STEP,
}

export function KeystoneConnect() {
  const { capture } = useAnalyticsContext();
  const [selectedDevice, setSelectedDevice] = useState<KeystoneDevice>(
    KeystoneDevice.Keystone3
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
    KeystoneConnectStep.CONNECT_DEVICE
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
      setStep(KeystoneConnectStep.CALC_ADDRESSES);
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
  };

  const onTroubleshoot = () => {
    history.push(OnboardingURLs.KEYSTONE_TROUBLE);
  };

  const Content = (
    <Trans
      i18nKey="<typography>This process retrieves the addresses<br />from your Keystone</typography>"
      components={{
        typography: <Typography variant="caption" />,
      }}
    />
  );

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
        title={
          <Typography
            variant="h1"
            sx={{ fontSize: '30px', fontWeight: 'bold' }}
          >
            {t('Connect your Keystone')}
          </Typography>
        }
      />
      <Stack sx={{ flexGrow: 1, pt: 1, px: 6, width: '100%' }}>
        <Typography variant="body2" sx={{ mb: 2, mt: 20 }}>
          {t('Select your device')}
        </Typography>

        <Select
          value={selectedDevice}
          onChange={handleDeviceChange}
          disabled={step === KeystoneConnectStep.CALC_ADDRESSES}
          fullWidth
          sx={{
            width: '100%',
            maxWidth: '700px',
            alignSelf: 'flex-start',
            mt: 0,
          }}
        >
          <MenuItem value={KeystoneDevice.Keystone3}>
            {KeystoneDevice.Keystone3}
          </MenuItem>
          <MenuItem value={KeystoneDevice.Keystone}>
            {KeystoneDevice.Keystone}
          </MenuItem>
        </Select>
      </Stack>

      {showKeystoneConnector && (
        <KeystoneConnector
          onSuccess={onSuccess}
          onTroubleshoot={onTroubleshoot}
        />
      )}

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
      ></PageNav>

      <LedgerWrongVersionOverlay onClose={() => history.goBack()} />
    </Stack>
  );
}
