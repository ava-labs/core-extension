import {
  AvaxTokenIcon,
  HorizontalFlex,
  SimpleAddress,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled from 'styled-components';
import type { Contact } from '@avalabs/types';
import { BitcoinLogo } from '@src/components/icons/BitcoinLogo';

const ContactName = styled(Typography)`
  max-width: 95%;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledAvaxIcon = styled(AvaxTokenIcon)`
  margin: 0 4px 0 0;
`;

const StyleBitcoinIcon = styled(BitcoinLogo)`
  margin: 0 4px 0 0;
`;

export const ContactInfo = ({ contact }: { contact: Contact }) => {
  return (
    <HorizontalFlex justify="space-between" width={'100%'} align="center">
      <ContactName title={contact.name}>{contact.name}</ContactName>
      <VerticalFlex>
        {contact.address && (
          <HorizontalFlex
            data-testid="contact-li-copy-ava-address"
            align="center"
          >
            <StyledAvaxIcon height="16px" />
            <SimpleAddress address={contact.address} />
          </HorizontalFlex>
        )}
        {contact.addressBTC && (
          <HorizontalFlex
            data-testid="contact-li-copy-btc-address"
            align="center"
          >
            <StyleBitcoinIcon height="16px" />
            <SimpleAddress address={contact.addressBTC} />
          </HorizontalFlex>
        )}
      </VerticalFlex>
    </HorizontalFlex>
  );
};
