import { FC } from 'react';

import { LoadingScreen } from '@/components/LoadingScreen';

import { StateComponentProps } from '../types';

export const Loading: FC<StateComponentProps> = ({ state }) => {
  if (state.state !== 'loading') {
    return null;
  }

  return <LoadingScreen />;
};
