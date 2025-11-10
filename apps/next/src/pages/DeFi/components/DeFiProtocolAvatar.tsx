import { Badge, BadgeProps, Box, SxProps } from '@avalabs/k2-alpine';
import { DefiProtocol } from '@core/types';

import { ChainBadge, SizedAvatar } from './Styled';

type DeFiProtocolAvatarProps = {
  protocol: DefiProtocol;
  size?: number;
  badgeSize?: number;
  badgeSx?: SxProps;
};

const defaultBadgeProps: BadgeProps = {
  overlap: 'circular',
  anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
  sx: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
};

export const DeFiProtocolAvatar = ({
  protocol,
  size = 36,
  badgeSize = 18,
  badgeSx,
}: DeFiProtocolAvatarProps) => {
  return (
    <Box width={size} height={size} position="relative">
      <Badge
        {...defaultBadgeProps}
        badgeContent={
          <ChainBadge
            src={protocol.chainLogoUrl}
            size={badgeSize}
            sx={{
              ...badgeSx,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'background.paper',
              backgroundColor: 'transparent',
            }}
          />
        }
      >
        <SizedAvatar src={protocol.logoUrl} size={size} />
      </Badge>
    </Box>
  );
};
