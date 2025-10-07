import {
  Accounts,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
// import { SecretsService } from '~/services/secrets/SecretsService';
import { addAllAccountsWithHistory } from '../utils/addAllAccountsWithHistory';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ACCOUNT_GET_ACCOUNTS,
  Accounts
>;

@injectable()
export class GetAccountsHandler implements HandlerType {
  method = ExtensionRequest.ACCOUNT_GET_ACCOUNTS as const;

  constructor(private accountsService: AccountsService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const accounts = await this.accountsService.getAccounts();

    const walletIds = Object.keys(accounts.primary);

    for (const walletId of walletIds) {
      const lastIndex = accounts.primary[walletId]?.length;
      addAllAccountsWithHistory({
        walletId,
        lastIndex,
      });
    }

    return {
      ...request,
      result: accounts,
    };
  };
}
