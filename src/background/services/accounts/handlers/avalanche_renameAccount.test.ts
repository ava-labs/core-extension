import { ethErrors } from 'eth-rpc-errors';

import { buildRpcCall } from '@src/tests/test-utils';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

import { AvalancheRenameAccountHandler } from './avalanche_renameAccount';
import type { Account } from '../models';
import { canSkipApproval } from '@src/utils/canSkipApproval';

jest.mock('@src/utils/canSkipApproval');
jest.mock('@src/background/runtime/openApprovalWindow');

describe('src/background/services/accounts/handlers/avalanche_renameAccount', () => {
  const setAccountName = jest.fn();
  const getAccountByID = jest.fn();

  const accountServiceMock = {
    getAccountByID,
    setAccountName,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns error when domain info is not known', async () => {
    const handler = new AvalancheRenameAccountHandler({} as any);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNT_RENAME,
      params: ['uuid', 'Change Name'],
    };

    expect(await handler.handleAuthenticated(buildRpcCall(request))).toEqual({
      ...request,
      error: ethErrors.rpc.invalidRequest('Missing dApp domain information'),
    });
  });

  it('prompts approval for non-core requests', async () => {
    const handler = new AvalancheRenameAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNT_RENAME,
      params: ['uuid', 'Changed Name'],
      site: {
        domain: 'google.com',
        tabId: 1,
      },
    } as any;
    jest.mocked(canSkipApproval).mockResolvedValueOnce(false);
    const account = { id: '1234', name: 'old name' } as Account;
    getAccountByID.mockReturnValueOnce(account);

    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(openApprovalWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        displayData: { account, newName: 'Changed Name' },
      }),
      'renameAccount',
    );
    expect(setAccountName).not.toHaveBeenCalled();
    expect(result).toEqual({ ...request, result: DEFERRED_RESPONSE });
  });

  it('does not prompt approval for core suite', async () => {
    const handler = new AvalancheRenameAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNT_RENAME,
      params: ['uuid', 'Changed Name'],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;

    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);
    const account = { id: '1234', name: 'old name' } as Account;
    getAccountByID.mockReturnValueOnce(account);

    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(openApprovalWindow).not.toHaveBeenCalled();
    expect(setAccountName).toHaveBeenCalledTimes(1);
    expect(setAccountName).toHaveBeenCalledWith('uuid', 'Changed Name');
    expect(result).toEqual({ ...request, result: null });
  });

  it('returns error when new account name is empty', async () => {
    const handler = new AvalancheRenameAccountHandler({
      getAccountByID: jest.fn().mockReturnValueOnce({}),
      setAccountName: jest.fn().mockResolvedValueOnce(undefined),
    } as any);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNT_RENAME,
      params: ['uuid', '  '],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;

    const result = await handler.handleAuthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.invalidParams('Invalid new name'),
    });
  });

  it('returns error when renaming account fails', async () => {
    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);

    const handler = new AvalancheRenameAccountHandler({
      getAccountByID: jest.fn().mockReturnValueOnce({}),
      setAccountName: jest.fn().mockRejectedValueOnce(new Error('some error')),
    } as any);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNT_RENAME,
      params: ['uuid', 'Change Name'],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;

    const result = await handler.handleAuthenticated(buildRpcCall(request));
    expect(result).toEqual({
      ...request,
      error: ethErrors.rpc.internal('Account renaming failed'),
    });
  });
});
