import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { contacts$ } from '../contacts';

export async function getContacts(request: ExtensionConnectionMessage) {
  console.log('?&?&?&??$%');
  const contacts = await firstValueFrom(contacts$);
  console.log('?&?&?&??$%');

  return {
    ...request,
    result: true,
  };
}

export const GetContactsStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.CONTACTS_GET, getContacts];
