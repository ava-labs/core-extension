import { LoadingScreen } from '@/components/LoadingScreen';
import { FC } from 'react';
import { StateComponentProps } from '../types';

export const Loading: FC<StateComponentProps> = ({ state }) => {
  if (state !== 'loading') {
    return null;
  }

  return <LoadingScreen />;
};
