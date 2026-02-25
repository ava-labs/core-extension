import React from 'react';
import { Stack } from '@avalabs/k2-alpine';

import { SwapStatus } from '../../types';
import { SwapAccountSelect } from '../SwapAccountSelect';

import { NoSwappableAssets, InitializationFailed } from './components';

type Reason = Extract<
  SwapStatus,
  'no-swappable-assets' | 'initialization-failed' | 'no-routes-found'
>;

type Props = {
  reason: Reason;
};

const ErrorMessageByReason: Record<Props['reason'], React.FC> = {
  'no-routes-found': NoSwappableAssets,
  'no-swappable-assets': NoSwappableAssets,
  'initialization-failed': InitializationFailed,
};

export const SwapErrorScreen = ({ reason }: Props) => {
  const ErrorMessage = ErrorMessageByReason[reason];

  const withAccountSelect = reason !== 'initialization-failed';

  return (
    <Stack width="100%" height="100%" gap={1}>
      {withAccountSelect && <SwapAccountSelect />}

      <Stack flexGrow={1} justifyContent="center">
        <ErrorMessage />
      </Stack>
    </Stack>
  );
};
