import { FC } from 'react';
import { Stack, MenuItem, styled, Typography } from '@avalabs/k2-alpine';

import { FungibleTokenBalance } from '@core/types';

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

  return (
    <StyledMenuItem {...rest} selected={isSelected}>
      <Stack width="100%" direction="row" alignItems="center" gap={1.5}>
        <TokenAvatar token={token} size={24} badgeSize={12} />
        <Stack>
          <Typography variant="body3">{token.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {balanceDisplay} {token.symbol}
          </Typography>
        </Stack>
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
