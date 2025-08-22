import {
  Avatar,
  type AvatarProps,
  combineSx,
  useTheme,
} from '@avalabs/k2-alpine';
import type { BadgeProps, SxProps, Theme } from '@avalabs/k2-alpine';
import { useMemo } from 'react';
import { BadgedAvatar } from './BadgedAvatar';
import { NetworkWithCaipId } from '@core/types';
import { getBadgeProps } from './utils/getBadgeProps';

// The default reverseColor is false. It should be set to be true when the avatars are used in dropdowns since they have reversed color there
// The default isToken is false. It should be set to be true when the fall back image should be the solid filled color instead of the fall back avatar image
type NetworkBadgedAvatarProps = BadgeProps & {
  avatar?: AvatarProps;
  badge?: AvatarProps;
  network: NetworkWithCaipId;
  reverseColor?: boolean;
  isToken?: boolean;
};

/**
 * A badged avatar component that displays an avatar with a chain-specific badge.
 * Uses chain information to automatically configure badge properties via getBadgeProps utility.
 */
export const NetworkBadgedAvatar = ({
  avatar,
  badge,
  network,
  reverseColor = false,
  isToken = false,
  sx,
  children,
  ...rest
}: NetworkBadgedAvatarProps) => {
  const theme = useTheme();
  const badgeProps = useMemo(() => {
    return getBadgeProps({ badge, theme, override: { network } });
  }, [badge, theme, network]);
  return (
    <BadgedAvatar avatar={avatar} badge={badgeProps} {...rest} sx={sx}>
      {isToken ? (
        <FallbackTokenAvatar
          reverseColor={reverseColor}
          avatar={avatar}
          sx={sx}
        />
      ) : children ? (
        children
      ) : null}
    </BadgedAvatar>
  );
};
const FallbackTokenAvatar = ({
  reverseColor,
  avatar,
  sx,
}: {
  reverseColor: boolean;
  avatar?: AvatarProps;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Avatar
      {...avatar}
      sx={combineSx(
        {
          bgcolor: reverseColor ? 'datePicker.hover' : 'background.navBarItem',
          borderColor: reverseColor
            ? 'datePicker.hover'
            : 'background.navBarItem',
          borderWidth: 1,
          borderStyle: 'solid',
        },
        sx,
      )}
    >
      {' '}
      {/* This string with space forces the fall back to be a solid color */}
    </Avatar>
  );
};
