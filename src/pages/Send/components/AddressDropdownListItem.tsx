import {
  AvaxTokenIcon,
  HorizontalFlex,
  HorizontalSeparator,
  SimpleAddress,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import styled, { useTheme } from 'styled-components';
import type { Contact } from '@avalabs/types';
import { BitcoinLogo } from '@src/components/icons/BitcoinLogo';

const RowContainer = styled(VerticalFlex)`
  padding: 16px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.bg2};

    > ${Typography} {
      color: ${({ theme }) => theme.colors.text1};
    }
  }
`;

const StyledAvaxIcon = styled(AvaxTokenIcon)`
  margin: 0 4px 0 0;
`;

const StyleBitcoinIcon = styled(BitcoinLogo)`
  margin: 0 4px 0 0;
`;

const ContactName = styled(Typography)`
  max-width: 95%;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

type AddressDropdownListItemProps = {
  contact: Contact;
  selectedContact?: Contact;
  onChange(contact: Contact): void;
};

export const AddressDropdownListItem = ({
  contact,
  selectedContact,
  onChange,
}: AddressDropdownListItemProps) => {
  const theme = useTheme();
  const color =
    selectedContact?.address.toLowerCase() === contact.address.toLowerCase()
      ? theme.colors.text1
      : theme.colors.text2;

  return (
    <>
      <RowContainer
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onChange(contact);
        }}
      >
        <VerticalFlex data-testid="send-address-list-item" align="flex-start" justify="space-between" width="100%">
          <HorizontalFlex justify="space-between" width={'100%'} align="center">
            <ContactName color={color} title={contact.name}>
              {contact.name}
            </ContactName>
            <VerticalFlex>
              {contact.address && (
                <HorizontalFlex align="center">
                  <StyledAvaxIcon height="16px" />
                  <SimpleAddress address={contact.address} />
                </HorizontalFlex>
              )}
              {contact.addressBTC && (
                <HorizontalFlex align="center">
                  <StyleBitcoinIcon height="16px" />
                  <SimpleAddress address={contact.addressBTC} />
                </HorizontalFlex>
              )}
            </VerticalFlex>
          </HorizontalFlex>
        </VerticalFlex>
      </RowContainer>
      <div style={{ padding: '0 16px' }}>
        <HorizontalSeparator margin="0" />
      </div>
    </>
  );
};
