import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  QrCodeIcon,
  styled,
} from '@avalabs/k2-alpine';
import QRCode from 'qrcode.react';
import { FC, ReactElement, useState } from 'react';
import { IconBaseProps } from 'react-icons';
import { MdArrowBack } from 'react-icons/md';

type Props = {
  value: string;
  children: ReactElement<IconBaseProps>;
};

export const QRCodeIconButton: FC<Props> = ({ value, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <HoverableButton disableRipple size="small" onClick={() => setOpen(true)}>
        <span>{children}</span>
        <QrCodeIcon />
      </HoverableButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ padding: 1.5 }}>
          <IconButton onClick={() => setOpen(false)}>
            <MdArrowBack />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <QRCode renderAs="svg" value={value} level="H" />
        </DialogContent>
      </Dialog>
    </>
  );
};

const HoverableButton = styled(IconButton)(({ theme }) => ({
  padding: 0,

  '--qrcode-visibility': 0,
  '--icon-visibility': 1,

  '&:hover': {
    '--qrcode-visibility': 1,
    '--icon-visibility': 0,
  },

  [`& > :first-child`]: {
    opacity: 'var(--icon-visibility)',
    transition: theme.transitions.create('opacity'),
  },

  [`& > :last-child`]: {
    position: 'absolute',
    opacity: 'var(--qrcode-visibility)',
    transition: theme.transitions.create('opacity'),
  },
}));
