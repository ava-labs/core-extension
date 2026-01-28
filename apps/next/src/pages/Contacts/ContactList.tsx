import { useTranslation } from 'react-i18next';

import { useContactsContext } from '@core/ui';

import { Page } from '@/components/Page';
import { EmptyContactList, SearchableContactList } from './components';
import { useHistory } from 'react-router-dom';

export const ContactList = () => {
  const { t } = useTranslation();
  const { contacts } = useContactsContext();
	const { goBack } = useHistory();

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
			onBack={() => {
				document.startViewTransition({
					update: () => goBack(),
					types: ['backwards'],
				})
			}}
    >
      {contacts.length > 0 ? (
        <SearchableContactList contacts={contacts} />
      ) : (
        <EmptyContactList
          title={t('No saved addresses')}
          description={t(
            'Save addresses for quick access in future transactions.',
          )}
          icon="📒"
          filteredContacts={false}
        />
      )}
    </Page>
  );
};
