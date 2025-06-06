import { useState, FC } from 'react';
import CurrentAccount from './components/CurrentAccount';
import { Wallets } from './components/Wallets';
import AddOrConnectWalletButton from './components/AddOrConnectWalletButton';
import { MdArrowBack, MdSettings } from 'react-icons/md';
import {
  Dialog,
  DialogProps,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  styled,
} from '@avalabs/k2-alpine';
import { IconButton } from '@avalabs/k2-alpine';

const PaddedEndStack = styled(Stack)(({ theme }) => ({
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
  const [open, setOpen] = useState(true);
  return (
    <>
      <IconButton onClick={() => setOpen((x) => !x)}>
        <MdSettings />
      </IconButton>
      <Dialog
        {...dialogSlots}
        open={open}
        onClose={() => setOpen(false)}
        fullScreen
      >
        <DialogTitle sx={{ padding: 1.5 }}>
          <IconButton onClick={() => setOpen(false)}>
            <MdArrowBack />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ paddingInline: 1.5 }}>
          <PaddedEndStack gap={1.5}>
            <CurrentAccount />
            <Wallets />
            <AddOrConnectWalletButton />
          </PaddedEndStack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountManagement;
