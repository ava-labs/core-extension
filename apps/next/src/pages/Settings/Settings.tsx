import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { LedgerDeviceStatus } from '../Ledger';
import { AvatarSelector } from './components/AvatarSelector';
import { ChangePassword } from './components/ChangePassword';
import { ConnectedSites } from './components/ConnectedSites';
import { SettingsHomePage } from './components/Home';
import { NetworkManagement } from './components/NetworkManagement';
import { RecoveryMethods } from './components/RecoveryMethods';
import { Authenticator } from './components/RecoveryMethods/Authenticator';
import { FIDO } from './components/RecoveryMethods/FIDO/FIDO';
import { RecoveryPhrase } from './components/RecoveryPhrase';
import { ResetRecoveryPhrase } from './components/ResetRecoveryPhrase';

export const Settings: FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/avatar`} component={AvatarSelector} />
      <Route path={`${path}/change-password`} component={ChangePassword} />
      <Route path={`${path}/connected-sites`} component={ConnectedSites} />
      <Route path={`${path}/recovery-phrase`} component={RecoveryPhrase} />
      <Route
        path={`${path}/recovery-method/authenticator`}
        component={Authenticator}
      />
      <Route path={`${path}/recovery-method/fido/:id`} component={FIDO} exact />
      <Route
        path={`${path}/recovery-methods`}
        component={RecoveryMethods}
        exact
      />
      <Route
        path={`${path}/network-management`}
        component={NetworkManagement}
      />
      <Route path={`${path}/reset`} component={ResetRecoveryPhrase} />
      <Route
        path={`${path}/ledger-device-status`}
        component={LedgerDeviceStatus}
      />
      <Route path={path} component={SettingsHomePage} />
    </Switch>
  );
};
