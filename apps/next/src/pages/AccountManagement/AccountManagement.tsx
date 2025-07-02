import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Slide,
  SxProps,
} from '@avalabs/k2-alpine';
import { BalancesProvider, WalletTotalBalanceProvider } from '@core/ui';
import { FC } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { Route, Switch } from 'react-router-dom';
import { AccountDetails } from './components/AccountDetails';
import { NavigateBackProvider } from './components/NavigateBackContext';
import { QRCode } from './components/QRCode';
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
  return (
    <BalancesProvider>
      <WalletTotalBalanceProvider>
        <NavigateBackProvider>
          {(goBack) => (
            <Dialog {...dialogSlots} open onClose={goBack} fullScreen>
              <DialogTitle sx={{ padding: 1.5 }}>
                <IconButton onClick={goBack}>
                  <MdArrowBack />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={dialogContentSx}>
                <Switch>
                  <Route
                    path="/account-management/qr-code"
                    component={QRCode}
                  />
                  <Route
                    path="/account-management/account"
                    component={AccountDetails}
                  />
                  <Route
                    path="/account-management/show-private-key"
                    component={ShowPrivateKey}
                  />
                  <Route path="/account-management" component={Wallets} />
                </Switch>
              </DialogContent>
            </Dialog>
          )}
        </NavigateBackProvider>
      </WalletTotalBalanceProvider>
    </BalancesProvider>
  );
};

export default AccountManagement;
