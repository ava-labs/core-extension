import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AddCustomToken } from './components/AddCustomToken/AddCustomToken';
import { ManageTokens } from './components/ManageTokens';
import { PortfolioHome } from './components/PortfolioHome';
import { WalletView } from './components/WalletView/WalletView';
import { TokenDetails } from './components/PortfolioHome/components/PortolioDetails/components/TokenDetails';

export const Portfolio: FC = () => (
  <Switch>
    <Route path="/manage-tokens/add-custom" component={AddCustomToken} />
    <Route path="/manage-tokens" component={ManageTokens} />
    <Route path="/wallet/:walletId" component={WalletView} />
    <Route path="/asset/:networkId/:tokenId" component={TokenDetails} />
    <Route path="/" component={PortfolioHome} />
  </Switch>
);
