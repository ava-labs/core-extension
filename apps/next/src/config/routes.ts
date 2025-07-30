import { generatePath } from 'react-router-dom';

/**
 * Contacts
 **/
export const CONTACTS_QUERY_TOKENS = {
  id: 'id',
  search: 'q',
  sort: 's',
};
export type ContactQueryTokens = typeof CONTACTS_QUERY_TOKENS;
export const getContactsPath = (
  view?: 'list' | 'details' | 'remove' | 'add',
  query?: Partial<ContactQueryTokens>,
) => {
  const pathname = generatePath('/contacts/:view?', { view });
  const search = new URLSearchParams(query);
  const searchString = search.toString();

  if (!searchString) {
    return pathname;
  }

  return `${pathname}?${searchString}`;
};
