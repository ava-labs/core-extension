import { useTranslation } from 'react-i18next';

import { useContactsContext } from '@core/ui';

import { Page } from '@/components/Page';
import { EmptyContactList, SearchableContactList } from './components';

export const ContactList = () => {
  const { t } = useTranslation();
  const { contacts } = useContactsContext();

  return (
    <Page
      data-testid="contacts-list-page"
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
        <SearchableContactList contacts={contacts} />
      ) : (
        <EmptyContactList />
      )}
    </Page>
  );
};
