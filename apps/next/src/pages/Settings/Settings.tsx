import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ChangePassword } from './pages/ChangePassword';
import { SettingsHomePage } from './pages/Home';

export const Settings: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/change-password`} component={ChangePassword} />
      <Route path={path} component={SettingsHomePage} />
    </Switch>
  );
};
