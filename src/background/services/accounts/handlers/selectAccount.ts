import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

@injectable()
export class SelectAccountHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ACCOUNT_SELECT];

  constructor(private accountsService: AccountsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const selectedIndex = request.params?.pop();

    if (selectedIndex === undefined) {
      return {
        ...request,
        error: 'account index missing in params',
      };
    }

    try {
      await this.accountsService.activateAccount(selectedIndex);
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
