import {
  HorizontalFlex,
  HorizontalSeparator,
  SimpleAddress,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Contact } from '@src/background/services/contacts/models';

const RowContainer = styled(VerticalFlex)`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.bg2};
  }
`;

const StyledSimpleAddress = styled(SimpleAddress)`
  flex-direction: row-reverse;
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
        <Typography size={14} color={color}>
          {contact.name}
        </Typography>
        <HorizontalFlex marginTop="2px">
          <StyledSimpleAddress
            address={contact.address}
            typographyProps={{
              size: 12,
              height: '15px',
              color: theme.colors.text2,
              margin: '0 8px 0 0',
            }}
            copyIconProps={{
              height: '12px',
              color,
            }}
          />
        </HorizontalFlex>
      </RowContainer>
      <div style={{ padding: '0 16px' }}>
        <HorizontalSeparator margin="0" />
      </div>
    </>
  );
};
