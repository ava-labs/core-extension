import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { LockService } from '../LockService';
import { AccountsService } from '~/services/accounts/AccountsService';
import {
  ACCOUNTS_ADDED_KEY,
  addAllAccountsWithHistory,
} from '~/services/accounts/utils/addAllAccountsWithHistory';
import { StorageService } from '~/services/storage/StorageService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.UNLOCK_WALLET,
  true,
  [password: string]
>;

@injectable()
export class UnlockWalletHandler implements HandlerType {
  method = ExtensionRequest.UNLOCK_WALLET as const;

  constructor(
    private lockService: LockService,
    private accountsService: AccountsService,
    private storageService: StorageService,
  ) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [password] = request.params;

    const [, err] = await resolve(this.lockService.unlock(password));

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    const accounts = await this.accountsService.getAccounts();
    const walletIds = Object.keys(accounts.primary);

    const hasAccountsAdded =
      await this.storageService.loadUnencrypted(ACCOUNTS_ADDED_KEY);
    if (!hasAccountsAdded) {
      for (const walletId of walletIds) {
        const lastIndex = accounts.primary[walletId]?.length;
        await addAllAccountsWithHistory({
          walletId,
          lastIndex,
        });
      }
      await this.storageService.saveUnencrypted(ACCOUNTS_ADDED_KEY, true);
    }

    return {
      ...request,
      result: true,
    };
  };
}
