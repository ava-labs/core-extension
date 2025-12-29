import { Badge, BadgeProps, SxProps } from '@avalabs/k2-alpine';
import { FungibleTokenBalance } from '@core/types';
import { ChainBadge } from '../ChainBadge';
import { SizedAvatar } from '../SizedAvatar';
import { FallbackTokenAvatar } from './FallbackTokenAvatar';

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
}: TokenAvatarProps) => (
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
    <SizedAvatar src={token.logoUri} alt={token.symbol} size={size}>
      <FallbackTokenAvatar symbol={token.symbol} />
    </SizedAvatar>
  </Badge>
);
