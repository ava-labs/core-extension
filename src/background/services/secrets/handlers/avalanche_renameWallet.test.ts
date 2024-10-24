import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AvalancheRenameWalletHandler } from './avalanche_renameWallet';
import { buildRpcCall } from '@src/tests/test-utils';
import { ethErrors } from 'eth-rpc-errors';
import { SecretsService } from '../SecretsService';
import { canSkipApproval } from '@src/utils/canSkipApproval';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';

jest.mock('@src/utils/canSkipApproval');

jest.mock('@src/background/runtime/openApprovalWindow');

describe('src/background/services/accounts/handlers/avalanche_renameAccount', () => {
  const secretsService = new SecretsService({} as any);
  it('should return error when domain info is not known', async () => {
    const handler = new AvalancheRenameWalletHandler(secretsService);
    const request = {
      id: '123',
      method: DAppProviderRequest.WALLET_RENAME,
      params: ['wallet-id', 'Change Name'],
    };
    expect(await handler.handleAuthenticated(buildRpcCall(request))).toEqual({
      ...request,
      error: ethErrors.rpc.invalidRequest('Missing dApp domain information'),
    });
  });

  it('should prompt the approval window for non-core requests with the right params', async () => {
    secretsService.getWalletAccountsSecretsById = jest.fn().mockResolvedValue([
      {
        walletId: 'wallet-id',
      },
    ]);
    secretsService.updateSecrets = jest.fn();
    const handler = new AvalancheRenameWalletHandler(secretsService);
    const request = {
      id: '123',
      method: DAppProviderRequest.WALLET_RENAME,
      params: ['wallet-id', 'Change Name'],
      site: {
        domain: 'anything.else.com',
        tabId: 1,
      },
    } as any;
    jest.mocked(canSkipApproval).mockResolvedValueOnce(false);

    await handler.handleAuthenticated(buildRpcCall(request));

    expect(openApprovalWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        displayData: { newName: 'Change Name', walletId: 'wallet-id' },
        method: 'avalanche_renameWallet',
      }),
      'renameWallet'
    );
    expect(secretsService.updateSecrets).not.toHaveBeenCalled();
  });

  it('should not prompt the approval window', async () => {
    secretsService.getWalletAccountsSecretsById = jest.fn().mockResolvedValue([
      {
        walletId: 'wallet-id',
      },
    ]);
    secretsService.updateSecrets = jest.fn();
    const handler = new AvalancheRenameWalletHandler(secretsService);
    const request = {
      id: '123',
      method: DAppProviderRequest.WALLET_RENAME,
      params: ['wallet-id', 'Change Name'],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;
    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);

    await handler.handleAuthenticated(buildRpcCall(request));

    expect(openApprovalWindow).not.toHaveBeenCalled();
    expect(secretsService.updateSecrets).toHaveBeenCalled();
  });

  it('should throw a renaming error', async () => {
    secretsService.getWalletAccountsSecretsById = jest.fn().mockResolvedValue([
      {
        walletId: 'wallet-id',
      },
    ]);

    secretsService.updateSecrets = jest.fn().mockRejectedValue('error');

    const handler = new AvalancheRenameWalletHandler(secretsService);
    const request = {
      id: '123',
      method: DAppProviderRequest.WALLET_RENAME,
      params: ['wallet-id', 'Change Name'],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    } as any;
    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);

    expect(await handler.handleAuthenticated(buildRpcCall(request))).toEqual({
      ...request,
      error: ethErrors.rpc.invalidRequest('Wallet renaming failed'),
    });
  });

  it('should rename the wallet correctly', async () => {
    secretsService.getWalletAccountsSecretsById = jest.fn().mockResolvedValue([
      {
        walletId: 'wallet-id',
      },
    ]);
    secretsService.updateSecrets = jest.fn();

    const handler = new AvalancheRenameWalletHandler(secretsService);
    const request = {
      id: '123',
      method: DAppProviderRequest.WALLET_RENAME,
      params: ['wallet-id', 'Change Name'],
      site: {
        domain: 'core.app',
        tabId: 1,
      },
    };
    jest.mocked(canSkipApproval).mockResolvedValueOnce(true);

    const result = await handler.handleAuthenticated(buildRpcCall(request));

    expect(secretsService.updateSecrets).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Change Name',
      }),
      'wallet-id'
    );
    expect(result).toEqual({ ...request, result: null });
  });
});
