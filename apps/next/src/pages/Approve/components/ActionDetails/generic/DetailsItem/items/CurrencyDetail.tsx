import { CurrencyItem } from '@avalabs/vm-module-types';
import { Stack, Typography } from '@avalabs/k2-alpine';

import { TokenUnit } from '@avalabs/core-utils-sdk';
import { useSettingsContext, useTokenPrice } from '@core/ui';

import { TxDetailsRow } from './DetailRow';

type CurrencyDetailProps = {
  item: CurrencyItem;
  customLabel?: React.ReactNode;
};

export const CurrencyDetail = ({ item, customLabel }: CurrencyDetailProps) => {
  const { currencyFormatter } = useSettingsContext();
  const { label, symbol, maxDecimals, value } = item;

  const token = new TokenUnit(value, maxDecimals, symbol);
  const price = useTokenPrice(symbol);

  return (
    <TxDetailsRow label={customLabel ?? label}>
      <Stack textAlign="right">
        <Typography variant="body3" color="text.primary">
          {token.toDisplay()} {symbol}
        </Typography>
        {price && (
          <Typography variant="caption" color="text.secondary">
            {currencyFormatter(price * token.toDisplay({ asNumber: true }))}
          </Typography>
        )}
      </Stack>
    </TxDetailsRow>
  );
};
