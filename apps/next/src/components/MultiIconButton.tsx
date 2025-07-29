import { IconButton, IconButtonProps, styled } from '@avalabs/k2-alpine';
import { FC, ReactElement } from 'react';
import { IconBaseProps } from 'react-icons';

type Props = IconButtonProps & {
  icon: ReactElement<IconBaseProps>;
  hoverIcon: ReactElement<IconBaseProps>;
  /**
   * Provide a class name on which the transition from the first to second icon should be toggled.
   * If not provided, the transition will happen on hover.
   */
  toggleClassName?: string;
};

export const MultiIconButton: FC<Props> = ({ icon, hoverIcon, ...props }) => {
  return (
    <CrossFadeIconButton disableRipple size="small" {...props}>
      {icon}
      {hoverIcon}
    </CrossFadeIconButton>
  );
};

type CrossFadeIconButtonProps = IconButtonProps & {
  toggleClassName?: string;
};

const CrossFadeIconButton = styled(IconButton)<CrossFadeIconButtonProps>(
  ({ theme, toggleClassName }) => ({
    padding: 0,

    '--hover-icon-visibility': 0,
    '--icon-visibility': 1,

    [toggleClassName ? `&.${toggleClassName}` : '&:hover']: {
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
  }),
);
