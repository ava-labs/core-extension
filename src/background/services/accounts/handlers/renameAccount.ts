import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_RENAME,
  'success',
  [id: string, name: string]
>;

@injectable()
export class RenameAccountHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_RENAME as const;

  constructor(private accountsService: AccountsService) {}
  handle: HandlerType['handle'] = async (request) => {
    const [id, name] = request.params;

    try {
      await this.accountsService.setAccountName(id, name);
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
