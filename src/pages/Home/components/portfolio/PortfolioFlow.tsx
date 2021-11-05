import React from 'react';
import { LoadingIcon } from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { PortfolioMiniMode } from './Portfolio.minimode';
import { Portfolio } from './Portfolio';

export function PortfolioFlow() {
  const { balances, avaxPrice } = useWalletContext();
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);

  if (!balances || !avaxPrice) {
    return <LoadingIcon />;
  }

  return isMiniMode ? <PortfolioMiniMode /> : <Portfolio />;
}
