import {
  IconButton,
  IconButtonProps,
  QrCodeIcon,
  styled,
} from '@avalabs/k2-alpine';
import { FC, ReactElement } from 'react';
import { IconBaseProps } from 'react-icons';

type Props = IconButtonProps & {
  children: ReactElement<IconBaseProps>;
};

export const QRCodeIconButton: FC<Props> = ({ children, ...props }) => {
  return (
    <HoverableButton disableRipple size="small" {...props}>
      <span>{children}</span>
      <QrCodeIcon />
    </HoverableButton>
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
