import { useEffect, useState } from 'react';
import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { Trans, useTranslation } from 'react-i18next';
import { LedgerWrongVersionOverlay } from '../../../Ledger/LedgerWrongVersionOverlay';
import {
  Button,
  ExternalLinkIcon,
  InfoCircleIcon,
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
import {
  KeystoneConnector,
  KeystoneConnectorData,
} from '@src/components/keystone/KeystoneConnector';
import { WalletType } from '@avalabs/types';

export interface AddressType {
  address: string;
  balance: string;
}

export enum KeystoneStatus {
  KEYSTONE_UNINITIATED = 'uninitiated',
  KEYSTONE_LOADING = 'loading',
  KEYSTONE_CONNECTED = 'connected',
  KEYSTONE_CONNECTION_FAILED = 'failed',
}

/**
 * Waiting this amount of time otherwise this screen would be a blip and the user wouldnt even know it happened
 */
export const WAIT_1500_MILLI_FOR_USER = 1500;

export function KeystoneConnect() {
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const {
    setXpub,
    setXpubXP,
    setPublicKeys,
    setOnboardingPhase,
    setOnboardingWalletType,
  } = useOnboardingContext();
  const [hasPublicKeys, setHasPublicKeys] = useState(false);

  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    setOnboardingPhase(OnboardingPhase.KEYSTONE);
    setOnboardingWalletType(WalletType.Keystone);
    capture(ONBOARDING_EVENT_NAMES.keystone);
  }, [capture, setOnboardingPhase, setOnboardingWalletType]);

  function onSuccess(data: KeystoneConnectorData) {
    setXpub(data.xpub);
    setXpubXP(data.xpubXP);
    setPublicKeys(data.publicKeys);
    setHasPublicKeys(data.hasPublicKeys);
  }

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
        title={t('Connect your Keystone')}
      />
      <Stack sx={{ flexGrow: 1, pt: 1, px: 6 }}>
        <Typography variant="body2">
          {t('Select a derivation path to see your derived addresses.')}
          <Tooltip
            title={Content}
            sx={{
              display: 'inline',
              cursor: 'pointer',
              pl: theme.spacing(1),
              verticalAlign: 'middle',
            }}
          >
            <InfoCircleIcon size={14} />
          </Tooltip>
        </Typography>
        <Stack sx={{ mt: 7.5 }}>
          <KeystoneConnector
            onSuccess={onSuccess}
            onTroubleshoot={() => history.push(OnboardingURLs.KEYSTONE_TROUBLE)}
          />
        </Stack>
      </Stack>
      <PageNav
        onBack={() => {
          capture('OnboardingCancelled', {
            step: OnboardingPhase.KEYSTONE_USB,
          });
          history.goBack();
        }}
        onNext={() => history.push(OnboardingURLs.CREATE_PASSWORD)}
        disableNext={!hasPublicKeys}
        expand={true}
        steps={3}
        activeStep={0}
      ></PageNav>

      <LedgerWrongVersionOverlay onClose={() => history.goBack()} />
    </Stack>
  );
}
