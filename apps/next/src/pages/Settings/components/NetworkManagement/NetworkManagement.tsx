import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { NetworksHome } from './components/NetworksHome';
import { NetworkDetailsFlow } from './components/NetworkDetailsFlow';
import { AddNetworkFlow } from './components/AddNetworkFlow';

export const NetworkManagement: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}`} component={NetworksHome} />
      <Route
        path={`${path}/details/:networkId`}
        component={NetworkDetailsFlow}
      />
      <Route exact path={`${path}/add`} component={AddNetworkFlow} />
    </Switch>
  );
};
