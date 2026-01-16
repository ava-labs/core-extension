import {
  Button,
  Divider,
  PopoverItem,
  Stack,
  styled,
} from '@avalabs/k2-alpine';
import debounce from 'lodash.debounce';
import { Contact } from '@avalabs/types';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import {
  ContactQueryTokens,
  CONTACTS_QUERY_TOKENS,
  getContactsPath,
} from '@/config/routes';
import { Card } from '@/components/Card';
import { DropdownMenu } from '@/components/DropdownMenu';

import { searchContacts } from '../lib/searchContacts';
import { SearchField } from './SearchField';
import { ContactListItem } from './ContactListItem';
import { EmptyContactList } from './EmptyContactList';

type SortMode = 'asc' | 'desc';
type ListProps = {
  contacts: Contact[];
};

export const SearchableContactList: FC<ListProps> = ({ contacts }) => {
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

  const updateQueryParam = useMemo(
    () =>
      debounce(
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
        250,
      ),
    [replace],
  );

  return (
    <Stack width="100%" flexGrow={1} gap={1.5}>
      <SearchField
        autoFocus
        placeholder={t('Search')}
        size="small"
        defaultValue={query}
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
        <EmptyContactList
          title={t('Not Found')}
          description={t('No contacts match your search')}
          icon="🔍"
          filteredContacts={true}
        />
      )}
    </Stack>
  );
};

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  marginRight: theme.spacing(2),
  marginBlock: theme.spacing(1),
}));
