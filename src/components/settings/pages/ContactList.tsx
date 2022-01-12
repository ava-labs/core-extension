import { useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  DropDownMenuItem,
  SearchInput,
  TextButton,
  toast,
  TrashIcon,
  Typography,
  VerticalFlex,
  HorizontalFlex,
  Tooltip,
  PrimaryAddress,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import Scrollbars from 'react-custom-scrollbars';
import { useContactsContext } from '@src/contexts/ContactsProvider';

const PrimaryAddressWithMargin = styled(PrimaryAddress)`
  width: 100%;
  margin-right: 10px;
`;

export function ContactList({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { contacts, setEditedContact, removeContact } = useContactsContext();
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
        title={'Contact List'}
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
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {filteredContacts.length === 0 && (
          <Typography margin="16px" as="p" align="center" color="text2">
            No contacts found
          </Typography>
        )}
        {filteredContacts.map((c) => (
          <DropDownMenuItem
            key={c.address}
            justify="space-between"
            align="center"
          >
            <VerticalFlex width="100%">
              <Typography margin="0 0 4px 0">{c.name}</Typography>
              <HorizontalFlex justify="space-between">
                <PrimaryAddressWithMargin
                  //name={c.name}
                  address={c.address}
                />

                <HorizontalFlex>
                  <Tooltip
                    content={<Typography size={12}>Edit contact</Typography>}
                  >
                    <TextButton
                      margin="0 8px 0 0"
                      onClick={() => {
                        setEditedContact(c);
                        navigateTo(SettingsPages.EDIT_CONTACT);
                      }}
                    >
                      <PencilIcon height="16px" color={theme.colors.icon1} />
                    </TextButton>
                  </Tooltip>

                  <Tooltip
                    content={<Typography size={12}>Remove contact</Typography>}
                  >
                    <TextButton
                      onClick={() => {
                        removeContact(c);
                        toast.success('Contact removed!');
                      }}
                    >
                      <TrashIcon height="16px" color={theme.colors.icon1} />
                    </TextButton>
                  </Tooltip>
                </HorizontalFlex>
              </HorizontalFlex>
            </VerticalFlex>
          </DropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
