import { DetailItem, DetailItemType } from '@avalabs/vm-module-types';

import { PlainTextDetail } from './items/PlainTextDetail';
import { TextDetail } from './items/TextDetail';
import { AddressDetail } from './items/AddressDetail';
import { LinkDetail } from './items/LinkDetail';
import { NetworkDetail } from './items/NetworkDetail';
import { RawDataDetail } from './items/RawDataDetails/RawDataDetail';
import { FundsRecipientDetail } from './items/FundsRecipientDetail';
import { CurrencyDetail } from './items/CurrencyDetail';

type DetailsItemProps = {
  item: DetailItem;
};

export const DetailsItem = ({ item }: DetailsItemProps) => {
  if (typeof item === 'string') {
    return <PlainTextDetail item={item} />;
  }

  switch (item.type) {
    case DetailItemType.TEXT:
      return <TextDetail item={item} />;

    case DetailItemType.ADDRESS:
      return <AddressDetail item={item} />;

    case DetailItemType.LINK:
      return <LinkDetail item={item} />;

    case DetailItemType.NETWORK:
      return <NetworkDetail item={item} />;

    case DetailItemType.DATA:
      return <RawDataDetail item={item} />;

    case DetailItemType.FUNDS_RECIPIENT:
      return <FundsRecipientDetail item={item} />;

    case DetailItemType.CURRENCY:
      return <CurrencyDetail item={item} />;
  }
};
