import { FC, useState } from 'react';
import { Stack, MenuItem, styled, Typography } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';
import { truncateAddress } from '@core/common';

import CheckIcon from '@/components/CheckIcon';
import { TokenAvatar } from '@/components/TokenAvatar';
import { OptionProps } from '@/components/SearchableSelect';
import { getAvailableBalance } from '@/lib/getAvailableBalance';

type TokenMenuItemProps = OptionProps & {
  token: FungibleTokenBalance;
};

export const TokenMenuItem: FC<TokenMenuItemProps> = ({
  token,
  isSelected,
  ...rest
}) => {
  const balanceDisplay = getAvailableBalance(token, true);
  const [isHovered, setIsHovered] = useState(false);
  const truncatedAddress =
    token.type !== TokenType.NATIVE && 'address' in token && token.address
      ? truncateAddress(token.address, 5, 4)
      : null;

  return (
    <StyledMenuItem
      {...rest}
      selected={isSelected}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Stack width="100%" direction="row" alignItems="center" gap={1.5}>
        <TokenAvatar token={token} size={24} badgeSize={12} />
        <Stack flexGrow={1}>
          <Typography variant="body3">{token.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {balanceDisplay} {token.symbol}
          </Typography>
        </Stack>
        {isHovered && truncatedAddress ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ flexShrink: 0, fontFamily: 'monospace' }}
          >
            {truncatedAddress}
          </Typography>
        ) : (
          isSelected && <CheckIcon size={12} style={{ flexShrink: 0 }} />
        )}
      </Stack>
    </StyledMenuItem>
  );
};

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  marginInline: theme.spacing(1.25),
  borderRadius: theme.shape.borderRadius,
  paddingInline: theme.spacing(1.5),
  minHeight: 'unset',
  width: 'auto',
}));
