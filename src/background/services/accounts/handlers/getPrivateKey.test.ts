import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetPrivateKeyHandler } from './getPrivateKey';
import {
  AccountType,
  GetPrivateKeyErrorTypes,
  PrivateKeyChain,
} from '../models';
import { LockService } from '../../lock/LockService';
import { SecretType } from '../../secrets/models';
import { getWalletFromMnemonic } from '@avalabs/core-wallets-sdk';
import { buildRpcCall } from '@src/tests/test-utils';
import { AccountsService } from '../AccountsService';

jest.mock('@avalabs/core-wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/core-wallets-sdk'),
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
  const accountsServiceMock: jest.Mocked<AccountsService> = {} as any;

  const request = {
    id: '123',
    method: ExtensionRequest.ACCOUNT_GET_PRIVATEKEY,
    params: [SecretType.Mnemonic],
  } as any;

  const getHandler = () =>
    new GetPrivateKeyHandler(
      sercretServiceMock,
      lockServiceMock,
      accountsServiceMock
    );

  beforeEach(() => {
    jest.resetAllMocks();
    lockServiceMock.verifyPassword.mockResolvedValue(true);
    (getWalletFromMnemonic as jest.Mock).mockReturnValue({
      path: 'derivePath',
      privateKey: '123123123',
    });
  });

  it('should return an error when the chain is missing', async () => {
    const handler = getHandler();
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params: [{ password: '' }],
      })
    );
    expect(result).toEqual({
      ...request,
      params: [{ password: '' }],
      error: {
        type: GetPrivateKeyErrorTypes.Chain,
        message: 'Invalid chain',
      },
    });
  });

  it('should return an error when the chain is unknown', async () => {
    const handler = getHandler();
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params: [{ password: '', chain: 'Z' }],
      })
    );
    expect(result).toEqual({
      ...request,
      params: [{ password: '', chain: 'Z' }],
      error: {
        type: GetPrivateKeyErrorTypes.Chain,
        message: 'Invalid chain',
      },
    });
  });

  it('should return an error when the password is missing', async () => {
    const handler = getHandler();
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params: [{ password: '', chain: PrivateKeyChain.C }],
      })
    );
    expect(result).toEqual({
      ...request,
      params: [{ password: '', chain: PrivateKeyChain.C }],
      error: {
        type: GetPrivateKeyErrorTypes.Password,
        message: 'The password is invalid',
      },
    });
  });

  it('should return an error when the password is invalid', async () => {
    lockServiceMock.verifyPassword.mockResolvedValue(false);

    const handler = getHandler();
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params: [{ password: 'asd', chain: PrivateKeyChain.C }],
      })
    );
    expect(result).toEqual({
      ...request,
      params: [{ password: 'asd', chain: PrivateKeyChain.C }],
      error: {
        type: GetPrivateKeyErrorTypes.Password,
        message: 'The password is invalid',
      },
    });
  });

  it('should return an error when the type is empty', async () => {
    const handler = getHandler();
    const params = [{ type: '', password: '123', chain: PrivateKeyChain.C }];
    const result = await handler.handle(buildRpcCall({ ...request, params }));

    expect(result).toEqual({
      ...request,
      params,
      error: { type: GetPrivateKeyErrorTypes.Type, message: 'Invalid type' },
    });
  });

  it('should return an error when the `SecretType` is not `Mnemonic` or the  `AccountType` is not `IMPORTED`', async () => {
    const handler = getHandler();
    const params = [
      { type: SecretType.Keystone, password: 'asd', chain: PrivateKeyChain.C },
    ];
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params,
      })
    );

    expect(result).toEqual({
      ...request,
      params,
      error: { type: GetPrivateKeyErrorTypes.Type, message: 'Invalid type' },
    });
  });

  it('should return null when the secrets has no values', async () => {
    sercretServiceMock.getPrimaryAccountSecrets.mockResolvedValue(null);
    const handler = getHandler();
    const params = [
      {
        type: SecretType.Mnemonic,
        index: 0,
        password: 'asd',
        chain: PrivateKeyChain.C,
      },
    ];
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params,
      })
    );
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

    const params = [
      {
        type: SecretType.Mnemonic,
        index: 0,
        password: 'asd',
        chain: PrivateKeyChain.C,
      },
    ];
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params,
      })
    );
    expect(result).toEqual({
      ...request,
      params,
      error: {
        type: GetPrivateKeyErrorTypes.DerivePath,
        message: 'The derive path is missing',
      },
    });
  });
  it('should return the private key for the given account for C chain', async () => {
    sercretServiceMock.getPrimaryAccountSecrets.mockResolvedValue({
      mnemonic: 'some-words-here',
      secretType: SecretType.Mnemonic,
    });
    const handler = getHandler();
    const params = [
      {
        type: SecretType.Mnemonic,
        index: 0,
        password: 'asd',
        chain: PrivateKeyChain.C,
      },
    ];
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params,
      })
    );
    expect(result).toEqual({
      ...request,
      params,
      result: '123123123',
    });
  });

  it('should return the private key for the given account for X/P chain', async () => {
    sercretServiceMock.getPrimaryAccountSecrets.mockResolvedValue({
      mnemonic: 'fake mnemonic worlds',
      secretType: SecretType.Mnemonic,
    });
    const handler = getHandler();
    const params = [
      {
        type: SecretType.Mnemonic,
        index: 0,
        password: 'asd',
        chain: PrivateKeyChain.XP,
      },
    ];
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params,
      })
    );
    expect(result).toEqual({
      ...request,
      params,
      result:
        '0xb80d02d83264ae22f52a6b4573218f14c613984a88d96c747a54f9d1c2482081',
    });
  });

  it('should return the private key when the `AccountType` is imported and the `secretType` is `privateKey`', async () => {
    const params = [
      {
        type: AccountType.IMPORTED,
        id: 'asd',
        password: 'asd',
        chain: PrivateKeyChain.C,
      },
    ];
    sercretServiceMock.getImportedAccountSecrets.mockResolvedValue({
      secretType: SecretType.PrivateKey,
      secret: 'secretKey',
    });
    const handler = getHandler();
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params,
      })
    );
    expect(result).toEqual({
      ...request,
      params,
      result: '0xsecretKey',
    });
  });
  it('should return error when the `AccountType` is imported and the `type` is not `privateKey`', async () => {
    const params = [
      {
        type: AccountType.IMPORTED,
        id: 'asd',
        password: 'asd',
        chain: PrivateKeyChain.C,
      },
    ];
    sercretServiceMock.getImportedAccountSecrets.mockResolvedValue({
      type: 'walletConnect',
      secret: 'secretKey',
    });
    const handler = getHandler();
    const result = await handler.handle(
      buildRpcCall({
        ...request,
        params,
      })
    );
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
