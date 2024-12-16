import { ethErrors } from 'eth-rpc-errors';

import { buildRpcCall } from '@src/tests/test-utils';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

import { Account } from '../models';
import { canSkipApproval } from '@src/utils/canSkipApproval';
import { AvalancheDeleteAccountsHandler } from './avalanche_deleteAccounts';

jest.mock('@src/utils/canSkipApproval');
jest.mock('@src/background/runtime/openApprovalWindow');

describe('src/background/services/accounts/handlers/avalanche_deleteAccounts', () => {
  const deleteAccounts = jest.fn();
  const getAccountByID = jest.fn();

  const accountServiceMock = {
    getAccountByID,
    deleteAccounts,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns error when domain info is not known', async () => {
    const handler = new AvalancheDeleteAccountsHandler({} as any);
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
    const handler = new AvalancheDeleteAccountsHandler(accountServiceMock);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNTS_DELETE,
      params: [['accountId']],
      site: {
        domain: 'google.com',
        tabId: 1,
      },
    } as any;
    jest.mocked(canSkipApproval).mockResolvedValueOnce(false);
    const account = { id: 'accountId', name: 'account name' } as Account;
    getAccountByID.mockReturnValueOnce(account);

    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(openApprovalWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        displayData: {
          accounts: { accountId: { id: 'accountId', name: 'account name' } },
        },
      }),
      'deleteAccounts'
    );
    expect(deleteAccounts).not.toHaveBeenCalled();
    expect(result).toEqual({ ...request, result: DEFERRED_RESPONSE });
  });

  it('does not prompt approval for core suite', async () => {
    const handler = new AvalancheDeleteAccountsHandler(accountServiceMock);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNTS_DELETE,
      params: [['accountId']],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;

    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);
    const account = { id: 'accountId', name: 'old name' } as Account;
    getAccountByID.mockReturnValueOnce(account);

    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(openApprovalWindow).not.toHaveBeenCalled();
    expect(deleteAccounts).toHaveBeenCalledTimes(1);
    expect(deleteAccounts).toHaveBeenCalledWith(['accountId']);
    expect(result).toEqual({ ...request, result: null });
  });

  it('returns error when deleting accounts fails', async () => {
    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);

    const handler = new AvalancheDeleteAccountsHandler({
      getAccountByID: jest.fn().mockReturnValueOnce({}),
      deleteAccounts: jest.fn().mockRejectedValueOnce(new Error('some error')),
    } as any);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNTS_DELETE,
      params: [['accountId']],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;

    const result = await handler.handleAuthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.internal('Account removing failed'),
    });
  });
});
