import { Badge, BadgeProps, SxProps, useTheme } from '@avalabs/k2-alpine';

import { FungibleTokenBalance } from '@core/types';

import { ChainBadge } from '../ChainBadge';
import { SizedAvatar } from '../SizedAvatar';
import GenericTokenDark from '@/images/tokens/GenericTokenDark.svg';
import GenericTokenLight from '@/images/tokens/GenericTokenLight.svg';

type TokenAvatarProps = {
  size: number;
  badgeSize: number;
  token: FungibleTokenBalance;
  badgeSx?: SxProps;
};

const defaultBadgeProps: BadgeProps = {
  overlap: 'circular',
  anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
};

export const TokenAvatar = ({
  token,
  size = 32,
  badgeSize = 18,
  badgeSx,
}: TokenAvatarProps) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === 'light';
  const fallbackImage = isLightMode ? GenericTokenLight : GenericTokenDark;
  const avatarSrc = token.logoUri || fallbackImage;

  return (
    <Badge
      {...defaultBadgeProps}
      badgeContent={
        <ChainBadge
          coreChainId={token.coreChainId}
          size={badgeSize}
          sx={badgeSx}
        />
      }
    >
      <SizedAvatar src={avatarSrc} alt={token.symbol} size={size}>
        <img
          src={fallbackImage}
          alt={token.symbol}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </SizedAvatar>
    </Badge>
  );
};
