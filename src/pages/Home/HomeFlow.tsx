import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import React from 'react';
import { Home } from './Home';
import { HomeMiniMode } from './Home.minimode';

export function HomeFlow() {
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  return isMiniMode ? <HomeMiniMode /> : <Home />;
}
