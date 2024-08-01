import { ChangeEvent, useState } from 'react';
import { SettingsPageProps, SettingsPages } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useContactsContext } from '@src/contexts/ContactsProvider';
import { ContactListItem } from '../components/ContactListItem';
import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  Scrollbars,
  Tooltip,
  PlusIcon,
  IconButton,
  List,
  SearchBar,
} from '@avalabs/core-k2-components';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

export function ContactList({ goBack, navigateTo, width }: SettingsPageProps) {
  const { t } = useTranslation();
  const { contacts } = useContactsContext();
  const { capture } = useAnalyticsContext();
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
    <Stack width={width} sx={{ height: '100%' }}>
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Address Book')}
        action={
          <Tooltip title={t('New Contact')}>
            <IconButton
              data-testid="add-contact-plus-button"
              onClick={() => {
                capture('AddContactClicked');
                navigateTo(SettingsPages.ADD_CONTACT);
              }}
            >
              <PlusIcon size="24" />
            </IconButton>
          </Tooltip>
        }
      />
      <Stack sx={{ p: 2 }}>
        <SearchBar
          data-testid="contact-search-input"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          autoFocus={true}
        />
      </Stack>
      <Scrollbars>
        {filteredContacts.length === 0 && (
          <Stack sx={{ alignContent: 'center', mt: 12 }}>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 1 }}>
              {t('No Contacts Saved')}
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            >
              {t('Hit the + to add a new contact')}
            </Typography>
          </Stack>
        )}
        <List>
          {filteredContacts.map((contact, index) => (
            <ContactListItem
              key={contact.id}
              contact={contact}
              navigateTo={navigateTo}
              index={index}
              length={filteredContacts.length}
            />
          ))}
        </List>
      </Scrollbars>
    </Stack>
  );
}
