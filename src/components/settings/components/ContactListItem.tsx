import {
  ComponentSize,
  HorizontalFlex,
  HorizontalSeparator,
  PencilIcon,
  SecondaryDropDownMenuItem,
  SimpleAddress,
  TextButton,
  TrashIcon,
  Typography,
  VerticalFlex,
  WordInput,
} from '@avalabs/react-components';
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { Contact } from '@src/background/services/contacts/models';

interface ContactListItemProps {
  contact: Contact;
  onEdit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contact: Contact
  ) => void;
  onSave: (e: React.UIEvent, contact: Contact) => void;
  isEditing: boolean;
  onDelete: () => void;
}

const ContactName = styled(Typography)`
  max-width: 95%;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text2};
`;

const ContactNameInput = styled(WordInput)`
  border: none;
  width: 150px;
  background-color: ${({ theme }) => `${theme.colors.bg1}`};
  height: 27px;
  padding: 6px;
  color: ${({ theme }) => `${theme.colors.text2}`};

  > input {
    font-size: 12px;
  }

  &:focus-within {
    border: none;
  }
`;

const StyledSecondaryDropDownMenuItem = styled(SecondaryDropDownMenuItem)`
  :hover ${ContactName} {
    color: ${({ theme }) => theme.colors.text1};
  }
`;

export const ContactListItem = ({
  contact,
  onEdit,
  isEditing,
  onSave,
  onDelete,
}: ContactListItemProps) => {
  const theme = useTheme();
  const [contactName, setContactName] = useState(contact.name);

  return (
    <StyledSecondaryDropDownMenuItem
      justify="space-between"
      align="center"
      padding="8px 16px 0"
    >
      <VerticalFlex align="flex-start" justify="space-between" width="100%">
        <HorizontalFlex
          justify="space-between"
          width={isEditing ? '100%' : 'auto'}
        >
          {isEditing ? (
            <>
              <HorizontalFlex>
                <ContactNameInput
                  value={contactName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setContactName(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onSave(e, { ...contact, name: contactName });
                    }
                  }}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  autoFocus
                />
                <TextButton
                  size={ComponentSize.SMALL}
                  margin="0 0 0 8px"
                  onClick={(e) =>
                    onSave(e, {
                      ...contact,
                      name: contactName,
                    })
                  }
                >
                  Save
                </TextButton>
              </HorizontalFlex>
              <HorizontalFlex>
                <TextButton onClick={onDelete} margin="0 0 0 8px">
                  <TrashIcon color={theme.colors.icon1} height="14px" />
                </TextButton>
              </HorizontalFlex>
            </>
          ) : (
            <>
              <ContactName title={contact.name}>{contact.name}</ContactName>
              <TextButton
                onClick={(e) => onEdit(e, contact)}
                margin="0 0 0 8px"
              >
                <PencilIcon color={theme.colors.icon1} height="12px" />
              </TextButton>
            </>
          )}
        </HorizontalFlex>
        <SimpleAddress
          copyIconProps={{ color: theme.colors.icon2 }}
          typographyProps={{ color: 'text2' }}
          address={contact.address}
        />
        <HorizontalSeparator margin="8px 0 0" />
      </VerticalFlex>
    </StyledSecondaryDropDownMenuItem>
  );
};
