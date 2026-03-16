import { useMutation } from '@tanstack/react-query';

import { useTransferTrackingContext } from '@core/ui';

export function useClearTransferHistory() {
  const { clearHistoricalTransfers } = useTransferTrackingContext();

  return useMutation({
    mutationFn: async () => {
      await clearHistoricalTransfers();
    },
  });
}
