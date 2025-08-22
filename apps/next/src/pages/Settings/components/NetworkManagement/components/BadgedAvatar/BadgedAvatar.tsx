import {
  Avatar,
  type AvatarProps,
  Badge,
  type BadgeProps,
  Box,
  combineSx,
} from '@avalabs/k2-alpine';
import { memo } from 'react';

type BadgedAvatarProps = BadgeProps & {
  avatar?: AvatarProps;
  badge: AvatarProps;
};

export const BadgedAvatar = memo<BadgedAvatarProps>(function AvatarTableCell({
  avatar,
  badge,
  sx,
  children,
  ...rest
}) {
  const { sx: badgeSx, ...badgeProps } = badge;

  return (
    <Box>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Avatar
            sx={combineSx(
              {
                width: 18,
                height: 18,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'background.default',
              },
              badgeSx,
            )}
            {...badgeProps}
          />
        }
        {...rest}
      >
        {children || <Avatar {...avatar} sx={sx} />}
      </Badge>
    </Box>
  );
});
