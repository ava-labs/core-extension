import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import React from 'react';
import Header from './Header';
import HeaderMiniMode from './Header.minimode';

export interface HeaderProps {
  onDrawerStateChanged?: (open: boolean) => void;
}

export function HeaderFlow(props: HeaderProps) {
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  return isMiniMode ? <HeaderMiniMode /> : <Header {...props} />;
}
