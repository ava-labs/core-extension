import React from 'react';
import { LoadingSpinnerIcon, VerticalFlex } from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { PortfolioMiniMode } from './Portfolio.minimode';
import { Portfolio } from './Portfolio';
import { useTheme } from 'styled-components';

export function PortfolioFlow() {
  const { balances, avaxPrice, isBalanceLoading, isWalletReady } =
    useWalletContext();
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const theme = useTheme();

  if (!balances || !avaxPrice || isBalanceLoading || !isWalletReady) {
    return (
      <VerticalFlex justify="center" height="100%">
        <LoadingSpinnerIcon color={theme.colors.primary1} />
      </VerticalFlex>
    );
  }

  return isMiniMode ? <PortfolioMiniMode /> : <Portfolio />;
}
