import { useEffect } from 'react';
import { useLedgerContext } from './LedgerProvider';

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

  useEffect(() => {
    registerSubscriber();

    return unregisterSubscriber;
  }, [registerSubscriber, unregisterSubscriber]);

  return {
    appType,
    appVersion,
    appConfig,
  };
};
