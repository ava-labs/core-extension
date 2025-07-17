import { toast } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';

import { useAnalyticsContext, useImportLedger } from '@core/ui';
import { AddressPublicKeyJson, ExtendedPublicKey } from '@core/types';

import {
  FullscreenModal,
  useModalPageControl,
} from '@/components/FullscreenModal';
import {
  ConnectAvalanche,
  ConnectSolana,
  PromptSolana,
  Troubleshooting,
  WalletExistsError,
} from '@/components/ConnectLedger';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';

import { NameYourWalletScreen } from '../common-screens';
import { action } from 'webextension-polyfill';

type ImportPhase = 'connect-avax' | 'prompt-solana' | 'connect-solana' | 'name';

type ImportRoute =
  | ImportPhase
  | 'troubleshooting-avalanche'
  | 'troubleshooting-solana';

const CONNECT_AVAX_PATHS = [
  '/import-wallet/ledger',
  '/import-wallet/ledger/connect-avax',
] as const;

export const ImportLedgerFlow = () => {
  const history = useHistory();

  return (
    <>
      <FullscreenAnimatedBackground sx={{ backgroundSize: '80% 60%' }} />
      <FullscreenModal
        open
        withCoreLogo
        withAppInfo
        withLanguageSelector
        onBack={history.goBack}
      >
        <Flow />
      </FullscreenModal>
    </>
  );
};

const PHASE_TO_STEP_NUMBER: Record<ImportPhase, number> = {
  'connect-avax': 1,
  'prompt-solana': 2,
  'connect-solana': 3,
  name: 4,
} as const;

const TOTAL_STEPS = Object.keys(PHASE_TO_STEP_NUMBER).length;

const Flow = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { setCurrent, setTotal } = useModalPageControl();
  const { phase = 'connect-avax' } = useParams<{ phase: ImportRoute }>();
  const { importLedger, isImporting } = useImportLedger();

  const [publicKeys, setPublicKeys] = useState<AddressPublicKeyJson[]>([]);
  const [extPublicKeys, setExtPublicKeys] = useState<ExtendedPublicKey[]>([]);

  useEffect(() => {
    const step = PHASE_TO_STEP_NUMBER[phase];

    if (step) {
      setCurrent(step);
      setTotal(TOTAL_STEPS);
    } else {
      // If we're on troubleshooting screens, hide the page indicator
      setTotal(0);
    }
  }, [phase, setCurrent, setTotal]);

  const avalancheConnectorCallbacks = useMemo(
    () => ({
      onConnectionSuccess: () => capture('WalletImport_Ledger_Connected'),
      onConnectionFailed: (err: Error) =>
        err instanceof WalletExistsError
          ? capture('WalletImport_Ledger_DuplicateWallet')
          : capture('WalletImport_Ledger_ConnectionFailed'),
      onConnectionRetry: () => capture('WalletImport_Ledger_Retry'),
    }),
    [capture],
  );

  const solanaConnectorCallbacks = useMemo(
    () => ({
      onConnectionSuccess: () =>
        capture('WalletImport_Ledger_SolanaKeysDerived'),
      onConnectionFailed: () => capture('WalletImport_Ledger_SolanaKeysFailed'),
      onConnectionRetry: () => capture('WalletImport_Ledger_SolanaKeysRetry'),
    }),
    [capture],
  );

  const onSave = useCallback(
    async (name: string) => {
      try {
        await importLedger({
          name,
          addressPublicKeys: publicKeys,
          extendedPublicKeys: extPublicKeys,
        });
        await action.openPopup();
        window.close();
      } catch (err) {
        toast.error(t('Unknown error has occurred. Please try again later.'));
        console.error(err);
      }
    },
    [extPublicKeys, importLedger, publicKeys, t],
  );

  return (
    <Switch>
      <Route exact path={CONNECT_AVAX_PATHS}>
        <ConnectAvalanche
          connectorCallbacks={avalancheConnectorCallbacks}
          onNext={({ addressPublicKeys, extendedPublicKeys }) => {
            setPublicKeys(addressPublicKeys.map(({ key }) => key));
            setExtPublicKeys(extendedPublicKeys ?? []);
            history.push('/import-wallet/ledger/prompt-solana');
          }}
          onTroubleshoot={() => {
            capture('WalletImport_Ledger_TroubleshootingAvalanche');
            history.push('/import-wallet/ledger/troubleshooting-avalanche');
          }}
        />
      </Route>
      <Route path="/import-wallet/ledger/prompt-solana">
        <PromptSolana
          onNext={() => {
            capture('WalletImport_Ledger_SolanaSupportConfirmed');
            history.push('/import-wallet/ledger/connect-solana');
          }}
          onSkip={() => {
            capture('WalletImport_Ledger_SolanaSupportDenied');
            history.push('/import-wallet/ledger/name');
          }}
        />
      </Route>
      <Route path="/import-wallet/ledger/connect-solana">
        <ConnectSolana
          connectorCallbacks={solanaConnectorCallbacks}
          onNext={({ addressPublicKeys }) => {
            setPublicKeys((prev) => [
              ...prev,
              ...addressPublicKeys.map(({ key }) => key),
            ]);
            history.push('/import-wallet/ledger/name');
          }}
          onTroubleshoot={() => {
            capture('WalletImport_Ledger_TroubleshootingSolana');
            history.push('/import-wallet/ledger/troubleshooting-solana');
          }}
        />
      </Route>
      <Route path="/import-wallet/ledger/troubleshooting-avalanche">
        <Troubleshooting
          appName="Avalanche"
          onClose={() => {
            capture('WalletImport_Ledger_TroubleshootingAvalancheClosed');
            history.push('/import-wallet/ledger/connect-avax');
          }}
        />
      </Route>
      <Route path="/import-wallet/ledger/troubleshooting-solana">
        <Troubleshooting
          appName="Solana"
          onClose={() => {
            capture('WalletImport_Ledger_TroubleshootingSolanaClosed');
            history.push('/import-wallet/ledger/connect-solana');
          }}
        />
      </Route>
      <Route path="/import-wallet/ledger/name">
        <NameYourWalletScreen
          step={PHASE_TO_STEP_NUMBER['name']}
          totalSteps={TOTAL_STEPS}
          isSaving={isImporting}
          onNext={onSave}
        />
      </Route>
    </Switch>
  );
};
