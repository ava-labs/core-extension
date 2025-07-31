import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { MainSettingPage } from './components/MainSettingPage';
import { AvatarSelector } from './components/AvatarSelector';

export const Settings = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/avatar`} component={AvatarSelector} />
      <Route path={path} component={MainSettingPage} />
    </Switch>
  );
};
