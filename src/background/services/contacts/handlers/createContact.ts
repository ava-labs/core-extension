import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';
import type { Contact } from '@avalabs/types';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.CONTACTS_CREATE,
  true,
  [Contact]
>;

@injectable()
export class CreateContactHandler implements HandlerType {
  method = ExtensionRequest.CONTACTS_CREATE as const;

  constructor(private contactsService: ContactsService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [contact] = request.params;

    if (
      !contact ||
      !contact.name ||
      (!contact.address && !contact.addressBTC && !contact.addressXP) ||
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
