import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { Route, Switch, useLocation } from 'react-router-dom';
import { AddCustomToken } from './components/AddCustomToken/AddCustomToken';
import { ManageTokens } from './components/ManageTokens';
import { PortfolioHome } from './components/PortfolioHome';
import { WalletView } from './components/WalletView/WalletView';
import { TokenDetails } from './components/PortfolioHome/components/PortolioDetails/components/TokenDetails';
import { Header } from '@/components/Header';
import { NoScrollStack } from '@/components/NoScrollStack';
import { HEADER_HEIGHT } from '@/config';
import { useIsIntersecting } from '@/hooks/useIsIntersecting';

export const Portfolio: FC = () => {
  const { pathname } = useLocation();
  const displayHeader =
    pathname === '/' ||
    pathname === '/home' ||
    pathname === '/portfolio' ||
    pathname.startsWith('/wallet');

  const { isIntersecting, ref, isObserving } = useIsIntersecting();

  const withConciergePrompt = displayHeader && isObserving && isIntersecting;

  return (
    <NoScrollStack scrollTrackTopMargin={displayHeader ? HEADER_HEIGHT : 0}>
      <div ref={ref} />
      {displayHeader && (
        <Stack
          width={1}
          position="sticky"
          top={0}
          zIndex={10}
          id="header-container"
        >
          <Header withConciergePrompt={withConciergePrompt} />
        </Stack>
      )}
      <Stack flexGrow={1} data-scroll-container>
        <Switch>
          <Route path="/manage-tokens/add-custom" component={AddCustomToken} />
          <Route path="/manage-tokens" component={ManageTokens} />
          <Route path="/wallet/:walletId" component={WalletView} />
          <Route
            path="/asset/:networkId/:tokenAddress"
            component={TokenDetails}
          />
          <Route path="/" component={PortfolioHome} />
        </Switch>
      </Stack>
    </NoScrollStack>
  );
};
