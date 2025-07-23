import { IconButton, IconButtonProps, styled } from '@avalabs/k2-alpine';
import { FC, ReactElement } from 'react';
import { IconBaseProps } from 'react-icons';

type Props = IconButtonProps & {
  icon: ReactElement<IconBaseProps>;
  hoverIcon: ReactElement<IconBaseProps>;
};

export const MultiIconButton: FC<Props> = ({ icon, hoverIcon, ...props }) => {
  return (
    <HoverableButton size="small" {...props}>
      {icon}
      {hoverIcon}
    </HoverableButton>
  );
};

const HoverableButton = styled(IconButton)(({ theme }) => ({
  '--hover-icon-visibility': 0,
  '--icon-visibility': 1,

  '&:hover': {
    '--hover-icon-visibility': 1,
    '--icon-visibility': 0,
  },

  [`& > :nth-child(1)`]: {
    opacity: 'var(--icon-visibility)',
    transition: theme.transitions.create('opacity'),
  },

  [`& > :nth-child(2)`]: {
    position: 'absolute',
    opacity: 'var(--hover-icon-visibility)',
    transition: theme.transitions.create('opacity'),
  },
}));
