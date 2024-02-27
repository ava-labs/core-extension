import {
  Button,
  ExternalLinkIcon,
  Stack,
  Typography,
  toast,
} from '@avalabs/k2-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useCallback, useState } from 'react';

import { LedgerWrongVersionOverlay } from '../Ledger/LedgerWrongVersionOverlay';
import { PubKeyType } from '@src/background/services/wallet/models';
import { NameYourWallet } from './components/NameYourWallet';
import { DerivationPath } from '@avalabs/wallets-sdk';
import { SecretType } from '@src/background/services/secrets/models';
import { useImportLedger } from './hooks/useImportLedger';
import {
  LedgerConnector,
  LedgerConnectorData,
} from '../../components/ledger/LedgerConnector';
import {
  LedgerTroubleSteps,
  LedgerTroubleStepsFontVariant,
} from '../../components/ledger/LedgerTroublesSteps';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { useErrorMessage } from '@src/hooks/useErrorMessage';

enum Step {
  Import,
  Name,
  Troubleshoot,
}

export function AddWalletWithLedger() {
  const history = useHistory();
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
    DerivationPath.BIP44
  );

  function onSuccess(data: LedgerConnectorData) {
    setXpub(data.xpub);
    setXpubXP(data.xpubXP);
    setPublicKeys(data.publicKeys);
    setHasPublicKeys(data.hasPublicKeys);
    setPathSpec(data.pathSpec);
  }

  const LedgerLiveSupportButton = () => (
    <Button
      variant="text"
      onClick={() => {
        window.open(
          'https://www.ledger.com/ledger-live',
          '_blank',
          'noreferrer'
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

        const result = await importLedger({
          xpub,
          xpubXP,
          pubKeys: publicKeys,
          name,
          secretType:
            pathSpec === DerivationPath.BIP44
              ? SecretType.Ledger
              : SecretType.LedgerLive,
        });

        capture('SeedphraseImportSuccess');

        toast.success(t('{{walletName}} Added', { walletName: result.name }));
        history.replace('/accounts');
      } catch (err) {
        capture('LedgerImportFailure');
        sentryCaptureException(
          err as Error,
          SentryExceptionTypes.WALLET_IMPORT
        );
        const { title } = getErrorMessage(err);
        toast.error(title);
      }
    },
    [
      capture,
      getErrorMessage,
      history,
      importLedger,
      pathSpec,
      publicKeys,
      t,
      xpub,
      xpubXP,
    ]
  );

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      {step === Step.Troubleshoot && (
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
            <Button onClick={() => setStep(Step.Import)}>{t('Back')}</Button>
            <LedgerLiveSupportButton />
          </Stack>
        </Stack>
      )}
      {step === Step.Name && (
        <NameYourWallet
          isImporting={isImporting}
          onSave={handleImport}
          onBackClick={() => setStep(Step.Import)}
        />
      )}
      {step === Step.Import && (
        <Stack justifyContent="space-between" sx={{ height: 600, pt: 1 }}>
          <Stack>
            <Stack direction="row" alignItems="flex-start" sx={{ mb: 1 }}>
              <PageTitle onBackClick={() => history.replace('/accounts')}>
                {t('Add Wallet with Ledger')}
              </PageTitle>
            </Stack>

            <LedgerConnector
              onSuccess={onSuccess}
              onTroubleshoot={() => setStep(Step.Troubleshoot)}
            />
          </Stack>
          <Stack sx={{ p: 2 }}>
            <Button
              disabled={!hasPublicKeys}
              onClick={() => setStep(Step.Name)}
            >
              {t('Next')}
            </Button>
            <LedgerLiveSupportButton />
          </Stack>
        </Stack>
      )}

      <LedgerWrongVersionOverlay onClose={() => history.goBack()} />
    </Stack>
  );
}
