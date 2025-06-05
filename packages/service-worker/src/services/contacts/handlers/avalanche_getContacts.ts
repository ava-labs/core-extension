import { DAppRequestHandler, DAppProviderRequest } from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';
@injectable()
export class AvalancheGetContactsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_CONTACTS];

  constructor(private contactsService: ContactsService) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    const contacts = await this.contactsService.getContacts();

    return {
      ...request,
      result: contacts.contacts,
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };
}
