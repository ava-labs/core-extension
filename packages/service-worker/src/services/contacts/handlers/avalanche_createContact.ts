import {
  Action,
  DAppRequestHandler,
  DAppProviderRequest,
  DEFERRED_RESPONSE,
} from '@core/types';

import { isContactValid } from '@core/common';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';

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

    // Generate random id
    contact.id = crypto.randomUUID();

    const actionData = {
      ...request,
      displayData: {
        contact,
      },
    };
    await openApprovalWindow(actionData, `approve/createContact`);
    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action,
    _result,
    onSuccess,
    onError,
  ) => {
    try {
      const {
        displayData: { contact },
      } = pendingAction;
      await this.contactsService.addContact(contact);
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
