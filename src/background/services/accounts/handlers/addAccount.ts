import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

@injectable()
export class AddAccountHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.ACCOUNT_ADD];

  constructor(private accountsService: AccountsService) {}
  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    try {
      await this.accountsService.addAccount();
    } catch (e: any) {
      return {
        ...request,
        result: 'error',
        error: e.toString(),
      };
    }

    return {
      ...request,
      result: 'success',
    };
  };
}
