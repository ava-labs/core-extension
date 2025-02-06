import {
  Button,
  CheckIcon,
  ExternalLinkIcon,
  Grid,
  Stack,
  Tooltip,
  Typography,
  toast,
  useTheme,
} from '@avalabs/core-k2-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LedgerWrongVersionOverlay } from '../Ledger/LedgerWrongVersionOverlay';
import type { PubKeyType } from '@src/background/services/wallet/models';
import { NameYourWallet } from './components/NameYourWallet';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { SecretType } from '@src/background/services/secrets/models';
import { useImportLedger } from './hooks/useImportLedger';
import type { LedgerConnectorData } from '../../components/ledger/LedgerConnector';
import { LedgerConnector } from '../../components/ledger/LedgerConnector';
import {
  LedgerTroubleSteps,
  LedgerTroubleStepsFontVariant,
} from '../../components/ledger/LedgerTroublesSteps';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { useErrorMessage } from '@src/hooks/useErrorMessage';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { Overlay } from '@src/components/common/Overlay';
import { AppBackground } from '@src/components/common/AppBackground';
import browser from 'webextension-polyfill';

enum Step {
  Import,
  Name,
  Troubleshoot,
  Completed,
}

export function AddWalletWithLedger() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const getErrorMessage = useErrorMessage();

  const [xpub, setXpub] = useState('');
  const [xpubXP, setXpubXP] = useState('');
  const [publicKeys, setPublicKeys] = useState<PubKeyType[]>();
  const { isImporting, importLedger } = useImportLedger();
  const [step, setStep] = useState(Step.Import);
  const [hasPublicKeys, setHasPublicKeys] = useState(false);
  const [pathSpec, setPathSpec] = useState<DerivationPath>(
    DerivationPath.BIP44,
  );
  const lastAccountIndexWithBalance = useRef(0);

  const { popDeviceSelection } = useLedgerContext();

  useEffect(() => {
    popDeviceSelection();
    // Do this exactly once, all retries should be initiated by the user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSuccess(data: LedgerConnectorData) {
    setXpub(data.xpub);
    setXpubXP(data.xpubXP);
    setPublicKeys(data.publicKeys);
    setHasPublicKeys(data.hasPublicKeys);
    setPathSpec(data.pathSpec);
    lastAccountIndexWithBalance.current = data.lastAccountIndexWithBalance;
  }

  const LedgerLiveSupportButton = () => (
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
  );

  const handleImport = useCallback(
    async (name?: string) => {
      try {
        capture('LedgerImportStarted');

        await importLedger({
          xpub,
          xpubXP,
          pubKeys: publicKeys,
          name,
          secretType:
            pathSpec === DerivationPath.BIP44
              ? SecretType.Ledger
              : SecretType.LedgerLive,
          numberOfAccountsToCreate: lastAccountIndexWithBalance.current + 1,
        });

        capture('SeedphraseImportSuccess');
        setStep(Step.Completed);
      } catch (err) {
        capture('LedgerImportFailure');
        sentryCaptureException(
          err as Error,
          SentryExceptionTypes.WALLET_IMPORT,
        );
        const { title } = getErrorMessage(err);
        toast.error(title);
      }
    },
    [
      capture,
      getErrorMessage,
      importLedger,
      lastAccountIndexWithBalance,
      pathSpec,
      publicKeys,
      xpub,
      xpubXP,
    ],
  );

  // This will create a fake background that overlay is going to blur for design.
  const BackgroundPlaceholder = () => (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6} sx={{ px: 20 }}>
        <Stack
          sx={{
            height: 724,
            width: 550,
            justifyContent: 'space-between',
            pt: 10,
            pl: 15,
          }}
        >
          <Stack
            sx={{
              pt: 15,
              justifyContent: 'center',
            }}
          >
            <Typography variant="h2">
              {'The best way to connect to crypto'}
            </Typography>
            <Typography variant="h2" sx={{ color: 'secondary.main' }}>
              {'Core Extension'}
            </Typography>
          </Stack>

          <Stack
            sx={{
              p: 10,
              justifyContent: 'center',
            }}
          >
            <Button sx={{ width: 300 }}>{t('Next')}</Button>
          </Stack>
        </Stack>
      </Grid>
      <Grid
        item
        xs={6}
        md={6}
        sx={{
          backgroundColor: 'background.paper',
        }}
      >
        <AppBackground />
      </Grid>
    </Grid>
  );

  return (
    <>
      <BackgroundPlaceholder />
      <Overlay isBackgroundFilled={false}>
        {step === Step.Completed && (
          <Stack
            sx={{
              width: 393,
              height: 386,
              textAlign: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'background.paper',
              borderRadius: 1,
              px: 2,
              py: 4,
            }}
          >
            <Stack
              sx={{
                height: 140,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <CheckIcon size={32} />
              <Typography variant="h3">
                {t('Wallet Added Successfully')}
              </Typography>
            </Stack>

            <Stack
              sx={{
                height: 124,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t(
                  'Please close this tab and open the Core Browser Extension to see the newly imported wallet.',
                )}
              </Typography>
              <Button
                onClick={() => {
                  browser.action.openPopup();
                  window.close();
                }}
                sx={{ width: '50%' }}
              >
                {t('Close')}
              </Button>
            </Stack>
          </Stack>
        )}

        {step === Step.Troubleshoot && (
          <Stack
            sx={{
              height: 724,
              width: 432,
              borderRadius: 1,
              justifyContent: 'space-between',
              backgroundColor: 'background.paper',
            }}
          >
            <Stack justifyContent="space-between" sx={{ height: '100%' }}>
              <Stack alignItems="flex-start" sx={{ mt: 2.5, mb: 0.5 }}>
                <PageTitle onBackClick={() => setStep(Step.Import)}>
                  {t('Trouble Connecting')}
                </PageTitle>
                <Stack sx={{ px: 2 }}>
                  <LedgerTroubleSteps
                    fontVariant={LedgerTroubleStepsFontVariant.large}
                  />
                </Stack>
              </Stack>

              <Stack sx={{ p: 2 }}>
                <Button onClick={() => setStep(Step.Import)}>
                  {t('Back')}
                </Button>
                <LedgerLiveSupportButton />
              </Stack>
            </Stack>
          </Stack>
        )}
        {step === Step.Name && (
          <Stack
            sx={{
              height: 724,
              width: 432,
              borderRadius: 1,
              justifyContent: 'space-between',
              backgroundColor: 'background.paper',
            }}
          >
            <Stack
              justifyContent="space-between"
              sx={{ height: '100%', width: '100%' }}
            >
              <NameYourWallet
                isImporting={isImporting}
                onSave={handleImport}
                onBackClick={() => setStep(Step.Import)}
                backgroundColor={theme.palette.background.default}
              />
            </Stack>
          </Stack>
        )}
        {step === Step.Import && (
          <Stack
            sx={{
              height: 724,
              width: 432,
              borderRadius: 1,
              justifyContent: 'space-between',
              backgroundColor: 'background.paper',
            }}
          >
            <Stack
              justifyContent="space-between"
              sx={{ height: '100%', pt: 1 }}
            >
              <Stack>
                <Stack direction="row" alignItems="flex-start" sx={{ mb: 1 }}>
                  <PageTitle showBackButton={false}>
                    {t('Add Wallet with Ledger')}
                  </PageTitle>
                </Stack>

                <LedgerConnector
                  onSuccess={onSuccess}
                  onTroubleshoot={() => setStep(Step.Troubleshoot)}
                  checkIfWalletExists
                />
              </Stack>
              <Stack sx={{ p: 2, mb: 2, rowGap: 1 }}>
                <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
                  <Stack sx={{ width: '50%' }}>
                    <Tooltip
                      title={t(
                        'Clicking the cancel button will close the tab and open the extension for you. If the extension doesn’t open automatically, please open it manually.',
                      )}
                    >
                      <Button
                        color="secondary"
                        onClick={() => {
                          browser.action.openPopup();
                          window.close();
                        }}
                        fullWidth
                      >
                        {t('Cancel')}
                      </Button>
                    </Tooltip>
                  </Stack>
                  <Button
                    disabled={!hasPublicKeys}
                    onClick={() => setStep(Step.Name)}
                    sx={{ width: '50%' }}
                    fullWidth
                  >
                    {t('Next')}
                  </Button>
                </Stack>
                <LedgerLiveSupportButton />
              </Stack>
            </Stack>
          </Stack>
        )}
      </Overlay>
      <LedgerWrongVersionOverlay />
    </>
  );
}
