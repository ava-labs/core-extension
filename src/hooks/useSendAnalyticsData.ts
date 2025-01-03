import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useCallback } from 'react';

export function useSendAnalyticsData() {
  const { capture } = useAnalyticsContext();
  const sendTokenSelectedAnalytics = useCallback(
    (functionality: string) => {
      capture(`${functionality}_TokenSelected`);
    },
    [capture],
  );
  const sendAmountEnteredAnalytics = useCallback(
    (functionality: string) => {
      capture(`${functionality}_AmountEntered`);
    },
    [capture],
  );

  return {
    sendTokenSelectedAnalytics,
    sendAmountEnteredAnalytics,
  };
}
