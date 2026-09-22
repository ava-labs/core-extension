import { FC, useState } from 'react';
import { Stack, MenuItem, styled, Typography } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';

import { FungibleTokenBalance } from '@core/types';

import { TruncatedAddress } from '@/components/Address';
import CheckIcon from '@/components/CheckIcon';
import { TokenAvatar } from '@/components/TokenAvatar';
import { OptionProps } from '@/components/SearchableSelect';
import { getAvailableBalance } from '@/lib/getAvailableBalance';
import { OverflowingTypography } from '@/components/OverflowingTypography';

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
  const contractAddress =
    token.type !== TokenType.NATIVE && 'address' in token && token.address
      ? token.address
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
        <Stack flexGrow={1} overflow="hidden" textOverflow="ellipsis">
          <OverflowingTypography variant="body3">
            {token.name}
          </OverflowingTypography>
          <Typography variant="caption" color="text.secondary">
            {balanceDisplay} {token.symbol}
          </Typography>
        </Stack>
        {isHovered && contractAddress ? (
          <TruncatedAddress
            address={contractAddress}
            visibleChars={9}
            variant="caption"
            color="inherit"
            sx={{ flexShrink: 0, fontFamily: 'monospace' }}
          />
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
