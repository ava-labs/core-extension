import { useEffect } from 'react';
import { useLedgerContext } from './LedgerProvider';

const DEFAULT_REFRESH_INTERVAL = 2_000;

export const useActiveLedgerAppInfo = () => {
  const { refreshActiveApp, appType, appVersion, appConfig } =
    useLedgerContext();

  // Refresh active app every 2 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const scheduleRefresh = () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        await refreshActiveApp();
        scheduleRefresh();
      }, DEFAULT_REFRESH_INTERVAL);
    };

    scheduleRefresh();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [refreshActiveApp]);

  return {
    appType,
    appVersion,
    appConfig,
  };
};
