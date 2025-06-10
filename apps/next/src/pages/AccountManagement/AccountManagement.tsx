import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Slide,
  Stack,
  styled,
} from '@avalabs/k2-alpine';
import { BalancesProvider, WalletTotalBalanceProvider } from '@core/ui';
import { FC } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import AddOrConnectWalletButton from './components/AddOrConnectWalletButton';
import CurrentAccount from './components/CurrentAccount';
import { Wallets } from './components/Wallets';

const PaddedEndStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1.5),
  '&:after': {
    content: '""',
    height: theme.spacing(4),
  },
}));

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
            <PaddedEndStack>
              <CurrentAccount />
              <Wallets />
              <AddOrConnectWalletButton />
            </PaddedEndStack>
          </DialogContent>
        </Dialog>
      </WalletTotalBalanceProvider>
    </BalancesProvider>
  );
};

export default AccountManagement;
