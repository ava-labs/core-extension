import { Stack } from '@avalabs/k2-alpine';

import { LoadingScreen } from '@/components/LoadingScreen';

import {
  SwapErrorMessage,
  SwapPair,
  SwapSettings,
  SwapAccountSelect,
  SwapErrorScreen,
} from './components';
import { useFusionState } from './contexts/FusionStateContext';

export const SwapContent = () => {
  const { status } = useFusionState();

  switch (status) {
    case 'loading':
      return <LoadingScreen height="100%" />;
    case 'initialization-failed':
    case 'no-routes-found':
    case 'no-swappable-assets':
      return <SwapErrorScreen reason={status} />;
    default:
      return (
        <Stack width="100%" flexGrow={1} gap={0.5}>
          <Stack gap={1}>
            <SwapAccountSelect />
            <SwapPair />
          </Stack>
          <SwapErrorMessage />
          <SwapSettings />
        </Stack>
      );
  }
};
