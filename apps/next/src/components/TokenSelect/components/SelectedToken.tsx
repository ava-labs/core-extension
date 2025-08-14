import { FC } from 'react';
import {
  Box,
  ChevronDownIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';

import { TokenAvatar } from '@/components/TokenAvatar';
import { FungibleTokenBalance } from '@core/types';
import { OverflowingTypography } from '@/components/OverflowingTypography';

type SelectedTokenProps = {
  token: FungibleTokenBalance;
};

export const SelectedToken: FC<SelectedTokenProps> = ({ token }) => {
  const theme = useTheme();

  return (
    <>
      <TokenAvatar
        token={token}
        size={32}
        badgeSize={16}
        badgeSx={{
          // We need to match the background color of the card which is semi-transparent,
          // so it's not possible to match 1:1.
          // TODO: possibly add those to palette.alphaMatch object
          borderColor:
            theme.palette.mode === 'dark'
              ? '#47474c'
              : theme.palette.surface.primary,
        }}
      />
      <Stack overflow="hidden">
        <Stack direction="row" alignItems="center" gap={0.5} overflow="hidden">
          <OverflowingTypography variant="subtitle3" color="text.primary">
            {token.name}
          </OverflowingTypography>
          <Box width={16} height={16} display="flex" flexShrink={0}>
            <ChevronDownIcon size={16} />
          </Box>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          whiteSpace="nowrap"
        >
          {token.balanceDisplayValue} {token.symbol}
        </Typography>
      </Stack>
    </>
  );
};
