import { Avatar, AvatarProps, Divider, styled } from '@avalabs/k2-alpine';

type SizedAvatarProps = AvatarProps & {
  size: number;
};

export const SizedAvatar = styled(Avatar)<SizedAvatarProps>(({ size }) => ({
  width: size,
  height: size,
  backgroundColor: 'transparent',
}));

export const AccountDivider = styled(Divider)(({ theme }) => ({
  marginBlock: theme.spacing(1),
}));
