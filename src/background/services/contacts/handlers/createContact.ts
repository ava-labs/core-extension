import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';

@injectable()
export class CreateContactHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.CONTACTS_CREATE];

  constructor(private contactsService: ContactsService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [contact] = request.params || [];

    if (
      !contact ||
      !contact.name ||
      (!contact.address && !contact.addressBTC) ||
      !contact.id
    ) {
      return {
        ...request,
        error: 'contact name, address or id missing',
      };
    }
    try {
      await this.contactsService.addContact(contact);
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
