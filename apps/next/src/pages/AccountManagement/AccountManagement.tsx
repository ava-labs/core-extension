import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Slide,
} from '@avalabs/k2-alpine';
import { BalancesProvider, WalletTotalBalanceProvider } from '@core/ui';
import { FC } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Wallets } from './components/Wallets';
import { AccountDetails } from './components/AccountDetails';
import { QRCode } from './components/QRCode';

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

const AccountManagement: FC = () => {
  const history = useHistory();
  const goBack = () => history.goBack();
  return (
    <BalancesProvider>
      <WalletTotalBalanceProvider>
        <Dialog {...dialogSlots} open onClose={goBack} fullScreen>
          <DialogTitle sx={{ padding: 1.5 }}>
            <IconButton onClick={goBack}>
              <MdArrowBack />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ paddingInline: 1.5 }}>
            <Switch>
              <Route path="/account-management/qr-code" component={QRCode} />
              <Route
                path="/account-management/account"
                component={AccountDetails}
              />
              <Route path="/account-management" component={Wallets} />
            </Switch>
          </DialogContent>
        </Dialog>
      </WalletTotalBalanceProvider>
    </BalancesProvider>
  );
};

export default AccountManagement;
