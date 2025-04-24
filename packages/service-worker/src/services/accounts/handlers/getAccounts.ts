import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
import { Accounts } from '../models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_GET_ACCOUNTS,
  Accounts
>;

@injectable()
export class GetAccountsHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_GET_ACCOUNTS as const;

  constructor(private accountsService: AccountsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const accounts = this.accountsService.getAccounts();

    return {
      ...request,
      result: accounts,
    };
  };
}
