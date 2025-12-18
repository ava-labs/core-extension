import {
  getAddressFromXPub,
  getXpubFromMnemonic,
} from '@avalabs/core-wallets-sdk';
import { toast } from '@avalabs/k2-alpine';
import { useCallback, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';

import {
  useAnalyticsContext,
  useErrorMessage,
  useImportSeedphrase,
} from '@core/ui';

import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';
import { FullscreenModal } from '@/components/FullscreenModal';
import { ACCOUNT_MANAGEMENT_QUERY_TOKENS } from '@/config/routes';
import { useOpenApp } from '@/hooks/useOpenApp';
import {
  ConfirmAddressesScreen,
  NameYourWalletScreen,
} from '../common-screens';
import { EnterRecoveryPhraseScreen } from './screens';

const EMPTY_ADDRESSES = Array(3).fill('');
const TOTAL_STEPS = 3;

const getCurrentStep = (pathname: string) => {
  switch (pathname) {
    case '/import-wallet/seedphrase':
      return 1;
    case '/import-wallet/seedphrase/confirm':
      return 2;
    case '/import-wallet/seedphrase/name':
      return 3;
    default:
      return 1;
  }
};

export const ImportSeedphraseFlow = () => {
  const history = useHistory();
  const location = useLocation();
  const gerErrorMessage = useErrorMessage();
  const { importSeedphrase, isImporting } = useImportSeedphrase();
  const { capture } = useAnalyticsContext();
  const openApp = useOpenApp();

  const [phrase, setPhrase] = useState<string>('');
  const [isCalculatingAddresses, setIsCalculatingAddresses] = useState(false);
  const [addresses, setAddresses] = useState<string[]>(EMPTY_ADDRESSES);

  const currentStep = getCurrentStep(location.pathname);

  const onPhraseEntered = useCallback(
    async (seedphrase: string) => {
      capture('SeedphraseImportStarted');
      setPhrase(seedphrase);
      setIsCalculatingAddresses(true);

      try {
        const xpub = await getXpubFromMnemonic(
          seedphrase.trim().split(/\s+/g).join(' ').toLowerCase(),
        );

        setAddresses([
          getAddressFromXPub(xpub, 0),
          getAddressFromXPub(xpub, 1),
          getAddressFromXPub(xpub, 2),
        ]);

        history.push('/import-wallet/seedphrase/confirm');
      } catch (error) {
        capture('SeedphraseImportFailure');
        const { title, hint } = gerErrorMessage(error);
        toast.error(title, {
          description: hint,
        });
        console.error('Failed to derive addresses', error);
        throw error;
      } finally {
        setIsCalculatingAddresses(false);
      }
    },
    [history, gerErrorMessage, capture],
  );

  const onConfirm = useCallback(async () => {
    history.push('/import-wallet/seedphrase/name');
  }, [history]);

  const onCancel = useCallback(async () => {
    await openApp({
      closeWindow: true,
      navigateTo: {
        pathname: '/wallets/import',
      },
    });
  }, [openApp]);

  const onSave = useCallback(
    async (name: string) => {
      try {
        await importSeedphrase({
          mnemonic: phrase,
          name,
        });
        capture('SeedphraseImportSuccess');
        await openApp({
          closeWindow: true,
          navigateTo: {
            pathname: '/account-management',
            search: `${ACCOUNT_MANAGEMENT_QUERY_TOKENS.showImportSuccess}=true`,
          },
        });
      } catch (error) {
        capture('SeedphraseImportFailure');
        const { title, hint } = gerErrorMessage(error);
        toast.error(title, {
          description: hint,
        });
        console.error('Failed to import seedphrase', error);
        throw error;
      }
    },
    [importSeedphrase, phrase, capture, openApp, gerErrorMessage],
  );

  return (
    <>
      <FullscreenAnimatedBackground sx={{ backgroundSize: '80% 60%' }} />
      <FullscreenModal
        open
        withCoreLogo
        withAppInfo
        withLanguageSelector
        onBack={currentStep > 1 ? history.goBack : onCancel}
      >
        <Switch>
          <Route exact path="/import-wallet/seedphrase">
            <EnterRecoveryPhraseScreen
              step={currentStep}
              totalSteps={TOTAL_STEPS}
              onNext={onPhraseEntered}
              isCalculating={isCalculatingAddresses}
            />
          </Route>
          <Route path="/import-wallet/seedphrase/confirm">
            <ConfirmAddressesScreen
              step={currentStep}
              totalSteps={TOTAL_STEPS}
              addresses={addresses}
              chainCaipId="eip155:43114" // Avalanche C-Chain
              isImporting={isImporting}
              onNext={onConfirm}
            />
          </Route>
          <Route path="/import-wallet/seedphrase/name">
            <NameYourWalletScreen
              step={currentStep}
              totalSteps={TOTAL_STEPS}
              isSaving={isImporting}
              onNext={onSave}
            />
          </Route>
        </Switch>
      </FullscreenModal>
    </>
  );
};
