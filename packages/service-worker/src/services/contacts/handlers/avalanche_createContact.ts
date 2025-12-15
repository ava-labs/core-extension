import { DAppRequestHandler, DAppProviderRequest } from '@core/types';

import { canSkipApproval, isContactValid } from '@core/common';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';

@injectable()
export class AvalancheCreateContactHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_CREATE_CONTACT];

  constructor(private contactsService: ContactsService) {
    super();
  }

  handleAuthenticated = async (rpcCall) => {
    const { request } = rpcCall;
    const [contact] = request.params;

    const { valid, reason } = isContactValid(contact);
    if (!valid) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams(reason),
      };
    }

    const canCreate = await canSkipApproval(
      request.site.domain,
      request.site.tabId,
    );

    if (!canCreate) {
      return {
        ...request,
        error: ethErrors.provider.unauthorized(),
      };
    }

    await this.contactsService.addContact({
      ...contact,
      id: crypto.randomUUID(),
    });

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
