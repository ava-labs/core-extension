import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { UpdateSignerTokenHandler } from './updateSignerToken';
import type { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';
import { buildRpcCall } from '@src/tests/test-utils';
import type { AccountsService } from '../../accounts/AccountsService';
import type { Account } from '../../accounts/models';

describe('src/background/services/seedless/handlers/updateSignerToken', () => {
  let secretsService;

  const accountsService: jest.Mocked<AccountsService> = {
    activeAccount: {} as unknown as Account,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    secretsService = jest.mocked<SecretsService>({
      getAccountSecrets: jest.fn().mockResolvedValue({
        secretType: SecretType.Seedless,
        userEmail: 'x@y.z',
      }),
      updateSecrets: jest.fn().mockResolvedValue('walletId'),
    } as any);
  });

  it('returns error when token is missing', async () => {
    const handler = new UpdateSignerTokenHandler(
      {
        hasTokenExpired: true,
      } as any,
      secretsService,
      accountsService,
    );

    const result = await handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        id: 'abcd-1234',
        params: [] as any,
      }),
    );

    expect(result.error).toEqual('missing token');
  });

  it('returns error when token is incomplete', async () => {
    const handler = new UpdateSignerTokenHandler(
      {
        hasTokenExpired: true,
      } as any,
      secretsService,
      accountsService,
    );

    const token = { token: 'bla bla bla' } as any;

    const result = await handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        id: 'abcd-1234',
        params: [token, 'a@b.c', '123'],
      }),
    );

    expect(result.error).toEqual('missing session information');
  });

  it('returns error when user ID is not provided', async () => {
    const handler = new UpdateSignerTokenHandler(
      {
        hasTokenExpired: true,
      } as any,
      secretsService,
      accountsService,
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        id: 'abcd-1234',
        params: [token, 'a@b.c', ''],
      }),
    );

    expect(result.error).toEqual('missing user ID');
  });

  it('returns error when user ID do not match', async () => {
    secretsService = jest.mocked<SecretsService>({
      getAccountSecrets: jest.fn().mockResolvedValue({
        secretType: SecretType.Seedless,
        userEmail: 'x@y.z',
        userId: '456',
      }),
    } as any);
    const handler = new UpdateSignerTokenHandler(
      {
        hasTokenExpired: true,
      } as any,
      secretsService,
      accountsService,
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        id: 'abcd-1234',
        params: [token, 'a@b.c', '123'],
      }),
    );
    expect(result.error).toEqual('mismatching user ID');
  });

  it('returns error when emails do not match', async () => {
    const handler = new UpdateSignerTokenHandler(
      {
        hasTokenExpired: true,
      } as any,
      secretsService,
      accountsService,
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        id: 'abcd-1234',
        params: [token, 'a@b.c', '123'],
      }),
    );

    expect(result.error).toEqual('mismatching email address');
  });

  it('returns error if updating the signer token fails', async () => {
    const error = new Error('Ooopsies');
    const updateSignerToken = jest.fn().mockRejectedValue(error);

    const handler = new UpdateSignerTokenHandler(
      {
        updateSignerToken,
      } as any,
      secretsService,
      accountsService,
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        id: 'abcd-1234',
        params: [token, 'x@y.z', '123'],
      }),
    );

    expect(result.error).toEqual(error.message);
  });

  it('attempts to update the signer token and user ID and returns null', async () => {
    const updateSignerToken = jest.fn();
    const handler = new UpdateSignerTokenHandler(
      {
        updateSignerToken,
      } as any,
      secretsService,
      accountsService,
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        id: 'abcd-1234',
        params: [token, 'x@y.z', '123'],
      }),
    );

    expect(updateSignerToken).toHaveBeenCalledWith(token);
    expect(secretsService.updateSecrets).toHaveBeenCalledTimes(1);
    expect(result.result).toBeNull();
  });

  it('does not attempts to update the signer token when userIds match', async () => {
    secretsService = jest.mocked<SecretsService>({
      getAccountSecrets: jest.fn().mockResolvedValue({
        secretType: SecretType.Seedless,
        userEmail: undefined,
        userId: '123',
      }),
      updateSecrets: jest.fn().mockResolvedValue('walletId'),
    } as any);
    const updateSignerToken = jest.fn();
    const handler = new UpdateSignerTokenHandler(
      {
        updateSignerToken,
      } as any,
      secretsService,
      accountsService,
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        id: 'abcd-1234',
        params: [token, 'x@y.z', '123'],
      }),
    );

    expect(updateSignerToken).toHaveBeenCalledWith(token);
    expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    expect(result.result).toBeNull();
  });

  it('attempts to update the signer token with no change and returns null', async () => {
    secretsService = jest.mocked<SecretsService>({
      getAccountSecrets: jest.fn().mockResolvedValue({
        secretType: SecretType.Seedless,
        userEmail: 'x@y.z',
        userId: '123',
      }),
      updateSecrets: jest.fn().mockResolvedValue('walletId'),
    } as any);

    const updateSignerToken = jest.fn();
    const handler = new UpdateSignerTokenHandler(
      {
        updateSignerToken,
      } as any,
      secretsService,
      accountsService,
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle(
      buildRpcCall({
        method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
        id: 'abcd-1234',
        params: [token, 'x@y.z', '123'],
      }),
    );

    expect(updateSignerToken).toHaveBeenCalledWith(token);
    expect(secretsService.updateSecrets).not.toHaveBeenCalled();
    expect(result.result).toBeNull();
  });
});
