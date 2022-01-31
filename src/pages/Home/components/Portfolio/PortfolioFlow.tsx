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
  const { isBalanceLoading, isWalletReady } = useWalletContext();
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const theme = useTheme();

  if (isBalanceLoading || !isWalletReady) {
    return (
      <VerticalFlex justify="center" height="100%">
        <LoadingSpinnerIcon color={theme.colors.primary1} />
      </VerticalFlex>
    );
  }

  return isMiniMode ? <PortfolioMiniMode /> : <Portfolio />;
}
