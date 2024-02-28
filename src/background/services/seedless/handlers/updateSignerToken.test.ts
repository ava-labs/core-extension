import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { UpdateSignerTokenHandler } from './updateSignerToken';
import { SecretsService } from '../../secrets/SecretsService';
import { SecretType } from '../../secrets/models';

describe('src/background/services/seedless/handlers/updateSignerToken', () => {
  const secretsService = jest.mocked<SecretsService>({
    getActiveAccountSecrets: jest.fn().mockResolvedValue({
      secretType: SecretType.Seedless,
      userEmail: 'x@y.z',
    }),
  } as any);

  it('returns error when token is missing', async () => {
    const handler = new UpdateSignerTokenHandler(
      {
        hasTokenExpired: true,
      } as any,
      secretsService
    );

    const result = await handler.handle({
      method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
      id: 'abcd-1234',
      params: [] as any,
    });

    expect(result.error).toEqual('missing token');
  });

  it('returns error when token is incomplete', async () => {
    const handler = new UpdateSignerTokenHandler(
      {
        hasTokenExpired: true,
      } as any,
      secretsService
    );

    const token = { token: 'bla bla bla' } as any;

    const result = await handler.handle({
      method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
      id: 'abcd-1234',
      params: [token, 'a@b.c'],
    });

    expect(result.error).toEqual('missing session information');
  });

  it('returns error when email is not provided', async () => {
    const handler = new UpdateSignerTokenHandler(
      {
        hasTokenExpired: true,
      } as any,
      secretsService
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle({
      method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
      id: 'abcd-1234',
      params: [token, ''],
    });

    expect(result.error).toEqual('missing email address');
  });

  it('returns error when emails do not match', async () => {
    const handler = new UpdateSignerTokenHandler(
      {
        hasTokenExpired: true,
      } as any,
      secretsService
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle({
      method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
      id: 'abcd-1234',
      params: [token, 'a@b.c'],
    });

    expect(result.error).toEqual('mismatching email address');
  });

  it('returns error if updating the signer token fails', async () => {
    const error = new Error('Ooopsies');
    const updateSignerToken = jest.fn().mockRejectedValue(error);

    const handler = new UpdateSignerTokenHandler(
      {
        updateSignerToken,
      } as any,
      secretsService
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle({
      method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
      id: 'abcd-1234',
      params: [token, 'x@y.z'],
    });

    expect(result.error).toEqual(error.message);
  });

  it('attempts to update the signer token and returns null', async () => {
    const updateSignerToken = jest.fn();
    const handler = new UpdateSignerTokenHandler(
      {
        updateSignerToken,
      } as any,
      secretsService
    );

    const token = { token: 'bla bla bla', session_info: { bla: 'bla' } } as any;

    const result = await handler.handle({
      method: ExtensionRequest.SEEDLESS_UPDATE_SIGNER_TOKEN,
      id: 'abcd-1234',
      params: [token, 'x@y.z'],
    });

    expect(updateSignerToken).toHaveBeenCalledWith(token);
    expect(result.result).toBeNull();
  });
});
