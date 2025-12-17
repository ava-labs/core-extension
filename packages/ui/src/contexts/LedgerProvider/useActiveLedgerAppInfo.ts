import { useEffect } from 'react';
import { useLedgerContext } from './LedgerProvider';
import { useWalletContext } from '../WalletProvider';

/**
 * When your component needs to know the active app on the Ledger device, register it as a subscriber.
 * This will cause the active app to be refreshed every 2 seconds.
 */
export const useActiveLedgerAppInfo = () => {
  const {
    appType,
    appVersion,
    appConfig,
    registerSubscriber,
    unregisterSubscriber,
  } = useLedgerContext();
  const { isLedgerWallet } = useWalletContext();

  useEffect(() => {
    if (!isLedgerWallet) {
      return;
    }

    registerSubscriber();

    return unregisterSubscriber;
  }, [isLedgerWallet, registerSubscriber, unregisterSubscriber]);

  return {
    appType,
    appVersion,
    appConfig,
  };
};
