import {
  ContactsState,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.CONTACTS_GET,
  ContactsState
>;

@injectable()
export class GetContactsHandler implements HandlerType {
  method = ExtensionRequest.CONTACTS_GET as const;

  constructor(private contactsService: ContactsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const contacts = await this.contactsService.getContacts();

    return {
      ...request,
      result: contacts,
    };
  };
}
