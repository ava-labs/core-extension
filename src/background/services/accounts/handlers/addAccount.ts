import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
import { ImportData } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_ADD,
  string | undefined,
  [name?: string, importData?: ImportData]
>;

@injectable()
export class AddAccountHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_ADD as const;

  constructor(private accountsService: AccountsService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [name, importData] = request.params ?? [];

    try {
      const id = await this.accountsService.addAccount(name, importData);

      return {
        ...request,
        result: id,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
