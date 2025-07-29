import { ViewModeSwitcher } from '@/components/Header/ViewModeSwitcher';
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Slide,
  Stack,
  SxProps,
} from '@avalabs/k2-alpine';
import {
  AccountManagerProvider,
  BalancesProvider,
  WalletTotalBalanceProvider,
} from '@core/ui';
import { FC } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { AccountDetails } from './components/AccountDetails';
import { AddOrConnectWallet } from './components/AddOrCreateWallet/AddOrConnectWallet';
import { DeleteAccount } from './components/DeleteAccount';
import { ImportPrivateKey } from './components/ImportPrivateKey/Page';
import { NavigateBackProvider } from './components/NavigateBackContext';
import { QRCode } from './components/QRCode';
import { RenamePage } from './components/RenamePage';
import { ShowPrivateKey } from './components/ShowPrivateKey/ShowPrivateKey';
import { Wallets } from './components/Wallets';

const dialogSlots: Pick<DialogProps, 'slots' | 'slotProps'> = {
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

const dialogContentSx: SxProps = {
  container: 'account-management / size',
  padding: 1.5,
  overflow: 'hidden',
};

const AccountManagement: FC = () => {
  const { path } = useRouteMatch();
  return (
    <BalancesProvider>
      <WalletTotalBalanceProvider>
        <AccountManagerProvider>
          <NavigateBackProvider>
            {(goBack) => (
              <Dialog {...dialogSlots} open onClose={goBack} fullScreen>
                <DialogTitle sx={{ padding: 1.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    justifyItems="center"
                  >
                    <IconButton onClick={goBack}>
                      <MdArrowBack />
                    </IconButton>
                    <ViewModeSwitcher />
                  </Stack>
                </DialogTitle>
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
                      path={`${path}/account`}
                      component={AccountDetails}
                    />
                    <Route
                      path={`${path}/show-private-key`}
                      component={ShowPrivateKey}
                    />
                    <Route path={path} component={Wallets} />
                  </Switch>
                </DialogContent>
              </Dialog>
            )}
          </NavigateBackProvider>
        </AccountManagerProvider>
      </WalletTotalBalanceProvider>
    </BalancesProvider>
  );
};

export default AccountManagement;
