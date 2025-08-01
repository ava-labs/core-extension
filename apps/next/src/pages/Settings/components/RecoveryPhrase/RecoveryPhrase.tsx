import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Mnemonic } from './components/Mnemonic';
import { Seedless } from './components/Seedless';

export const RecoveryPhrase: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/mnemonic`} component={Mnemonic} />
      <Route path={`${path}/seedless`} component={Seedless} />
    </Switch>
  );
};
