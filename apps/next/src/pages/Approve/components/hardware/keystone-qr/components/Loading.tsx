import { FC } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';

import { StateComponentProps } from '../types';

export const Loading: FC<StateComponentProps> = ({ state }) => {
  if (state.phase !== 'waiting-for-tx-code') {
    return null;
  }

  return <LoadingScreen />;
};
