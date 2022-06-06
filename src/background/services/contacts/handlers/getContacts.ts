import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';

@injectable()
export class GetContactsHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.CONTACTS_GET];

  constructor(private contactsService: ContactsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const contacts = await this.contactsService.getContacts();

    return {
      ...request,
      result: contacts,
    };
  };
}
