import { DetailItemType, FundsRecipientItem } from '@avalabs/vm-module-types';
import { TruncatedAddress } from '@/components/Address';

import { CurrencyDetail } from './CurrencyDetail';
import { NetworkWithCaipId } from '@core/types';

type FundsRecipientDetailProps = {
  item: FundsRecipientItem;
  network: NetworkWithCaipId;
};

export const FundsRecipientDetail = ({
  item,
  network,
}: FundsRecipientDetailProps) => {
  const { label: address, amount, symbol, maxDecimals } = item;

  return (
    <CurrencyDetail
      network={network}
      customLabel={<TruncatedAddress address={address} />}
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
