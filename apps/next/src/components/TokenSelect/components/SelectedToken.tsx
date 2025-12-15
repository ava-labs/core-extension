import {
  Box,
  ChevronDownIcon,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC, useMemo } from 'react';
import { Trans } from 'react-i18next';

import { OverflowingTypography } from '@/components/OverflowingTypography';
import { TokenAvatar } from '@/components/TokenAvatar';
import { getAvailableBalance } from '@/lib/getAvailableBalance';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { FungibleTokenBalance } from '@core/types';
import { useNetworkContext } from '@core/ui';

type SelectedTokenProps = {
  token: FungibleTokenBalance;
  hint?: string;
};

export const SelectedToken: FC<SelectedTokenProps> = ({ token, hint }) => {
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
        {hint && (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        )}
        <Stack direction="row" alignItems="center" gap={0.5} overflow="hidden">
          <OverflowingTypography variant="subtitle3" color="text.primary">
            {token.name}
          </OverflowingTypography>
          <Box width={16} height={16} display="flex" flexShrink={0}>
            <ChevronDownIcon size={16} />
          </Box>
        </Stack>
        <TokenBalance token={token} />
      </Stack>
    </>
  );
};

const TokenBalance: FC<{ token: FungibleTokenBalance }> = ({ token }) => {
  const { getNetwork } = useNetworkContext();
  const balance = getAvailableBalance(token, false);
  const balanceDisplay = getAvailableBalance(token, true);
  const network = getNetwork(token.coreChainId);
  const networkName = network?.chainName ?? '';

  const formattedSymbol = useMemo(() => {
    return token.symbol
      .split('.')
      .map((part, index) =>
        index === 0 ? part.toUpperCase() : part.toLowerCase(),
      )
      .join('.');
  }, [token.symbol]);

  return (
    <Stack>
      <Tooltip
        title={new TokenUnit(balance, token.decimals, token.symbol).toString()}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          whiteSpace="nowrap"
        >
          {balanceDisplay} {formattedSymbol}
        </Typography>
      </Tooltip>
      {networkName && (
        <Typography variant="caption" color="text.secondary">
          <Trans i18nKey="on {{networkName}}" values={{ networkName }} />
        </Typography>
      )}
    </Stack>
  );
};
