import { FC } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';

import { DefiProtocol } from '@core/types';

import { DeFiProtocolAvatar } from './DeFiProtocolAvatar';

import { useConvertedCurrencyFormatter, useSettingsContext } from '@core/ui';

type DeFiProtocolDetailsHeaderProps = {
  protocol: DefiProtocol;
};

export const DeFiProtocolDetailsHeader: FC<DeFiProtocolDetailsHeaderProps> = ({
  protocol,
}) => {
  const { currency } = useSettingsContext();
  const formatValue = useConvertedCurrencyFormatter();

  return (
    <Stack direction="column" gap={2} mb={5}>
      <DeFiProtocolAvatar protocol={protocol} />
      <Stack direction="column" gap={0.5}>
        <Typography variant="h2" color="text.secondary">
          {protocol.name}
        </Typography>

        <Typography
          variant="h2"
          color="text.primary"
          gap={0.5}
          display="inline-flex"
          alignItems="baseline"
        >
          {formatValue(protocol.totalUsdValue)}
          <Typography
            component="span"
            variant="subtitle1"
            fontWeight="semibold"
          >
            {currency}
          </Typography>
        </Typography>
      </Stack>
    </Stack>
  );
};
