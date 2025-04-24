import {
	Action,
  DAppRequestHandler,
  DAppProviderRequest,
  DEFERRED_RESPONSE,
} from '@core/types';
import { isContactValid } from '@core/utils';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';
import { openApprovalWindow } from '@/runtime/openApprovalWindow';

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

    const { contacts } = await this.contactsService.getContacts();

    const existing = contacts.find((c) => c.id === contact.id);

    const actionData = {
      ...request,
      displayData: {
        existing,
        contact,
      },
    };
    await openApprovalWindow(actionData, `approve/updateContact`);
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
      await this.contactsService.updateContact(contact);
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
