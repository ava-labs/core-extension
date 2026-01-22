import { useEffect } from 'react';
import { useWalletContext } from '../WalletProvider';
import { useLedgerContext } from './LedgerProvider';

/**
 * When your component needs to know the active app on the Ledger device, register it as a subscriber.
 * This will cause the active app to be refreshed every 2 seconds.
 *
 * @param {boolean} force - If true, the active app will be refreshed even if we're not in the context of a Ledger wallet. Useful for wallet import flows.
 */
export const useActiveLedgerAppInfo = (force: boolean = false) => {
  const {
    appType,
    appVersion,
    appConfig,
    registerSubscriber,
    unregisterSubscriber,
  } = useLedgerContext();
  const { isLedgerWallet } = useWalletContext();

  useEffect(() => {
    if (!isLedgerWallet && !force) {
      return;
    }

    registerSubscriber();

    return unregisterSubscriber;
  }, [isLedgerWallet, registerSubscriber, unregisterSubscriber, force]);

  return {
    appType,
    appVersion,
    appConfig,
  };
};
