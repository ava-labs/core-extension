import { Contact } from '@avalabs/types';

const QUERYABLE_FIELDS = [
  'name',
  'address',
  'addressXP',
  'addressBTC',
  'addressSVM',
] as const satisfies (keyof Contact)[];

export const searchContacts = (contacts: Contact[], query: string) => {
  return contacts.filter((contact) =>
    QUERYABLE_FIELDS.some((field) =>
      contact[field]?.toLowerCase().includes(query?.toLowerCase() ?? ''),
    ),
  );
};
