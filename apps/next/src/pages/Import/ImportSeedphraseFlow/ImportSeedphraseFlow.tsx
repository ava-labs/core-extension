import {
  getAddressFromXPub,
  getXpubFromMnemonic,
} from '@avalabs/core-wallets-sdk';
import { toast } from '@avalabs/k2-alpine';
import { useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import {
  useErrorMessage,
  useImportSeedphrase,
  useAnalyticsContext,
} from '@core/ui';

import { useOpenApp } from '@/hooks/useOpenApp';
import { FullscreenModal } from '@/components/FullscreenModal';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';
import {
  ConfirmAddressesScreen,
  NameYourWalletScreen,
} from '../common-screens';
import { EnterRecoveryPhraseScreen } from './screens';

const EMPTY_ADDRESSES = Array(3).fill('');
const TOTAL_STEPS = 3;

export const ImportSeedphraseFlow = () => {
  const history = useHistory();
  const gerErrorMessage = useErrorMessage();
  const { importSeedphrase, isImporting } = useImportSeedphrase();
  const { capture } = useAnalyticsContext();
  const openApp = useOpenApp();

  const [phrase, setPhrase] = useState<string>('');
  const [isCalculatingAddresses, setIsCalculatingAddresses] = useState(false);
  const [addresses, setAddresses] = useState<string[]>(EMPTY_ADDRESSES);

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

  const onSave = useCallback(
    async (name: string) => {
      try {
        await importSeedphrase({
          mnemonic: phrase,
          name,
        });
        capture('SeedphraseImportSuccess');
        openApp();
        window.close();
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
    [importSeedphrase, phrase, gerErrorMessage, openApp, capture],
  );

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
        <Switch>
          <Route exact path="/import-wallet/seedphrase">
            <EnterRecoveryPhraseScreen
              step={1}
              totalSteps={TOTAL_STEPS}
              onNext={onPhraseEntered}
              isCalculating={isCalculatingAddresses}
            />
          </Route>
          <Route path="/import-wallet/seedphrase/confirm">
            <ConfirmAddressesScreen
              step={2}
              totalSteps={TOTAL_STEPS}
              addresses={addresses}
              chainCaipId="eip155:43114" // Avalanche C-Chain
              isImporting={isImporting}
              onNext={onConfirm}
            />
          </Route>
          <Route path="/import-wallet/seedphrase/name">
            <NameYourWalletScreen
              step={3}
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
