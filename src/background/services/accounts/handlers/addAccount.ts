import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_ADD,
  'success' | 'error'
>;

@injectable()
export class AddAccountHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_ADD as const;

  constructor(private accountsService: AccountsService) {}

  handle: HandlerType['handle'] = async (request) => {
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
