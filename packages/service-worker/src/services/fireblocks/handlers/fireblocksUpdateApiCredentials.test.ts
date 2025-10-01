import { AccountsService } from '~/services/accounts/AccountsService';
import { NetworkService } from '~/services/network/NetworkService';
import { SecretsService } from '~/services/secrets/SecretsService';
import {
  AccountType,
  ExtensionRequest,
  FireblocksBtcAccessError,
  FireblocksBtcAccessErrorCode,
  MAINNET_LOOKUP_ASSETS,
  SecretType,
  TESTNET_LOOKUP_ASSETS,
} from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { importPKCS8 } from 'jose';
import { FireblocksService } from '../FireblocksService';
import { FireblocksUpdateApiCredentialsHandler } from './fireblocksUpdateApiCredentials';

jest.mock('../FireblocksService', () => ({
  FireblocksService: jest.fn().mockReturnValue({
    fetchVaultAccountByWalletAddress: jest.fn(),
    getBtcAddressByAccountId: jest.fn(),
  }),
}));
jest.mock('~/services/accounts/AccountsService');
jest.mock('~/services/network/NetworkService');
jest.mock('~/services/secrets/SecretsService');
jest.mock('jose');

describe('src/background/services/fireblocks/handlers/fireblocksUpdateApiCredentials.ts', () => {
  const networkServiceMock = new NetworkService(
    {} as any,
    {} as any,
    {} as any,
  );
  const secretsServiceMock = new SecretsService({} as any);
  const accountServiceMock = new AccountsService(
    {} as any,
    networkServiceMock,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
  );
  const fireblocksServiceMock = new FireblocksService({} as any);

  const mockRequest = buildRpcCall({
    id: '1',
    method: ExtensionRequest.FIREBLOCKS_UPDATE_API_CREDENTIALS,
    params: ['ACCOUNT_ID', 'API_KEY', 'SECRET_KEY'],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(networkServiceMock.isMainnet).mockReturnValue(true);
    jest.mocked(importPKCS8).mockResolvedValue({ type: 'IMPORTED_KEY' });

    jest
      .mocked(fireblocksServiceMock.fetchVaultAccountByWalletAddress)
      .mockResolvedValue('VAULT_ACCOUNT_ID');
    jest
      .mocked(fireblocksServiceMock.getBtcAddressByAccountId)
      .mockResolvedValue('bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed');
    jest.mocked(accountServiceMock.getAccountByID).mockResolvedValue({
      type: AccountType.FIREBLOCKS,
      id: '1',
      name: 'fireblocks',
      addressC: '0x000',
    });
  });

  it('has the correct method', () => {
    const handler = new FireblocksUpdateApiCredentialsHandler(
      accountServiceMock,
      networkServiceMock,
      secretsServiceMock,
    );

    expect(handler.method).toBe(
      ExtensionRequest.FIREBLOCKS_UPDATE_API_CREDENTIALS,
    );
  });

  it('updates imported fireblocks wallet and refreshes addresses', async () => {
    const handler = new FireblocksUpdateApiCredentialsHandler(
      accountServiceMock,
      networkServiceMock,
      secretsServiceMock,
    );

    expect(await handler.handle(mockRequest)).toEqual({
      ...mockRequest.request,
      result: true,
    });

    expect(
      fireblocksServiceMock.fetchVaultAccountByWalletAddress,
    ).toHaveBeenCalledWith('0x000', MAINNET_LOOKUP_ASSETS);
    expect(fireblocksServiceMock.getBtcAddressByAccountId).toHaveBeenCalledWith(
      'VAULT_ACCOUNT_ID',
      true,
    );
    expect(importPKCS8).toHaveBeenCalledWith('SECRET_KEY', 'RS256');

    expect(secretsServiceMock.saveImportedWallet).toHaveBeenCalledTimes(1);
    expect(secretsServiceMock.saveImportedWallet).toHaveBeenCalledWith(
      'ACCOUNT_ID',
      {
        addresses: {
          addressBTC: 'bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed',
          addressC: '0x000',
        },
        api: {
          key: 'API_KEY',
          secret: 'SECRET_KEY',
          vaultAccountId: 'VAULT_ACCOUNT_ID',
        },
        secretType: SecretType.Fireblocks,
      },
    );

    expect(accountServiceMock.refreshAddressesForAccount).toHaveBeenCalledTimes(
      1,
    );
    expect(accountServiceMock.refreshAddressesForAccount).toHaveBeenCalledWith(
      'ACCOUNT_ID',
    );
  });

  it('uses correct asset ids for testnet', async () => {
    const handler = new FireblocksUpdateApiCredentialsHandler(
      accountServiceMock,
      networkServiceMock,
      secretsServiceMock,
    );

    jest.mocked(networkServiceMock.isMainnet).mockReturnValue(false);

    expect(await handler.handle(mockRequest)).toEqual({
      ...mockRequest.request,
      result: true,
    });

    expect(
      fireblocksServiceMock.fetchVaultAccountByWalletAddress,
    ).toHaveBeenCalledWith('0x000', TESTNET_LOOKUP_ASSETS);

    expect(fireblocksServiceMock.getBtcAddressByAccountId).toHaveBeenCalledWith(
      'VAULT_ACCOUNT_ID',
      false,
    );
  });

  it('returns error if account is not Fireblocks account', async () => {
    const handler = new FireblocksUpdateApiCredentialsHandler(
      accountServiceMock,
      networkServiceMock,
      secretsServiceMock,
    );
    jest.mocked(accountServiceMock.getAccountByID).mockResolvedValue({
      type: AccountType.WALLET_CONNECT,
      id: '1',
      name: 'walletConnect',
      addressC: '0x000',
    });

    expect(await handler.handle(mockRequest)).toEqual({
      ...mockRequest.request,
      error: new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.WrongAccountType,
      ).message,
    });
  });

  it('returns error if account is not found', async () => {
    const handler = new FireblocksUpdateApiCredentialsHandler(
      accountServiceMock,
      networkServiceMock,
      secretsServiceMock,
    );
    jest.mocked(accountServiceMock.getAccountByID).mockResolvedValue(undefined);

    expect(await handler.handle(mockRequest)).toEqual({
      ...mockRequest.request,
      error: 'No account found with the given ID',
    });
  });

  it('returns error if vault account id is not found', async () => {
    const handler = new FireblocksUpdateApiCredentialsHandler(
      accountServiceMock,
      networkServiceMock,
      secretsServiceMock,
    );
    jest
      .mocked(fireblocksServiceMock.fetchVaultAccountByWalletAddress)
      .mockResolvedValue(null);

    expect(await handler.handle(mockRequest)).toEqual({
      ...mockRequest.request,
      error: new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.VaultAccountNotFound,
      ).message,
    });
  });

  it('returns error when secret key is invalid', async () => {
    const handler = new FireblocksUpdateApiCredentialsHandler(
      accountServiceMock,
      networkServiceMock,
      secretsServiceMock,
    );
    jest.mocked(importPKCS8).mockRejectedValue('Invalid key');

    expect(await handler.handle(mockRequest)).toEqual({
      ...mockRequest.request,
      error: new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.InvalidSecretKey,
      ).message,
    });
  });

  it('returns error when btc address is not found', async () => {
    const handler = new FireblocksUpdateApiCredentialsHandler(
      accountServiceMock,
      networkServiceMock,
      secretsServiceMock,
    );
    jest
      .mocked(fireblocksServiceMock.getBtcAddressByAccountId)
      .mockResolvedValue(undefined);

    expect(await handler.handle(mockRequest)).toEqual({
      ...mockRequest.request,
      error: new FireblocksBtcAccessError(
        FireblocksBtcAccessErrorCode.BTCAddressNotFound,
      ).message,
    });
  });
});
