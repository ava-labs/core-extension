import {
  HorizontalFlex,
  HorizontalSeparator,
  SimpleAddress,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import React from 'react';
import styled from 'styled-components';
import { Contact } from '@src/background/services/contacts/models';

const RowContainer = styled(VerticalFlex)`
  padding: 0 16px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.bg2};
  }
`;

const RowContent = styled(HorizontalFlex)`
  justify-content: space-between;
  align-items: center;
  height: 70px;
  cursor: pointer;
`;

const Name = styled(Typography)`
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 16;
  font-weight: 600;
`;

type AddressDropdownListItemProps = {
  contact: Contact;
  onChange(contact: Contact): void;
};

export const AddressDropdownListItem = ({
  contact,
  onChange,
}: AddressDropdownListItemProps) => {
  return (
    <>
      <RowContainer>
        <RowContent
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onChange(contact);
          }}
        >
          <HorizontalFlex align="center">
            <TokenIcon name={contact.name} />
            <Name margin="0 0 0 16px">{contact.name}</Name>
          </HorizontalFlex>
          <SimpleAddress address={contact.address} />
        </RowContent>
      </RowContainer>
      <div style={{ padding: '0 16px' }}>
        <HorizontalSeparator margin="0" />
      </div>
    </>
  );
};
