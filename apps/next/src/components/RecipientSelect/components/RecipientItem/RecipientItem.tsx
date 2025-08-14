import { FC } from 'react';
import { AddressType } from '@core/types';

import { Recipient } from '../../types';
import { AccountRecipientItem } from './AccountRecipientItem';
import { ContactRecipientItem } from './ContactRecipientItem';
import { UnknownRecipientItem } from './UnknownRecipientItem';

type RecipientItemProps = {
  recipient: Recipient;
  addressType: AddressType;
  isSelected: boolean;
};

export const RecipientItem: FC<RecipientItemProps> = ({
  recipient,
  addressType,
  isSelected,
  ...rest
}) => {
  const ItemComponent = {
    account: AccountRecipientItem,
    contact: ContactRecipientItem,
    recent: (_props) => null, // TODO
    unknown: UnknownRecipientItem,
  }[recipient.type];

  return (
    <ItemComponent
      recipient={recipient}
      addressType={addressType}
      isSelected={isSelected}
      {...rest}
    />
  );
};
