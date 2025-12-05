import { AccountManagerProvider } from '@core/ui';
import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { AccountDetails } from './components/AccountDetails';
import { AddOrConnectWallet } from './components/AddOrCreateWallet/AddOrConnectWallet';
import { DeleteAccount } from './components/DeleteAccount';
import { ImportKeystoreFile } from './components/ImportKeystoreFile/Page';
import { ImportPrivateKey } from './components/ImportPrivateKey/Page';
import { QRCode } from './components/QRCode';
import { RenamePage } from './components/RenamePage';
import { ShowPrivateKey } from './components/ShowPrivateKey/ShowPrivateKey';
import { WalletsHomePage } from './components/Wallets';

const AccountManagement: FC = () => {
  const { path } = useRouteMatch();
  return (
    <AccountManagerProvider>
      <Switch>
        <Route path={path} exact component={WalletsHomePage} />
        <Route path={`${path}/rename`} component={RenamePage} />
        <Route path={`${path}/delete-account`} component={DeleteAccount} />
        <Route path={`${path}/qr-code`} component={QRCode} />
        <Route path={`${path}/add-wallet`} component={AddOrConnectWallet} />
        <Route
          path={`${path}/import-private-key`}
          component={ImportPrivateKey}
        />
        <Route
          path={`${path}/import-keystore-file`}
          component={ImportKeystoreFile}
        />
        <Route path={`${path}/account`} component={AccountDetails} />
        <Route path={`${path}/show-private-key`} component={ShowPrivateKey} />
      </Switch>
    </AccountManagerProvider>
  );
};

export default AccountManagement;
