import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_DELETE,
  'success' | 'error',
  [ids: string[]]
>;

@injectable()
export class DeleteAccountHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_DELETE as const;

  constructor(private accountsService: AccountsService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [ids] = request.params ?? [];

    try {
      await this.accountsService.deleteAccounts(ids);
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
