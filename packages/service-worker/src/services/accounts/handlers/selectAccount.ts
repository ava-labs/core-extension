import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_SELECT,
  'success',
  [id: string]
>;

@injectable()
export class SelectAccountHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_SELECT as const;

  constructor(private accountsService: AccountsService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const [id] = request.params;

    try {
      await this.accountsService.activateAccount(id);
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
