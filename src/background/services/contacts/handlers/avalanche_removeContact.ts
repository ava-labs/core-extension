import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { ContactsService } from '../ContactsService';

@injectable()
export class AvalancheRemoveContactHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_REMOVE_CONTACT];

  constructor(private contactsService: ContactsService) {
    super();
  }

  handleAuthenticated = async (request) => {
    const [contact] = request.params;

    const { contacts } = await this.contactsService.getContacts();

    const existing = contacts.find((c) => c.id === contact.id);

    if (!existing) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams('contact not found'),
      };
    }
    const actionData = {
      ...request,
      tabId: request.site.tabId,
      displayData: {
        contact: existing,
      },
    };
    await this.openApprovalWindow(
      actionData,
      `approve/removeContact?id=${request.id}`
    );
    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError
  ) => {
    try {
      const {
        displayData: { contact },
      } = pendingAction;
      await this.contactsService.remove(contact);
      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
