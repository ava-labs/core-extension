import { DAppRequestHandler, DAppProviderRequest } from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';
import { canSkipApproval } from '@core/common';

@injectable()
export class AvalancheRemoveContactHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_REMOVE_CONTACT];

  constructor(private contactsService: ContactsService) {
    super();
  }

  handleAuthenticated = async (rpcCall) => {
    const { request } = rpcCall;
    const [contact] = request.params;

    const { contacts } = await this.contactsService.getContacts();

    const existing = contacts.find((c) => c.id === contact.id);

    if (!existing) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams('contact not found'),
      };
    }

    const canRemove = await canSkipApproval(
      request.site.domain,
      request.site.tabId,
    );

    if (!canRemove) {
      return {
        ...request,
        error: ethErrors.provider.unauthorized(),
      };
    }

    await this.contactsService.remove(contact);

    return {
      ...request,
      result: null,
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };
}
