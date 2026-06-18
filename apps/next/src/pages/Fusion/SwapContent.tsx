import { Collapse, Stack } from '@avalabs/k2-alpine';

import { LoadingScreen } from '@/components/LoadingScreen';

import {
  SwapPair,
  SwapSettings,
  SwapAccountSelect,
  SwapErrorScreen,
} from './components';
import { useFusionState } from './contexts/FusionStateContext';
import { SwapPartnerFee } from './components/SwapPartnerFee';
import { SwapHelperText } from './components/SwapHelperText';
import {
  RecurringSwapsEntryCard,
  RecurringSwapToggleCard,
} from './components/RecurringSwap';
import { useIsRecurringSwapsEnabled, useRecurringSwapOrders } from './hooks';

export const SwapContent = () => {
  const { status } = useFusionState();
  const isRecurringSwapsEnabled = useIsRecurringSwapsEnabled();
  const { scheduledCount } = useRecurringSwapOrders();
  const hasScheduledSwaps = scheduledCount > 0;

  switch (status) {
    case 'loading':
      return <LoadingScreen height="100%" width="100%" />;
    case 'initialization-failed':
    case 'no-routes-found':
    case 'no-swappable-assets':
      return <SwapErrorScreen reason={status} />;
    default:
      return (
        <Stack width="100%" flexGrow={1} gap={0.5}>
          <Stack gap={1} mb={1}>
            <SwapAccountSelect />
            <Collapse in={isRecurringSwapsEnabled && hasScheduledSwaps}>
              <RecurringSwapsEntryCard
                scheduledCount={scheduledCount}
                action="manage"
              />
            </Collapse>
            <SwapPair />
            <SwapHelperText />
            {isRecurringSwapsEnabled && <RecurringSwapToggleCard />}
          </Stack>
          <SwapSettings />
          <SwapPartnerFee />
        </Stack>
      );
  }
};
