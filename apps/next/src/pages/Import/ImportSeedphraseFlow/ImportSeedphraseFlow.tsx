import {
  getAddressFromXPub,
  getXpubFromMnemonic,
} from '@avalabs/core-wallets-sdk';
import { action } from 'webextension-polyfill';
import { useCallback, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { useImportSeedphrase } from '@core/ui';

import { FullscreenModal } from '@/components/FullscreenModal';
import {
  ConfirmAddressesScreen,
  NameYourWalletScreen,
} from '../common-screens';
import { EnterRecoveryPhraseScreen } from './screens';

const EMPTY_ADDRESSES = Array(3).fill('');

export const ImportSeedphraseFlow = () => {
  const history = useHistory();
  const [phrase, setPhrase] = useState<string>('');
  const [isCalculatingAddresses, setIsCalculatingAddresses] = useState(false);

  const { importSeedphrase, isImporting } = useImportSeedphrase();

  const onPhraseEntered = useCallback(
    async (seedphrase: string) => {
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
        console.error('Failed to derive addresses', error);
        throw error;
      } finally {
        setIsCalculatingAddresses(false);
      }
    },
    [history],
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

        await action.openPopup();
        window.close();
      } catch (error) {
        console.error('Failed to import seedphrase', error);
        throw error;
      }
    },
    [importSeedphrase, phrase],
  );

  const [addresses, setAddresses] = useState<string[]>(EMPTY_ADDRESSES);

  return (
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
            totalSteps={3}
            onNext={onPhraseEntered}
            isCalculating={isCalculatingAddresses}
          />
        </Route>
        <Route path="/import-wallet/seedphrase/confirm">
          <ConfirmAddressesScreen
            step={2}
            totalSteps={3}
            addresses={addresses}
            chainCaipId="eip155:43114" // Avalanche C-Chain
            isImporting={isImporting}
            onNext={onConfirm}
          />
        </Route>
        <Route path="/import-wallet/seedphrase/name">
          <NameYourWalletScreen
            step={3}
            totalSteps={3}
            isSaving={isImporting}
            onNext={onSave}
          />
        </Route>
      </Switch>
    </FullscreenModal>
  );
};
