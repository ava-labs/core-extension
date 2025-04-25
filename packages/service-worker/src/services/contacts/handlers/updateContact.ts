import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { ContactsService } from '../ContactsService';
import type { Contact } from '@avalabs/types';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.CONTACTS_UPDATE,
  true,
  [Contact]
>;

@injectable()
export class UpdateContactHandler implements HandlerType {
  method = ExtensionRequest.CONTACTS_UPDATE as const;

  constructor(private contactsService: ContactsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [contact] = request.params;

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
