import { useState } from 'react';
import {
  PlusIcon,
  SearchInput,
  TextButton,
  Typography,
  VerticalFlex,
  Tooltip,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { ContactListItem } from '../components/ContactListItem';
import { t } from 'i18next';

export function ContactList({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { contacts } = useContactsContext();
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
        title={'Address Book'}
        action={
          <Tooltip
            content={<Typography size={12}>{t('Add New Contact')}</Typography>}
          >
            <TextButton
              data-testid="add-contact-plus-button"
              onClick={() => navigateTo(SettingsPages.ADD_CONTACT)}
            >
              <PlusIcon height="18px" color={theme.colors.text1} />
            </TextButton>
          </Tooltip>
        }
      />
      <VerticalFlex padding="16px">
        <SearchInput
          data-testid="contact-search-input"
          placeholder={t('Search')}
          onSearch={setSearchTerm}
          autoFocus={true}
        />
      </VerticalFlex>
      <Scrollbars>
        {filteredContacts.length === 0 && (
          <Typography margin="16px" size={14} as="p" align="center">
            {t('No contacts found')}
          </Typography>
        )}
        {filteredContacts.map((contact, index) => (
          <ContactListItem
            key={contact.id}
            contact={contact}
            navigateTo={navigateTo}
            index={index}
            length={filteredContacts.length}
          />
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
