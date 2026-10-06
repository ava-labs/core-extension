import {
  useAnalyticsContext,
  useAccountsContext,
  useSettingsContext,
} from '../contexts';
import { useCallback, useState } from 'react';

type ConsentChangeOrigin = 'settings' | 're-opt-in-dialog';

export const useAnalyticsConsentCallbacks = (origin: ConsentChangeOrigin) => {
  const { setAnalyticsConsent } = useSettingsContext();
  const { capture, isInitialized, initAnalyticsIds, stopDataCollection } =
    useAnalyticsContext();
  const { allAccounts } = useAccountsContext();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const onApproval = useCallback(async () => {
    try {
      setIsApproving(true);
      const addresses = allAccounts.flatMap((acc) => [
        acc.addressC,
        acc.addressBTC,
        acc.addressAVM,
        acc.addressPVM,
        acc.addressCoreEth,
      ]);
      await setAnalyticsConsent(true);

      // Do not override existing analytics IDs
      if (!isInitialized) {
        await initAnalyticsIds(true);
      }

      capture(
        'AnalyticsEnabled',
        {
          origin,
          addresses,
        },
        true,
      );
    } finally {
      setIsApproving(false);
    }
  }, [
    allAccounts,
    capture,
    initAnalyticsIds,
    isInitialized,
    origin,
    setAnalyticsConsent,
  ]);

  const onRejection = useCallback(async () => {
    try {
      setIsRejecting(true);
      await capture('AnalyticsDisabled', { origin }); // Will only be reported if analytics was previously enabled.
      await setAnalyticsConsent(false);
      await stopDataCollection();
    } finally {
      setIsRejecting(false);
    }
  }, [capture, origin, setAnalyticsConsent, stopDataCollection]);

  return {
    isApproving,
    isRejecting,
    onApproval,
    onRejection,
  };
};
