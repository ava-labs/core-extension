import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';
import { ContactsState } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.CONTACTS_GET,
  ContactsState
>;

@injectable()
export class GetContactsHandler implements HandlerType {
  method = ExtensionRequest.CONTACTS_GET as const;

  constructor(private contactsService: ContactsService) {}

  handle: HandlerType['handle'] = async (request) => {
    const contacts = await this.contactsService.getContacts();

    return {
      ...request,
      result: contacts,
    };
  };
}
