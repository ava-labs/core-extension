import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { NetworksHome } from './components/NetworksHome';
import { AddNetwork } from './components/AddNetwork';
import { NetworkDetails } from './components/NetworkDetails';
import { CustomRpcHeadersManager } from './components/CustomRpcHeadersManager';

export const NetworkManagement: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}`} component={NetworksHome} />
      <Route path={`${path}/details/:chainId`} component={NetworkDetails} />
      <Route exact path={`${path}/add`} component={AddNetwork} />
      <Route
        path={`${path}/add/rpc-headers`}
        component={CustomRpcHeadersManager}
      />
    </Switch>
  );
};
