import {
  Button,
  ButtonProps,
  ChevronRightIcon,
  styled,
} from '@avalabs/k2-alpine';

import { PersonalAvatar } from '@/components/PersonalAvatar';

type AvatarButtonProps = Omit<
  ButtonProps,
  'size' | 'variant' | 'disableRipple'
>;

export const AvatarButton = (props: AvatarButtonProps) => {
  return (
    <StyledAvatarButton variant="text" disableRipple size="small" {...props}>
      <PersonalAvatar size="xsmall" className="avatar" />
      <ChevronRightIcon size={16} />
    </StyledAvatarButton>
  );
};

const StyledAvatarButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  alignItems: 'center',
  paddingInline: 0,
  marginRight: theme.spacing(-0.75),
  // TODO: add an Avatar variant -- yet another (smaller - xxsmall - size: 28x28)
  '.avatar': {
    width: 28,
    height: 28,
    cursor: 'pointer',
    '> div': {
      transform: 'scale(0.875)',
      transformOrigin: 'top left',
    },
  },
}));
