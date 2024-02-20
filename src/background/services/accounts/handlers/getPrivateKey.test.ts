import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetPrivateKeyHandler } from './getPrivateKey';
import { WalletType } from '../../wallet/models';
import { AccountType, GetPrivateKeyErrorTypes } from '../models';
import { LockService } from '../../lock/LockService';
import { SecretType } from '../../secrets/models';
import { getWalletFromMnemonic } from '@avalabs/wallets-sdk';

jest.mock('@avalabs/wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/wallets-sdk'),
  getWalletFromMnemonic: jest.fn(),
}));

describe('background/services/accounts/handlers/getPrivateKey.ts', () => {
  const sercretServiceMock = {
    getWalletSecrets: jest.fn(),
    getPrimaryAccountSecrets: jest.fn(),
    getImportedAccountSecrets: jest.fn(),
  } as any;
  const lockServiceMock: jest.Mocked<LockService> = {
    verifyPassword: jest.fn(),
  } as any;

  const request = {
    id: '123',
    method: ExtensionRequest.ACCOUNT_GET_PRIVATEKEY,
    params: [WalletType.MNEMONIC],
  } as any;

  const getHandler = () =>
    new GetPrivateKeyHandler(sercretServiceMock, lockServiceMock);

  beforeEach(() => {
    jest.resetAllMocks();
    lockServiceMock.verifyPassword.mockResolvedValue(true);
    (getWalletFromMnemonic as jest.Mock).mockReturnValue({
      path: 'derivePath',
      privateKey: '123123123',
    });
  });

  it('should return an error when the password is missing', async () => {
    const handler = getHandler();
    const result = await handler.handle({
      ...request,
      params: [{ password: '' }],
    });
    expect(result).toEqual({
      ...request,
      params: [{ password: '' }],
      error: {
        type: GetPrivateKeyErrorTypes.Password,
        message: 'The password is invalid',
      },
    });
  });

  it('should return an error when the password is invalid', async () => {
    lockServiceMock.verifyPassword.mockResolvedValue(false);

    const handler = getHandler();
    const result = await handler.handle({
      ...request,
      params: [{ password: 'asd' }],
    });
    expect(result).toEqual({
      ...request,
      params: [{ password: 'asd' }],
      error: {
        type: GetPrivateKeyErrorTypes.Password,
        message: 'The password is invalid',
      },
    });
  });

  it('should return an error when the type is empty', async () => {
    const handler = getHandler();
    const params = [{ type: '', password: '123' }];
    const result = await handler.handle({ ...request, params });

    expect(result).toEqual({
      ...request,
      params,
      error: { type: GetPrivateKeyErrorTypes.Type, message: 'Invalid type' },
    });
  });

  it('should return an error when the `WalletType` is not `MNEMONIC` or the  `AccountType` is not `IMPORTED`', async () => {
    const handler = getHandler();
    const params = [{ type: WalletType.KEYSTONE, password: 'asd' }];
    const result = await handler.handle({
      ...request,
      params,
    });

    expect(result).toEqual({
      ...request,
      params,
      error: { type: GetPrivateKeyErrorTypes.Type, message: 'Invalid type' },
    });
  });

  it('should return null when the secrets has no values', async () => {
    sercretServiceMock.getPrimaryAccountSecrets.mockResolvedValue(null);
    const handler = getHandler();
    const params = [{ type: WalletType.MNEMONIC, index: 0, password: 'asd' }];
    const result = await handler.handle({
      ...request,
      params,
    });
    expect(result).toEqual({
      ...request,
      params,
      error: {
        type: GetPrivateKeyErrorTypes.Mnemonic,
        message: 'There is no mnemonic found',
      },
    });
  });
  it('should return an error when the `signer.path` is undefined', async () => {
    (getWalletFromMnemonic as jest.Mock).mockReturnValue({
      path: undefined,
    });
    sercretServiceMock.getPrimaryAccountSecrets.mockResolvedValue({
      mnemonic: 'some-words-here',
      secretType: SecretType.Mnemonic,
    });
    const handler = getHandler();

    const params = [{ type: WalletType.MNEMONIC, index: 0, password: 'asd' }];
    const result = await handler.handle({
      ...request,
      params,
    });
    expect(result).toEqual({
      ...request,
      params,
      error: {
        type: GetPrivateKeyErrorTypes.DerivePath,
        message: 'The derive path is missing',
      },
    });
  });
  it('should return the private key for the given account', async () => {
    sercretServiceMock.getPrimaryAccountSecrets.mockResolvedValue({
      mnemonic: 'some-words-here',
      secretType: SecretType.Mnemonic,
    });
    const handler = getHandler();
    const params = [{ type: WalletType.MNEMONIC, index: 0, password: 'asd' }];
    const result = await handler.handle({
      ...request,
      params,
    });
    expect(result).toEqual({
      ...request,
      params,
      result: '123123123',
    });
  });
  it('should return the private key when the `AccountType` is imported and the `secretType` is `privateKey`', async () => {
    const params = [{ type: AccountType.IMPORTED, id: 'asd', password: 'asd' }];
    sercretServiceMock.getImportedAccountSecrets.mockResolvedValue({
      secretType: SecretType.PrivateKey,
      secret: 'secretKey',
    });
    const handler = getHandler();
    const result = await handler.handle({
      ...request,
      params,
    });
    expect(result).toEqual({
      ...request,
      params,
      result: '0xsecretKey',
    });
  });
  it('should return error when the `AccountType` is imported and the `type` is not `privateKey`', async () => {
    const params = [{ type: AccountType.IMPORTED, id: 'asd', password: 'asd' }];
    sercretServiceMock.getImportedAccountSecrets.mockResolvedValue({
      type: 'walletConnect',
      secret: 'secretKey',
    });
    const handler = getHandler();
    const result = await handler.handle({
      ...request,
      params,
    });
    expect(result).toEqual({
      ...request,
      params,
      error: {
        type: GetPrivateKeyErrorTypes.Type,
        message: 'Invalid type',
      },
    });
  });
});
