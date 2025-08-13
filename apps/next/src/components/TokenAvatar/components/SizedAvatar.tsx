import { AvatarProps, Avatar, styled } from '@avalabs/k2-alpine';

export type SizedAvatarProps = AvatarProps & {
  size: number;
};

export const SizedAvatar = styled(Avatar)<SizedAvatarProps>(({ size }) => ({
  width: size,
  height: size,
  backgroundColor: 'transparent',
}));
