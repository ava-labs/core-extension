import { FC } from 'react';
import { Box, Divider, Stack, Typography } from '@avalabs/k2-alpine';

import { DefiPerpetualItem, DefiToken } from '@core/types';

import { TokenAvatarGroup } from '@/components/TokenAvatar/TokenAvatarGroup';

import { useConvertedCurrencyFormatter } from '@core/ui';
import { sumByProperty } from '@core/common';

type DeFiProtocolPerpetualProps = {
  items: DefiPerpetualItem[];
};

export const DeFiProtocolPerpetual: FC<DeFiProtocolPerpetualProps> = ({
  items,
}) => {
  return (
    <Stack direction="column" gap={1}>
      {items.map(
        (
          { positionToken, marginToken, profitUsdValue }: DefiPerpetualItem,
          index: number,
        ) => {
          const key = `defi-perpetual-${index}`;
          return (
            <Stack key={key} direction="column" gap={0.5}>
              <DeFiProtocolPerpetualSection
                tokens={[positionToken, marginToken]}
                profitUsdValue={profitUsdValue}
              />
              {items.length > 1 && <Divider variant="fullWidth" />}
            </Stack>
          );
        },
      )}
    </Stack>
  );
};

type DeFiProtocolPerpetualSectionProps = {
  tokens: DefiToken[];
  profitUsdValue: number;
};

const DeFiProtocolPerpetualSection: FC<DeFiProtocolPerpetualSectionProps> = ({
  tokens,
  profitUsdValue,
}) => {
  const formatValue = useConvertedCurrencyFormatter();

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Box minWidth={50}>
        <TokenAvatarGroup tokens={tokens} />
      </Box>
      <Typography noWrap variant="body3" color="text.secondary" flex={1}>
        {tokens.map((token) => token.symbol).join('/')}
      </Typography>

      <Stack>
        <Typography
          variant="body3"
          color={profitUsdValue > 0 ? 'success' : 'error'}
        >
          {formatValue(profitUsdValue)}
        </Typography>
        <Typography variant="body3" color="text.secondary">
          {formatValue(sumByProperty(tokens, 'usdValue'))}
        </Typography>
      </Stack>
    </Stack>
  );
};
