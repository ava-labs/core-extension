import { useState } from 'react';
import {
  PlusIcon,
  DropDownMenuItem,
  SearchInput,
  TextButton,
  Typography,
  VerticalFlex,
  SimpleAddress,
  HorizontalFlex,
  Tooltip,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';

const DropDownMenuItemWithBorder = styled(DropDownMenuItem)`
  border-bottom: solid 1px ${({ theme }) => theme.colors.stroke1};
`;

const AccountName = styled(Typography)`
  line-height: 1.2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export function ContactList({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { contacts, setEditedContact } = useContactsContext();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredContacts = contacts
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) // sort alphabetically
    .filter(
      (c) =>
        !searchTerm ||
        c.address.toLowerCase().includes(searchTerm) ||
        c.name.toLowerCase().includes(searchTerm)
    );

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Address book'}
        action={
          <Tooltip content={<Typography size={14}>Add New Contact</Typography>}>
            <TextButton
              margin="0 4px 0 0"
              onClick={() => navigateTo(SettingsPages.ADD_CONTACT)}
            >
              <PlusIcon height="20px" color={theme.colors.text1} />
            </TextButton>
          </Tooltip>
        }
      />
      <VerticalFlex padding="16px 22px">
        <SearchInput
          placeholder="Search contacts"
          onSearch={setSearchTerm}
          autoFocus={true}
        />
      </VerticalFlex>
      <Scrollbars>
        {filteredContacts.length === 0 && (
          <Typography margin="16px" as="p" align="center" color="text2">
            No contacts found
          </Typography>
        )}
        {filteredContacts.map((c) => (
          <DropDownMenuItemWithBorder
            key={c.id}
            justify="space-between"
            align="center"
            onClick={() => {
              setEditedContact(c);
              navigateTo(SettingsPages.EDIT_CONTACT);
            }}
          >
            <HorizontalFlex align="center" justify="space-between" width="100%">
              <AccountName width="140px" title={c.name}>
                {c.name}
              </AccountName>
              <SimpleAddress address={c.address} />
            </HorizontalFlex>
          </DropDownMenuItemWithBorder>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
