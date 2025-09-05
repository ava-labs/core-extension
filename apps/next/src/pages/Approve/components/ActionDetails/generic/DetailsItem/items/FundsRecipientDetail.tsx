import { DetailItemType, FundsRecipientItem } from '@avalabs/vm-module-types';
import { Tooltip, truncateAddress, Typography } from '@avalabs/k2-alpine';

import { CurrencyDetail } from './CurrencyDetail';

type FundsRecipientDetailProps = {
  item: FundsRecipientItem;
};

export const FundsRecipientDetail = ({ item }: FundsRecipientDetailProps) => {
  const { label: address, amount, symbol, maxDecimals } = item;

  return (
    <CurrencyDetail
      customLabel={
        <Tooltip title={address}>
          <Typography variant="mono" color="text.secondary">
            {truncateAddress(address, 10)}
          </Typography>
        </Tooltip>
      }
      item={{
        label: address,
        value: amount,
        symbol,
        maxDecimals,
        type: DetailItemType.CURRENCY,
      }}
    />
  );
};
