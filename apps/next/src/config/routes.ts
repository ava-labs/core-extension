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

/**
 * Send
 **/
export const SEND_QUERY_TOKENS = {
  fromQuery: 'fromQ',
  to: 'to',
  toQuery: 'toQ',
  token: 'token',
  tokenQuery: 'tokenQ',
  amount: 'amount',
};
export type SendQueryTokens = typeof SEND_QUERY_TOKENS;
export const getSendPath = (query?: Partial<SendQueryTokens>) => {
  const pathname = generatePath('/send');
  const search = new URLSearchParams(query);
  const searchString = search.toString();

  if (!searchString) {
    return pathname;
  }

  return `${pathname}?${searchString}`;
};
