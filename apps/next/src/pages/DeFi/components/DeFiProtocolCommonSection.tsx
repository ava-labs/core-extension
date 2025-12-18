import { FC } from 'react';
import { Box, Stack, Typography, Divider } from '@avalabs/k2-alpine';

import { DefiToken } from '@core/types';
import { sumByProperty } from '@core/common';

import { TokenAvatarGroup } from '@/components/TokenAvatar/TokenAvatarGroup';

import { useConvertedCurrencyFormatter } from '@core/ui';

type DeFiProtocolCommonSectionProps = {
  title: string;
  tokens: DefiToken[];
};

export const DeFiProtocolCommonSection: FC<DeFiProtocolCommonSectionProps> = ({
  title,
  tokens,
}) => {
  const formatValue = useConvertedCurrencyFormatter();

  return (
    <>
      <Stack direction="column" gap={0.5}>
        <Typography variant="body2">{title}</Typography>
      </Stack>
      <Divider variant="fullWidth" />
      <Stack direction="row" alignItems="center" gap={2}>
        <Box minWidth={50}>
          <TokenAvatarGroup tokens={tokens} />
        </Box>

        <Typography noWrap variant="body3" color="text.secondary" flex={1}>
          {tokens.map((token) => token.symbol).join(', ')}
        </Typography>

        <Typography variant="body3" color="text.secondary">
          {formatValue(sumByProperty(tokens, 'usdValue'))}
        </Typography>
      </Stack>
    </>
  );
};
