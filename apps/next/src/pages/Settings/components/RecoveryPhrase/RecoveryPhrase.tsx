import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ShowPhrase } from './components/ShowPhrase';

export const RecoveryPhrase: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/show-phrase`} component={ShowPhrase} />
    </Switch>
  );
};
