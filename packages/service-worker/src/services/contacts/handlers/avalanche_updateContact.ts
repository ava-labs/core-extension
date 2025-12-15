import { DAppRequestHandler, DAppProviderRequest } from '@core/types';
import { canSkipApproval, isContactValid } from '@core/common';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';

@injectable()
export class AvalancheUpdateContactHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_UPDATE_CONTACT];

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

    // We're only allowing contacts to be updated if the request comes from a Core suite app.
    const canUpdate = await canSkipApproval(
      request.site.domain,
      request.site.tabId,
    );

    if (!canUpdate) {
      return {
        ...request,
        error: ethErrors.provider.unauthorized(),
      };
    }

    await this.contactsService.updateContact(contact);

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
