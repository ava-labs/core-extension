import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import React from 'react';
import { Send } from './Send';
import { SendMiniMode } from './Send.minimode';

export function SendFlow() {
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  return isMiniMode ? <SendMiniMode /> : <Send />;
}
