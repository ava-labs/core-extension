import {
  Button,
  Divider,
  PopoverItem,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { Contact } from '@avalabs/types';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { useContactsContext } from '@core/ui';

import {
  ContactQueryTokens,
  CONTACTS_QUERY_TOKENS,
  getContactsPath,
} from '@/config/routes';
import { Page } from '@/components/Page';
import { Card } from '@/components/Card';
import { DropdownMenu } from '@/components/DropdownMenu';

import { SearchField } from './components/SearchField';
import { ContactListItem } from './components/ContactListItem';
import { searchContacts } from './lib/searchContacts';

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
      {contacts.length > 0 ? <List contacts={contacts} /> : <EmptyList />}
    </Page>
  );
};

type SortMode = 'asc' | 'desc';

const List = ({ contacts }: { contacts: Contact[] }) => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const { push, replace } = useHistory();

  const searchParams = new URLSearchParams(search);
  const query = searchParams.get(CONTACTS_QUERY_TOKENS.search);
  const sortMode = (searchParams.get(CONTACTS_QUERY_TOKENS.sort) ??
    'asc') as SortMode;

  const sortedContacts = useMemo(
    () =>
      contacts.toSorted((a, b) =>
        sortMode === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      ),
    [contacts, sortMode],
  );

  const filteredContacts = useMemo(
    () =>
      query?.trim() ? searchContacts(sortedContacts, query) : sortedContacts,
    [sortedContacts, query],
  );

  const updateQueryParam = useCallback(
    (
      current: URLSearchParams,
      key: keyof ContactQueryTokens,
      value: string,
    ) => {
      const updated = new URLSearchParams(current);
      updated.set(CONTACTS_QUERY_TOKENS[key], value);

      replace({
        pathname: getContactsPath('list'),
        search: updated.toString(),
      });
    },
    [replace],
  );

  return (
    <Stack width="100%" flexGrow={1} gap={1.5}>
      <SearchField
        autoFocus
        placeholder={t('Search')}
        size="small"
        value={query}
        onChange={(e) =>
          updateQueryParam(searchParams, 'search', e.target.value.trim())
        }
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DropdownMenu label={t('Sort')}>
          <PopoverItem
            onClick={() => updateQueryParam(searchParams, 'sort', 'asc')}
            selected={sortMode === 'asc'}
          >
            {t('Name A to Z')}
          </PopoverItem>
          <PopoverItem
            onClick={() => updateQueryParam(searchParams, 'sort', 'desc')}
            selected={sortMode === 'desc'}
          >
            {t('Name Z to A')}
          </PopoverItem>
        </DropdownMenu>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={() => push(getContactsPath('add'))}
        >
          {t('Add an address')}
        </Button>
      </Stack>
      {filteredContacts.length > 0 ? (
        <Card>
          <Stack py={1} divider={<StyledDivider />}>
            {filteredContacts.map((contact) => (
              <ContactListItem
                key={contact.id}
                contact={contact}
                onClick={() =>
                  push(
                    getContactsPath('details', {
                      id: contact.id,
                    }),
                  )
                }
              />
            ))}
          </Stack>
        </Card>
      ) : (
        <EmptyList />
      )}
    </Stack>
  );
};

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  marginRight: theme.spacing(2),
  marginBlock: theme.spacing(1),
}));

const EmptyList = () => {
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
