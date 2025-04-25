import {
	LedgerConnector,
	LedgerConnectorData,
} from '@/components/ledger/LedgerConnector';
import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { useOnboardingContext } from '@/contexts/OnboardingProvider';
import {
	Button,
	ExternalLinkIcon,
	InfoCircleIcon,
	Stack,
	Tooltip,
	Typography,
	useTheme,
} from '@avalabs/core-k2-components';
import { WalletType } from '@avalabs/types';
import {
	ONBOARDING_EVENT_NAMES,
	OnboardingPhase,
	OnboardingURLs,
} from '@core/types';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LedgerWrongVersionOverlay } from '../../../Ledger/LedgerWrongVersionOverlay';
import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { PageNav } from '../../components/PageNav';

export interface AddressType {
  address: string;
  balance: string;
}

export enum LedgerStatus {
  LEDGER_UNINITIATED = 'uninitiated',
  LEDGER_LOADING = 'loading',
  LEDGER_CONNECTED = 'connected',
  LEDGER_CONNECTION_FAILED = 'failed',
}

/**
 * Waiting this amount of time otherwise this screen would be a blip and the user wouldnt even know it happened
 */
export const WAIT_1500_MILLI_FOR_USER = 1500;

export function LedgerConnect() {
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const {
    setXpub,
    setXpubXP,
    setPublicKeys,
    setOnboardingPhase,
    setOnboardingWalletType,
    setNumberOfAccountsToCreate,
  } = useOnboardingContext();
  const [hasPublicKeys, setHasPublicKeys] = useState(false);

  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    setOnboardingPhase(OnboardingPhase.LEDGER);
    setOnboardingWalletType(WalletType.Ledger);
    capture(ONBOARDING_EVENT_NAMES.ledger);
  }, [capture, setOnboardingPhase, setOnboardingWalletType]);

  function onSuccess(data: LedgerConnectorData) {
    setXpub(data.xpub);
    setXpubXP(data.xpubXP);
    setPublicKeys(data.publicKeys);
    setHasPublicKeys(data.hasPublicKeys);
    setNumberOfAccountsToCreate(data.lastAccountIndexWithBalance + 1);
  }

  const Content = (
    <Trans
      i18nKey="<typography>This process retrieves the addresses<br />from your ledger</typography>"
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
        testId="connect-ledger"
        title={t('Connect your Ledger')}
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
          <LedgerConnector
            onSuccess={onSuccess}
            onTroubleshoot={() => history.push(OnboardingURLs.LEDGER_TROUBLE)}
          />
        </Stack>
      </Stack>
      <PageNav
        onBack={() => {
          capture('OnboardingCancelled', { step: OnboardingPhase.LEDGER });
          history.goBack();
        }}
        onNext={() => history.push(OnboardingURLs.CREATE_PASSWORD)}
        disableNext={!hasPublicKeys}
        expand={true}
        steps={3}
        activeStep={0}
      >
        <Button
          variant="text"
          onClick={() => {
            window.open(
              'https://www.ledger.com/ledger-live',
              '_blank',
              'noreferrer',
            );
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
            {t('Ledger Live Support')}
          </Typography>
        </Button>
      </PageNav>

      <LedgerWrongVersionOverlay onClose={() => history.goBack()} />
    </Stack>
  );
}
