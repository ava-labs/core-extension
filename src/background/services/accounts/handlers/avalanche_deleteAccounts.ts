import { injectable } from 'tsyringe';
import { ethErrors } from 'eth-rpc-errors';

import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { canSkipApproval } from '@src/utils/canSkipApproval';

import { AccountsService } from '../AccountsService';
import { Action } from '../../actions/models';
import { ImportedAccount, PrimaryAccount } from '../models';
import { isPrimaryAccount } from '../utils/typeGuards';
import { SecretsService } from '../../secrets/SecretsService';

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
    private secretsService: SecretsService
  ) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>
  ) => {
    const { request, scope } = rpcCall;
    const [accountIds] = request.params;

    //TODO DELETE THIS
    accountIds.unshift('1d6ad089-52b3-40b9-a3e5-ac5a970ba063');
    accountIds.push('75b6b83d-2836-4997-a21f-3ee42f8e6a38');

    if (!request.site?.domain || !request.site?.tabId) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing dApp domain information',
        }),
      };
    }
    console.log({ accountIds });

    const currentAccounts = this.accountsService.getAccounts();
    console.log({ currentAccounts });

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

    //Checking if the accounts to be deleted has the latest index
    for (const [walletId, accountsInWallet] of Object.entries(
      primaryWalletAccounts
    )) {
      console.log(`${walletId}: ${accountsInWallet}`);
      accountsInWallet.sort((a, b) => b.index - a.index);
      console.log({ sorted: accountsInWallet });

      const walletAccounts =
        this.accountsService.getPrimaryAccountsByWalletId(walletId);
      console.log({ walletAccounts });

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
    }

    //TODO Uncomment this block
    // if (await canSkipApproval(request.site.domain, request.site.tabId)) {
    //   try {
    //     await this.accountsService.deleteAccounts(Object.keys(accounts));

    //     return {
    //       ...request,
    //       result: null,
    //     };
    //   } catch (err) {
    //     console.log(err);
    //     return {
    //       ...request,
    //       error: ethErrors.rpc.internal('Account removing failed'),
    //     };
    //   }
    // }

    const walletNames: Record<string, string> = {};

    const primaryWallets = await this.secretsService.getPrimaryWalletsDetails();

    for (const walletId of Object.keys(primaryWalletAccounts)) {
      const primaryWallet = primaryWallets.find(
        (wallet) => wallet.id === walletId
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
      accounts: Record<string, ImportedAccount | PrimaryAccount>;
    }>,
    _,
    onSuccess,
    onError
  ) => {
    try {
      const { accounts } = pendingAction.displayData;

      await this.accountsService.deleteAccounts(Object.keys(accounts));

      onSuccess(null);
    } catch (e) {
      onError(e);
    }
  };
}
