import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
@injectable()
export class GetAccountsHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ACCOUNT_GET_ACCOUNTS];

  constructor(private accountsService: AccountsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const accounts = await this.accountsService.getAccounts();

    return {
      ...request,
      result: accounts,
    };
  };
}
