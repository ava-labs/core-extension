import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';

import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import {
  DAppProviderRequest,
  type JsonRpcRequestParams,
} from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { canSkipApproval } from '@src/utils/canSkipApproval';

import type { Action } from '../../actions/models';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../AccountsService';
import type { ImportedAccount, PrimaryAccount } from '../models';
import { isPrimaryAccount } from '../utils/typeGuards';

type PrimaryWalletAccounts = {
  [walletId: string]: PrimaryAccount[];
};

export type DeleteAccountsDisplayData = {
  primary: PrimaryWalletAccounts;
  imported: ImportedAccount[];
  wallet: {
    [walletId: string]: string;
  };
};

type Params = [accountIds: string[]];

@injectable()
export class AvalancheDeleteAccountsHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.ACCOUNTS_DELETE];

  constructor(
    private accountsService: AccountsService,
    private secretsService: SecretsService,
  ) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request, scope } = rpcCall;
    const [accountIds] = request.params;

    if (!request.site?.domain || !request.site?.tabId) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing dApp domain information',
        }),
      };
    }

    const primaryWalletAccounts: PrimaryWalletAccounts = {};
    const importedAccounts: ImportedAccount[] = [];

    // Getting accounts by ids from params and organizing
    for (const accountId of accountIds) {
      const account = this.accountsService.getAccountByID(accountId);
      if (account) {
        if (isPrimaryAccount(account)) {
          if (primaryWalletAccounts[account.walletId]) {
            primaryWalletAccounts[account.walletId]?.push(account);
          } else {
            primaryWalletAccounts[account.walletId] = [account];
          }
        } else {
          importedAccounts.push(account);
        }
      }
    }

    if (
      !Object.keys(primaryWalletAccounts).length &&
      !importedAccounts.length
    ) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'No account with specified IDs',
        }),
      };
    }

    //Validating to ensure that the accounts to be deleted has the latest index in the wallet
    for (const [walletId, accountsInWallet] of Object.entries(
      primaryWalletAccounts,
    )) {
      //Sort in descending order by index
      accountsInWallet.sort((a, b) => b.index - a.index);
      const walletAccounts =
        this.accountsService.getPrimaryAccountsByWalletId(walletId);
			
      // This should not happen in normal cases. But need it to satisfy typescript
      if (!walletAccounts || !walletAccounts.length) {
        return {
          ...request,
          error: ethErrors.rpc.invalidParams({
            message: 'Unable to find the account',
          }),
        };
      }

      for (let i = 0; i < accountsInWallet.length; i++) {
        const accountToDelete = accountsInWallet[i];
        const accountInWallet = walletAccounts[walletAccounts.length - 1 - i];
        if (
          !accountToDelete ||
          !accountInWallet ||
          accountToDelete.id !== accountInWallet.id
        ) {
          return {
            ...request,
            error: ethErrors.rpc.invalidParams({
              message: 'Only the last account of the wallet can be removed',
            }),
          };
        }
      }
      //Sort in ascending order by index
      accountsInWallet.sort((a, b) =>  a.index -b.index);
    }

    if (await canSkipApproval(request.site.domain, request.site.tabId)) {
      const allPrimaryAccounts = Object.values(primaryWalletAccounts).flat();
      const allAccount = [...allPrimaryAccounts, ...importedAccounts];
      const allAccountIds = allAccount.map((account) => account.id);
      try {
        await this.accountsService.deleteAccounts(allAccountIds);

        return {
          ...request,
          result: null,
        };
      } catch {
        return {
          ...request,
          error: ethErrors.rpc.internal('Account removing failed'),
        };
      }
    }

    // Getting the wallet names
    const walletNames: Record<string, string> = {};
    const primaryWallets = await this.secretsService.getPrimaryWalletsDetails();

    for (const walletId of Object.keys(primaryWalletAccounts)) {
      const primaryWallet = primaryWallets.find(
        (wallet) => wallet.id === walletId,
      );

      if (primaryWallet?.name) {
        walletNames[walletId] = primaryWallet.name;
      }
    }

    const actionData: Action<{
      accounts: DeleteAccountsDisplayData;
    }> = {
      ...request,
      scope,
      displayData: {
        accounts: {
          primary: primaryWalletAccounts,
          imported: importedAccounts,
          wallet: walletNames,
        },
      },
    };

    await openApprovalWindow(actionData, 'deleteAccounts');

    return {
      ...request,
      result: DEFERRED_RESPONSE,
    };
  };

  handleUnauthenticated = async ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action<{
      accounts: DeleteAccountsDisplayData;
    }>,
    _,
    onSuccess,
    onError,
  ) => {
    try {
      const { primary, imported } = pendingAction.displayData.accounts;
      const allPrimaryAccounts = Object.values(primary).flat();
      const allAccount = [...allPrimaryAccounts, ...imported];
      const allAccountIds = allAccount.map((account) => account.id);

      await this.accountsService.deleteAccounts(allAccountIds);

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
