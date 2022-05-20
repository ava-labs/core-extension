import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';

@injectable()
export class UpdateContactHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.CONTACTS_UPDATE];

  constructor(private contactsService: ContactsService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [contact] = request.params || [];

    try {
      await this.contactsService.updateContact(contact);
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }

    return {
      ...request,
      result: true,
    };
  };
}
