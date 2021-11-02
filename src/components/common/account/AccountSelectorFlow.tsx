import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import React from 'react';
import { AccountSelector } from './AccountSelector';
import { AccountSelectorMiniMode } from './AccountSelector.minimode';

export function AccountSelectorFlow() {
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  return isMiniMode ? <AccountSelectorMiniMode /> : <AccountSelector />;
}
