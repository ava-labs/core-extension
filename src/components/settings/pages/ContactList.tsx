import { useState } from 'react';
import {
  PlusIcon,
  SecondaryDropDownMenuItem,
  SearchInput,
  TextButton,
  Typography,
  VerticalFlex,
  SimpleAddress,
  Tooltip,
  HorizontalSeparator,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';

const AccountName = styled(Typography)`
  max-width: 95%;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text2};
`;

const StyledSecondaryDropDownMenuItem = styled(SecondaryDropDownMenuItem)`
  :hover ${AccountName} {
    color: ${({ theme }) => theme.colors.text1};
  }
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
          <Tooltip content={<Typography size={12}>Add New Contact</Typography>}>
            <TextButton onClick={() => navigateTo(SettingsPages.ADD_CONTACT)}>
              <PlusIcon height="18px" color={theme.colors.text1} />
            </TextButton>
          </Tooltip>
        }
      />
      <VerticalFlex padding="16px">
        <SearchInput
          placeholder="Search"
          onSearch={setSearchTerm}
          autoFocus={true}
        />
      </VerticalFlex>
      <Scrollbars>
        {filteredContacts.length === 0 && (
          <Typography margin="16px" size={14} as="p" align="center">
            No contacts found
          </Typography>
        )}
        {filteredContacts.map((c) => (
          <StyledSecondaryDropDownMenuItem
            key={c.id}
            justify="space-between"
            align="center"
            onClick={() => {
              setEditedContact(c);
              navigateTo(SettingsPages.EDIT_CONTACT);
            }}
            padding="8px 16px 0"
          >
            <VerticalFlex
              align="flex-start"
              justify="space-between"
              width="100%"
            >
              <AccountName title={c.name}>{c.name}</AccountName>
              <SimpleAddress
                copyIconProps={{ color: theme.colors.icon2 }}
                typographyProps={{ color: 'text2' }}
                address={c.address}
              />
              <HorizontalSeparator margin="8px 0 0" />
            </VerticalFlex>
          </StyledSecondaryDropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
