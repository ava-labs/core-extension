import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

@injectable()
export class RenameAccountHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ACCOUNT_RENAME];

  constructor(private accountsService: AccountsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [index, name] = request.params || [];

    if (index === undefined) {
      return {
        ...request,
        error: 'account index missing in params',
      };
    }

    if (!name) {
      return {
        ...request,
        error: 'account name missing in params',
      };
    }

    try {
      await this.accountsService.setAccountName(index, name);
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }

    return {
      ...request,
      result: 'success',
    };
  };
}
