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

/**
 * Swap
 **/
export const SWAP_QUERY_TOKENS = {
  from: 'from',
  fromQuery: 'fromQ',
  to: 'to',
  toQuery: 'toQ',
  userAmount: 'userAmount',
  side: 'side',
};
export type SwapQueryTokens = typeof SWAP_QUERY_TOKENS;
export const getSwapPath = (query?: Partial<SwapQueryTokens>) => {
  const pathname = generatePath('/swap');
  const search = new URLSearchParams(query);
  const searchString = search.toString();

  if (!searchString) {
    return pathname;
  }

  return `${pathname}?${searchString}`;
};

/**
 * Bridge
 **/
export const BRIDGE_QUERY_TOKENS = {
  sourceNetwork: 'src',
  targetNetwork: 'dest',
  sourceToken: 'srcT',
  sourceTokenQuery: 'srcTQ',
  amount: 'a',
  transactionId: 'tx',
};
export type BridgeQueryTokens = typeof BRIDGE_QUERY_TOKENS;
export const getBridgePath = (query?: Partial<BridgeQueryTokens>) => {
  const pathname = generatePath('/bridge');

  if (query) {
    Object.keys(query).reduce((acc, key) => {
      acc[BRIDGE_QUERY_TOKENS[key]] = acc[key];
      delete acc[key];
      return acc;
    }, query);
  }

  const search = new URLSearchParams(query);
  return search.size === 0 ? pathname : `${pathname}?${search}`;
};

/**
 * Wallet View
 **/
export const WALLET_VIEW_QUERY_TOKENS = {
  showImportSuccess: 'showImportSuccess',
} as const;
