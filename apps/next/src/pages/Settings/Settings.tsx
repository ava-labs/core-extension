import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { AvatarSelector } from './components/AvatarSelector';
import { FC } from 'react';
import { ChangePassword } from './components/ChangePassword';
import { SettingsHomePage } from './components/Home';
import { RecoveryPhrase } from './components/RecoveryPhrase';

export const Settings: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/avatar`} component={AvatarSelector} />
      <Route path={`${path}/change-password`} component={ChangePassword} />
      <Route path={`${path}/recovery-phrase`} component={RecoveryPhrase} />
      <Route path={path} component={SettingsHomePage} />
    </Switch>
  );
};
