import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom } from 'rxjs';
import { contacts$ } from '../contacts';
import { saveContactsToStorage } from '../storage';

export async function removeContact(request: ExtensionConnectionMessage) {
  const [contact] = request.params || [];

  const contacts = await firstValueFrom(contacts$);
  const newContacts = {
    ...contacts,
    contacts: contacts.contacts.filter((c) => c.id !== contact.id),
  };

  const [, err] = await resolve(saveContactsToStorage(newContacts));

  contacts$.next(newContacts);

  if (err) {
    return {
      ...request,
      error: err,
    };
  }

  return {
    ...request,
    result: true,
  };
}

export const RemoveContactStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.CONTACTS_REMOVE, removeContact];
