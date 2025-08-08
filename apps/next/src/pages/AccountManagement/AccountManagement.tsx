import {
  Dialog,
  DialogContent,
  DialogProps,
  Slide,
  SxProps,
} from '@avalabs/k2-alpine';
import {
  AccountManagerProvider,
  BalancesProvider,
  useGoBack,
  WalletTotalBalanceProvider,
} from '@core/ui';
import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { AccountDetails } from './components/AccountDetails';
import { AddOrConnectWallet } from './components/AddOrCreateWallet/AddOrConnectWallet';
import { DeleteAccount } from './components/DeleteAccount';
import { ImportPrivateKey } from './components/ImportPrivateKey/Page';
import { QRCode } from './components/QRCode';
import { RenamePage } from './components/RenamePage';
import { ShowPrivateKey } from './components/ShowPrivateKey/ShowPrivateKey';
import { Wallets } from './components/Wallets';
import { ImportKeystoreFile } from './components/ImportKeystoreFile/Page';
import { PageTopBar } from '../../components/PageTopBar';

export const dialogSlots: Pick<DialogProps, 'slots' | 'slotProps'> = {
  slots: {
    transition: Slide,
  },
  slotProps: {
    transition: {
      direction: 'up',
    },
    paper: {
      sx: { borderRadius: 0 },
    },
  },
};

export const dialogContentSx: SxProps = {
  container: 'account-management / size',
  padding: 1.5,
  overflow: 'hidden',
};

const AccountManagement: FC = () => {
  const { path } = useRouteMatch();
  const goBack = useGoBack();
  return (
    <BalancesProvider>
      <WalletTotalBalanceProvider>
        <AccountManagerProvider>
          <Dialog {...dialogSlots} open onClose={goBack} fullScreen>
            <PageTopBar showBack onBackClicked={goBack} />
            <DialogContent sx={dialogContentSx}>
              <Switch>
                <Route path={`${path}/rename`} component={RenamePage} />
                <Route
                  path={`${path}/delete-account`}
                  component={DeleteAccount}
                />
                <Route path={`${path}/qr-code`} component={QRCode} />
                <Route
                  path={`${path}/add-wallet`}
                  component={AddOrConnectWallet}
                />
                <Route
                  path={`${path}/import-private-key`}
                  component={ImportPrivateKey}
                />
                <Route
                  path={`${path}/import-keystore-file`}
                  component={ImportKeystoreFile}
                />
                <Route path={`${path}/account`} component={AccountDetails} />
                <Route
                  path={`${path}/show-private-key`}
                  component={ShowPrivateKey}
                />
                <Route path={path} component={Wallets} />
              </Switch>
            </DialogContent>
          </Dialog>
        </AccountManagerProvider>
      </WalletTotalBalanceProvider>
    </BalancesProvider>
  );
};

export default AccountManagement;
