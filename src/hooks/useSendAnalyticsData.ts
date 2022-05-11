import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function useSendAnalyticsData() {
  const { capture } = useAnalyticsContext();
  const sendTokenSelectedAnalytics = (token: string) => {
    capture('_TokenSelected', {
      selectedToken: token,
    });
  };
  const sendAmountEnteredAnalytics = (amount: string) => {
    capture('_AmountEntered', {
      amount,
    });
  };
  return {
    sendTokenSelectedAnalytics,
    sendAmountEnteredAnalytics,
  };
}
