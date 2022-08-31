import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';
@injectable()
export class AvalancheGetContactsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_CONTACTS];

  constructor(private contactsService: ContactsService) {
    super();
  }

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
