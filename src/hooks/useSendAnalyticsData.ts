import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useCallback } from 'react';

export function useSendAnalyticsData() {
  const { capture } = useAnalyticsContext();
  const sendTokenSelectedAnalytics = useCallback(
    (token: string) => {
      capture('_TokenSelected', {
        selectedToken: token,
      });
    },
    [capture]
  );
  const sendAmountEnteredAnalytics = useCallback(
    (amount: string) => {
      capture('_AmountEntered', {
        amount,
      });
    },
    [capture]
  );
  return {
    sendTokenSelectedAnalytics,
    sendAmountEnteredAnalytics,
  };
}
