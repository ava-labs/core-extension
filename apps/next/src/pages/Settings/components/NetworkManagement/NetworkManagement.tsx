import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { AllNetworks } from './components/AllNetworks';
import { CustomNetworks } from './components/CustomNetworks';

// const tabs = ['all', 'custom', 'add'];

export const NetworkManagement: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}`} component={AllNetworks} />
      <Route path={`${path}/custom`} component={CustomNetworks} />
    </Switch>
  );
};
