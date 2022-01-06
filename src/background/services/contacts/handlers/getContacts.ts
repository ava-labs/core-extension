import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { contacts$ } from '../contacts';

export async function getContacts(request: ExtensionConnectionMessage) {
  const contacts = await firstValueFrom(contacts$);

  return {
    ...request,
    result: contacts,
  };
}

export const GetContactsStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.CONTACTS_GET, getContacts];
