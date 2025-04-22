import { useCallback, useEffect, useMemo, useState } from 'react';
import { OnboardingStepHeader } from '../../components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { Trans, useTranslation } from 'react-i18next';
import { LedgerWrongVersionOverlay } from '../../../Ledger/LedgerWrongVersionOverlay';
import {
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
  LedgerConnector,
  LedgerConnectorData,
} from '@src/components/ledger/LedgerConnector';
import { WalletType } from '@avalabs/types';
import { MagicSolanaLogo } from '@src/components/common/MagicSolanaLogo';
import { SolanaPublicKey } from '@src/pages/Ledger/models';
import { PubKeyType } from '@src/background/services/wallet/models';
import { LedgerConnectorSolana } from '@src/components/ledger/LedgerConnectorSolana';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { LedgerLiveSupportButton } from '@src/components/ledger/LedgerLiveSupportButton';

export interface AddressType {
  address: string;
  explorerLink: string;
  balance: string;
}

export enum LedgerStatus {
  LEDGER_UNINITIATED = 'uninitiated',
  LEDGER_LOADING = 'loading',
  LEDGER_CONNECTED = 'connected',
  LEDGER_CONNECTION_FAILED = 'failed',
}

type Step = 'avalanche' | 'ask-about-solana' | 'solana';

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
    numberOfAccountsToCreate,
  } = useOnboardingContext();
  const [hasPublicKeys, setHasPublicKeys] = useState(false);
  const [solanaKeys, setSolanaKeys] = useState<SolanaPublicKey[]>([]);
  const [step, setStep] = useState<Step>('avalanche');
  const { isFlagEnabled } = useFeatureFlagContext();

  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    setOnboardingPhase(OnboardingPhase.LEDGER);
    setOnboardingWalletType(WalletType.Ledger);
    capture(ONBOARDING_EVENT_NAMES.ledger);
  }, [capture, setOnboardingPhase, setOnboardingWalletType]);

  const onAvalancheSuccess = useCallback(
    (data: LedgerConnectorData) => {
      setXpub(data.xpub);
      setXpubXP(data.xpubXP);
      setPublicKeys(data.publicKeys);
      setHasPublicKeys(data.hasPublicKeys);
      setNumberOfAccountsToCreate(data.lastAccountIndexWithBalance + 1);
    },
    [setXpub, setXpubXP, setPublicKeys, setNumberOfAccountsToCreate],
  );

  const onSolanaKeysConfirmed = useCallback(
    (keys: SolanaPublicKey[]) => {
      setPublicKeys((pubKeys) => {
        if (!pubKeys) {
          return solanaKeys.map(({ key }) => ({ evm: '', svm: key }));
        }

        const newPublicKeys: PubKeyType[] = [];
        for (const { index, key: solanaKey } of keys) {
          const pubKey = pubKeys[index] ?? null;

          if (!pubKey) {
            throw new Error(
              `Could not find a matching EVM & XP key for Solana key at index ${index}`,
            );
          }

          newPublicKeys.push({
            ...pubKey,
            svm: solanaKey,
          });
        }

        return newPublicKeys;
      });
    },
    [setPublicKeys, solanaKeys],
  );

  const withSolana = useMemo(
    () => isFlagEnabled(FeatureGates.SOLANA_SUPPORT),
    [isFlagEnabled],
  );

  const onBackClick = useCallback(() => {
    if (step === 'avalanche') {
      capture('OnboardingCancelled', { step: OnboardingPhase.LEDGER });
      history.goBack();
    } else if (step === 'ask-about-solana') {
      capture('OnboardingSolanaSupportDenied');
      history.push(OnboardingURLs.CREATE_PASSWORD);
    } else if (step === 'solana') {
      if (withSolana) {
        setStep('ask-about-solana');
      } else {
        history.goBack();
      }
    }
  }, [capture, history, step, withSolana]);

  const onNextClick = useCallback(async () => {
    if (step === 'avalanche') {
      if (withSolana) {
        setStep('ask-about-solana');
      } else {
        history.push(OnboardingURLs.CREATE_PASSWORD);
      }
    } else if (step === 'ask-about-solana') {
      setStep('solana');
      capture('OnboardingSolanaSupportConfirmed');
    } else if (step === 'solana') {
      await onSolanaKeysConfirmed(solanaKeys);
      history.push(OnboardingURLs.CREATE_PASSWORD);
    }
  }, [capture, history, onSolanaKeysConfirmed, solanaKeys, step, withSolana]);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    >
      {step === 'avalanche' && (
        <>
          <OnboardingStepHeader
            testId="connect-ledger"
            title={t('Connect your Ledger')}
          />
          <Stack sx={{ flexGrow: 1, pt: 1, px: 6 }}>
            <Typography variant="body2">
              {t('Select a derivation path to see your derived addresses.')}
              <Tooltip
                title={
                  <Trans
                    i18nKey="<typography>This process retrieves the addresses<br />from your ledger</typography>"
                    components={{
                      typography: <Typography variant="caption" />,
                    }}
                  />
                }
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
                onSuccess={onAvalancheSuccess}
                onTroubleshoot={() =>
                  history.push(OnboardingURLs.LEDGER_TROUBLE)
                }
              />
            </Stack>
          </Stack>
        </>
      )}
      {step === 'ask-about-solana' && (
        <>
          <OnboardingStepHeader
            testId="add-solana-prompt"
            title={t('Add Solana to Your Wallet?')}
          />
          <Stack sx={{ flexGrow: 1, pt: 1, px: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
              <Trans i18nKey="To use Solana in Core you will need to add an account from your Ledger device. You can always add this later at any time." />
            </Typography>

            <Stack sx={{ flexGrow: 1, justifyContent: 'center' }}>
              <MagicSolanaLogo outerSize={340} innerSize={187} />
            </Stack>
          </Stack>
        </>
      )}
      {step === 'solana' && (
        <>
          <OnboardingStepHeader
            testId="connect-solana-ledger"
            title={t('Connect your Ledger')}
          />
          <Stack sx={{ flexGrow: 1, pt: 1, px: 6, textAlign: 'center' }}>
            <Typography variant="body2">
              {t('Open the Solana app on your Ledger device.')}
            </Typography>
            <Stack sx={{ mt: 7.5 }}>
              <LedgerConnectorSolana
                numberOfKeys={numberOfAccountsToCreate}
                onSuccess={(solanaRetrievedKeys) => {
                  setSolanaKeys(solanaRetrievedKeys);
                  capture('OnboardingLedgerSolanaKeysDerived');
                }}
                onFailure={() => {
                  capture('OnboardingLedgerSolanaKeysFailed');
                }}
                onTroubleshoot={() =>
                  history.push(OnboardingURLs.LEDGER_TROUBLE)
                }
              />
            </Stack>
          </Stack>
        </>
      )}
      <PageNav
        onBack={onBackClick}
        backText={step === 'ask-about-solana' ? t('Skip') : t('Back')}
        nextText={step === 'ask-about-solana' ? t('Add') : t('Next')}
        onNext={onNextClick}
        disableNext={
          (step === 'avalanche' && !hasPublicKeys) ||
          (step === 'solana' && solanaKeys.length !== numberOfAccountsToCreate)
        }
        expand={true}
        steps={withSolana ? 5 : 3}
        activeStep={
          step === 'avalanche' ? 0 : step === 'ask-about-solana' ? 1 : 2
        }
      >
        <LedgerLiveSupportButton />
      </PageNav>

      <LedgerWrongVersionOverlay onClose={() => history.goBack()} />
    </Stack>
  );
}
