import { generatePath } from 'react-router-dom';

/**
 * Contacts
 **/
type ContactView = 'list' | 'details' | 'remove' | 'add';
type ContactQueryToken = 'id' | 'search';

export const CONTACTS_QUERY_TOKENS: Record<ContactQueryToken, string> = {
  id: 'id',
  search: 'search',
};
export const getContactsPath = (
  view?: ContactView,
  query?: Partial<Record<ContactQueryToken, string>>,
) => {
  const pathname = generatePath('/contacts/:view?', { view });
  const search = new URLSearchParams(query);
  const searchString = search.toString();

  if (!searchString) {
    return pathname;
  }

  return `${pathname}?${searchString}`;
};
