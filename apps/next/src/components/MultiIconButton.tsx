import { IconButton, IconButtonProps, styled } from '@avalabs/k2-alpine';
import { FC, ReactElement } from 'react';
import { IconBaseProps } from 'react-icons';

type Props = IconButtonProps & {
  icon: ReactElement<IconBaseProps>;
  hoverIcon: ReactElement<IconBaseProps>;
};

export const MultiIconButton: FC<Props> = ({ icon, hoverIcon, ...props }) => {
  return (
    <HoverableButton disableRipple size="small" {...props}>
      <span>{icon}</span>
      {hoverIcon}
    </HoverableButton>
  );
};

const HoverableButton = styled(IconButton)(({ theme }) => ({
  padding: 0,

  '--hover-icon-visibility': 0,
  '--icon-visibility': 1,

  '&:hover': {
    '--hover-icon-visibility': 1,
    '--icon-visibility': 0,
  },

  [`& > :first-child`]: {
    opacity: 'var(--icon-visibility)',
    transition: theme.transitions.create('opacity'),
  },

  [`& > :last-child`]: {
    position: 'absolute',
    opacity: 'var(--hover-icon-visibility)',
    transition: theme.transitions.create('opacity'),
  },
}));
