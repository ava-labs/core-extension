import { Contact } from '@avalabs/types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/k2-alpine';

import { useContactsContext } from '@core/ui';

import { Page } from '@/components/Page';
import { getContactsPath } from '@/config/routes';

export const ContactList = () => {
  const { t } = useTranslation();
  const { contacts } = useContactsContext();

  return (
    <Page
      title={t('Contacts')}
      description={
        contacts.length === 1
          ? t('1 saved address')
          : contacts.length > 1
            ? t('{{count}} saved addresses', { count: contacts.length })
            : ''
      }
      withBackButton
    >
      {contacts.length > 0 ? (
        <List contacts={contacts} />
      ) : (
        <ContactsZeroState />
      )}
    </Page>
  );
};

const List = ({ contacts }: { contacts: Contact[] }) => {
  const { push } = useHistory();

  return (
    <Stack>
      {contacts.map((contact) => (
        <Stack
          key={contact.id}
          role="button"
          onClick={() => push(getContactsPath('details', { id: contact.id }))}
        >
          <Typography variant="subtitle1">{contact.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {contact.address}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

const ContactsZeroState = () => {
  const { t } = useTranslation();
  const { push } = useHistory();

  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      gap={2}
      px={5}
      textAlign="center"
    >
      <span style={{ fontSize: 48, lineHeight: 1 }}>📒</span>
      <Typography variant="subtitle1">{t('No saved addresses')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('Save addresses for quick access in future transactions.')}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => push(getContactsPath('add'))}
      >
        {t('Add an address')}
      </Button>
    </Stack>
  );
};
