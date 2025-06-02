import { useState, FC } from 'react';
import CurrentAccount from './components/CurrentAccount';
import { Wallets } from './components/Wallets';
import AddOrConnectWalletButton from './components/AddOrConnectWalletButton';
import { MdArrowBack, MdSettings } from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from '@avalabs/k2-alpine';
import { IconButton } from '@avalabs/k2-alpine';

const AccountManagement: FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <IconButton onClick={() => setOpen((x) => !x)}>
        <MdSettings />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen
        slots={{
          transition: Slide,
        }}
        slotProps={{
          transition: {
            direction: 'up',
          },
          paper: {
            sx: { borderRadius: 0 },
          },
        }}
      >
        <DialogTitle sx={{ padding: 1.5 }}>
          <IconButton onClick={() => setOpen(false)}>
            <MdArrowBack />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack gap={1.5}>
            <CurrentAccount />
            <Wallets />
            <AddOrConnectWalletButton />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountManagement;
