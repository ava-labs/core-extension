import {
  Button,
  CheckIcon,
  Stack,
  StackProps,
  Tooltip,
  Typography,
  toast,
  useTheme,
} from '@avalabs/core-k2-components';
import { PageTitle } from '@/components/common/PageTitle';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { LedgerWrongVersionOverlay } from '../Ledger/LedgerWrongVersionOverlay';
import { PubKeyType, SecretType } from '@core/types';
import { NameYourWallet } from './components/NameYourWallet';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { useImportLedger, useQueryParams } from '@core/ui';
import {
  LedgerConnector,
  LedgerConnectorData,
} from '../../components/ledger/LedgerConnector';
import {
  LedgerTroubleSteps,
  LedgerTroubleStepsFontVariant,
} from '../../components/ledger/LedgerTroublesSteps';
import { useAnalyticsContext } from '@core/ui';
import { Monitoring } from '@core/common';
import { useErrorMessage } from '@core/ui';
import { useLedgerContext } from '@core/ui';
import { Overlay } from '@/components/common/Overlay';
import browser from 'webextension-polyfill';
import { FakeOnboardingBackground } from '@/components/common/FakeOnboardingBackground';
import { LedgerLiveSupportButton } from '@/components/ledger/LedgerLiveSupportButton';
import { SolanaPublicKey } from '../Ledger/models';
import { LedgerConnectorSolana } from '@/components/ledger/LedgerConnectorSolana';
import { useFeatureFlagContext } from '@core/ui';
import { FeatureGates } from '@core/types';
import { MagicSolanaLogo } from '@/components/common/MagicSolanaLogo';

enum Step {
  Import,
  Name,
  Troubleshoot,
  Completed,
  AskAboutSolana,
  DeriveSolana,
}

export function AddWalletWithLedger() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { isFlagEnabled } = useFeatureFlagContext();
  const getErrorMessage = useErrorMessage();

  const [xpub, setXpub] = useState('');
  const [xpubXP, setXpubXP] = useState('');
  const [publicKeys, setPublicKeys] = useState<PubKeyType[]>();
  const { isImporting, importLedger } = useImportLedger();
  const [step, setStep] = useState(Step.Import);
  const [hasPublicKeys, setHasPublicKeys] = useState(false);

  const params = useQueryParams();
  console.log('params: ', params);
  const walletId = params.get('walletId') || undefined;
  console.log('walletId: ', walletId);
  const derivationPath = params.get('derivationPath') as DerivationPath;
  console.log('derivationPath: ', derivationPath);

  const [pathSpec, setPathSpec] = useState<DerivationPath>(
    DerivationPath.LedgerLive,
  );

  const lastAccountIndexWithBalance = useRef(0);
  const [solanaKeys, setSolanaKeys] = useState<SolanaPublicKey[]>([]);

  const withSolana = useMemo(
    () => isFlagEnabled(FeatureGates.SOLANA_SUPPORT),
    [isFlagEnabled],
  );
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

  const handleImport = useCallback(
    async (name?: string) => {
      try {
        capture('LedgerImportStarted');

        const mergedKeys =
          publicKeys && publicKeys.length > 0
            ? publicKeys.map((key, index) => ({
                ...key,
                svm:
                  solanaKeys.find((solanaKey) => solanaKey.index === index)
                    ?.key ?? '',
              }))
            : solanaKeys.map(({ key }) => ({ evm: '', svm: key }));

        await importLedger({
          xpub,
          xpubXP,
          pubKeys: mergedKeys,
          name,
          secretType:
            pathSpec === DerivationPath.BIP44
              ? SecretType.Ledger
              : SecretType.LedgerLive,
          numberOfAccountsToCreate: lastAccountIndexWithBalance.current + 1,
        });

        capture('LedgerImportSuccess');
        setStep(Step.Completed);
      } catch (err) {
        capture('LedgerImportFailure');
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.WALLET_IMPORT,
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
      solanaKeys,
    ],
  );

  return (
    <>
      <FakeOnboardingBackground />
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
          <Container>
            <Stack justifyContent="space-between" sx={{ height: '100%' }}>
              <Stack alignItems="flex-start" sx={{ mt: 2.5, mb: 0.5 }}>
                <PageTitle onBackClick={() => setStep(Step.Import)}>
                  {t('Trouble Connecting')}
                </PageTitle>
                <Stack sx={{ px: 2 }}>
                  <LedgerTroubleSteps
                    appName={t('Avalanche App')}
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
          </Container>
        )}
        {step === Step.Name && (
          <Container>
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
          </Container>
        )}
        {step === Step.Import && (
          <Container>
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
                  addedDerivationPath={derivationPath}
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
                    onClick={() =>
                      withSolana
                        ? setStep(Step.AskAboutSolana)
                        : setStep(Step.Name)
                    }
                    sx={{ width: '50%' }}
                    fullWidth
                  >
                    {t('Next')}
                  </Button>
                </Stack>
                <LedgerLiveSupportButton />
              </Stack>
            </Stack>
          </Container>
        )}
        {step === Step.AskAboutSolana && (
          <Container>
            <Stack
              justifyContent="space-between"
              sx={{ height: '100%', pt: 1 }}
            >
              <Stack sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="flex-start" sx={{ mb: 1 }}>
                  <PageTitle showBackButton={false}>
                    {t('Add Solana to Your Wallet?')}
                  </PageTitle>
                </Stack>
                <Stack sx={{ flexGrow: 1, pt: 1, px: 6, textAlign: 'center' }}>
                  <Typography variant="body2">
                    {t(
                      'To use Solana in Core you will need to add an account from your Ledger device. You can always add this later at any time.',
                    )}
                  </Typography>
                </Stack>
                <Stack sx={{ flexGrow: 1, justifyContent: 'center' }}>
                  <MagicSolanaLogo outerSize={340} innerSize={187} />
                </Stack>
              </Stack>
              <Stack sx={{ p: 2, mb: 2, rowGap: 1 }}>
                <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
                  <Stack sx={{ width: '50%' }}>
                    <Button
                      color="secondary"
                      onClick={() => setStep(Step.Name)}
                      fullWidth
                    >
                      {t('Skip')}
                    </Button>
                  </Stack>
                  <Button
                    disabled={!hasPublicKeys}
                    onClick={() => setStep(Step.DeriveSolana)}
                    sx={{ width: '50%' }}
                    fullWidth
                  >
                    {t('Add')}
                  </Button>
                </Stack>
                <LedgerLiveSupportButton />
              </Stack>
            </Stack>
          </Container>
        )}
        {step === Step.DeriveSolana && (
          <Container>
            <Stack
              justifyContent="space-between"
              sx={{ height: '100%', pt: 1 }}
            >
              <Stack sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="flex-start" sx={{ mb: 1 }}>
                  <PageTitle showBackButton={false}>
                    {t('Connect your Ledger')}
                  </PageTitle>
                </Stack>
                <Stack sx={{ pt: 1, px: 6, textAlign: 'center' }}>
                  <Typography variant="body2">
                    {t('Open the Solana app on your Ledger device.')}
                  </Typography>
                </Stack>
                <LedgerConnectorSolana
                  numberOfKeys={lastAccountIndexWithBalance.current + 1}
                  onSuccess={(solanaRetrievedKeys) => {
                    setSolanaKeys(solanaRetrievedKeys);
                    capture('LedgerImportSolanaKeysSuccess');
                  }}
                  onFailure={() => {
                    capture('LedgerImportSolanaKeysFailure');
                  }}
                  onTroubleshoot={() => setStep(Step.Troubleshoot)}
                />
              </Stack>
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
                  disabled={
                    solanaKeys.length !==
                    lastAccountIndexWithBalance.current + 1
                  }
                  onClick={() => setStep(Step.Name)}
                  sx={{ width: '50%' }}
                  fullWidth
                >
                  {t('Next')}
                </Button>
              </Stack>
              <LedgerLiveSupportButton />
            </Stack>
          </Container>
        )}
      </Overlay>
      <LedgerWrongVersionOverlay />
    </>
  );
}

const Container = ({ sx, ...props }: StackProps) => (
  <Stack
    sx={{
      height: 724,
      width: 432,
      borderRadius: 1,
      justifyContent: 'space-between',
      backgroundColor: 'background.paper',
      ...sx,
    }}
    {...props}
  />
);
