import { ethErrors } from 'eth-rpc-errors';

import { buildRpcCall } from '@src/tests/test-utils';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

import {
  AccountType,
  type ImportedAccount,
  type PrimaryAccount,
} from '../models';
import { canSkipApproval } from 'packages/utils/src/canSkipApproval';
import { AvalancheDeleteAccountsHandler } from './avalanche_deleteAccounts';
import type { WalletDetails } from '@core/types/src/models';

jest.mock('@src/utils/canSkipApproval');
jest.mock('@src/background/runtime/openApprovalWindow');

describe('src/background/services/accounts/handlers/avalanche_deleteAccounts', () => {
  const deleteAccounts = jest.fn();
  const getAccountByID = jest.fn();
  const getPrimaryAccountsByWalletId = jest.fn();

  const accountServiceMock = {
    getAccountByID,
    deleteAccounts,
    getPrimaryAccountsByWalletId,
  } as any;

  const getPrimaryWalletsDetails = jest.fn();

  const secretsServiceMock = {
    getPrimaryWalletsDetails,
  } as any;
  const wallet = {
    id: 'walletId',
    name: 'test wallet',
  } as WalletDetails;

  const primaryAccount = {
    id: 'primaryAccountId',
    name: 'account name',
    walletId: wallet.id,
    type: AccountType.PRIMARY,
  } as PrimaryAccount;
  const primaryAccount2 = {
    id: 'primaryAccountId2',
    name: 'account name2',
    walletId: wallet.id,
    type: AccountType.PRIMARY,
  } as PrimaryAccount;
  const importedAccount = {
    id: 'importedAccountId',
    name: 'account name',
  } as ImportedAccount;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns error when domain info is not known', async () => {
    const handler = new AvalancheDeleteAccountsHandler({} as any, {} as any);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNTS_DELETE,
      params: [['accountId']],
    };

    expect(await handler.handleAuthenticated(buildRpcCall(request))).toEqual({
      ...request,
      error: ethErrors.rpc.invalidRequest('Missing dApp domain information'),
    });
  });

  it('prompts approval for non-core requests', async () => {
    const handler = new AvalancheDeleteAccountsHandler(
      accountServiceMock,
      secretsServiceMock,
    );

    jest.mocked(canSkipApproval).mockResolvedValueOnce(false);

    getAccountByID.mockImplementation((id) => {
      if (id === primaryAccount2.id) {
        return primaryAccount2;
      }
      return importedAccount;
    });
    getPrimaryAccountsByWalletId.mockReturnValue([
      primaryAccount,
      primaryAccount2,
    ]);

    getPrimaryWalletsDetails.mockResolvedValue([wallet]);

    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNTS_DELETE,
      params: [[primaryAccount2.id, importedAccount.id]],
      site: {
        domain: 'google.com',
        tabId: 1,
      },
    } as any;

    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(openApprovalWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        displayData: {
          accounts: {
            primary: {
              [wallet.id]: [primaryAccount2],
            },
            imported: [importedAccount],
            wallet: { [wallet.id]: wallet.name },
          },
        },
      }),
      'deleteAccounts',
    );
    expect(deleteAccounts).not.toHaveBeenCalled();
    expect(result).toEqual({ ...request, result: DEFERRED_RESPONSE });
  });

  it('does not prompt approval for core suite', async () => {
    const handler = new AvalancheDeleteAccountsHandler(
      accountServiceMock,
      secretsServiceMock,
    );

    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);

    getAccountByID.mockReturnValueOnce(primaryAccount);
    getPrimaryAccountsByWalletId.mockReturnValue([primaryAccount]);

    getPrimaryWalletsDetails.mockResolvedValue([wallet]);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNTS_DELETE,
      params: [[primaryAccount.id]],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;

    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(openApprovalWindow).not.toHaveBeenCalled();
    expect(deleteAccounts).toHaveBeenCalledTimes(1);
    expect(deleteAccounts).toHaveBeenCalledWith([primaryAccount.id]);
    expect(result).toEqual({ ...request, result: null });
  });

  it('returns error when deleting accounts fails', async () => {
    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);

    const handler = new AvalancheDeleteAccountsHandler(
      accountServiceMock,
      secretsServiceMock,
    );

    getAccountByID.mockReturnValueOnce(primaryAccount);
    getPrimaryAccountsByWalletId.mockReturnValue([primaryAccount]);

    getPrimaryWalletsDetails.mockResolvedValue([wallet]);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNTS_DELETE,
      params: [[primaryAccount.id]],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;
    deleteAccounts.mockRejectedValueOnce(new Error('some error'));
    const result = await handler.handleAuthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.internal('Account removing failed'),
    });
  });

  it('returns error when no accounts were found using account IDs in request param', async () => {
    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);

    const handler = new AvalancheDeleteAccountsHandler(
      accountServiceMock,
      secretsServiceMock,
    );

    getAccountByID.mockReturnValueOnce(undefined);

    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNTS_DELETE,
      params: [['wrongId']],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;
    const result = await handler.handleAuthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.internal('No account with specified IDs'),
    });
  });

  it('returns error when requested account is not the last index in the wallet', async () => {
    const handler = new AvalancheDeleteAccountsHandler(
      accountServiceMock,
      secretsServiceMock,
    );

    jest.mocked(canSkipApproval).mockResolvedValueOnce(false);

    getAccountByID.mockReturnValue(primaryAccount);
    getPrimaryAccountsByWalletId.mockReturnValue([
      primaryAccount,
      primaryAccount2,
    ]);

    getPrimaryWalletsDetails.mockResolvedValue([wallet]);

    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNTS_DELETE,
      params: [[primaryAccount.id]],
      site: {
        domain: 'google.com',
        tabId: 1,
      },
    } as any;

    const result = await handler.handleAuthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.internal(
        'Only the last account of the wallet can be removed',
      ),
    });
  });
});
