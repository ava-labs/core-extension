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
  switch (recipient.type) {
    case 'account': {
      return (
        <AccountRecipientItem
          recipient={recipient}
          addressType={addressType}
          isSelected={isSelected}
          {...rest}
        />
      );
    }
    case 'contact': {
      return (
        <ContactRecipientItem
          recipient={recipient}
          addressType={addressType}
          isSelected={isSelected}
          {...rest}
        />
      );
    }
    case 'unknown': {
      return (
        <UnknownRecipientItem
          recipient={recipient}
          addressType={addressType}
          isSelected={isSelected}
          {...rest}
        />
      );
    }
  }
};
