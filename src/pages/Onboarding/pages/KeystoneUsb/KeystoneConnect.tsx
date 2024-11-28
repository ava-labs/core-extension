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
import { KeystoneConnector } from '@src/components/keystone/KeystoneConnector';

export function KeystoneConnect() {
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const { setOnboardingPhase, setOnboardingWalletType } =
    useOnboardingContext();
  const [selectedDevice, setSelectedDevice] = useState<string>('Keystone 3');
  const [showKeystoneConnector, setShowKeystoneConnector] =
    useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    setOnboardingPhase(OnboardingPhase.KEYSTONE);
    setOnboardingWalletType(WalletType.Keystone);
    capture(ONBOARDING_EVENT_NAMES.keystone);
  }, [capture, setOnboardingPhase, setOnboardingWalletType]);

  const handleDeviceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDevice(event.target.value as string);
  };

  const handleNext = () => {
    setIsProcessing(true);
    if (selectedDevice === 'Keystone 3') {
      setShowKeystoneConnector(true);
    } else {
      history.push(OnboardingURLs.KEYSTONE);
    }
  };

  const onSuccess = () => {
    console.log('Keystone connection successful!');
    history.push(OnboardingURLs.CREATE_PASSWORD);
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
      {/* <OnboardingStepHeader
        testId="connect-keystone-usb"
        title={t('Connect your Keystone')}
      /> */}

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
        <Typography variant="body2">
          {t('Select the device you are using to proceed.')}
          <Tooltip
            title={Content}
            sx={{
              display: 'inline',
              cursor: 'pointer',
              pl: theme.spacing(1),
              verticalAlign: 'middle',
              textAlign: 'center',
            }}
          ></Tooltip>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, mt: 20 }}>
          {t('Select your device')}
        </Typography>

        <Select
          value={selectedDevice}
          onChange={handleDeviceChange}
          displayEmpty
          disabled={isProcessing}
          fullWidth
          sx={{
            width: '100%',
            maxWidth: '700px',
            alignSelf: 'flex-start',
            mt: 0,
          }}
        >
          <MenuItem value="Keystone 3">Keystone 3</MenuItem>
          <MenuItem value="Keystone Essential/Pro">
            Keystone Essential/Pro
          </MenuItem>
        </Select>

        {errorMessage && (
          <Typography
            variant="body2"
            sx={{
              color: 'error.main',
              fontSize: 10,
              mt: 1,
              textAlign: 'left',
              width: '100%',
            }}
          >
            {errorMessage}
          </Typography>
        )}
      </Stack>

      {showKeystoneConnector && (
        <KeystoneConnector
          errorMessage={errorMessage}
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
        disableNext={isProcessing}
        expand={true}
        steps={3}
        activeStep={0}
      ></PageNav>

      <LedgerWrongVersionOverlay onClose={() => history.goBack()} />
    </Stack>
  );
}
