import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';
@injectable()
export class AvalancheGetContactsHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_CONTACTS];

  constructor(private contactsService: ContactsService) {}

  handleAuthenticated = async (request) => {
    const contacts = await this.contactsService.getContacts();

    return {
      ...request,
      result: contacts.contacts,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
