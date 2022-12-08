import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ImportType } from '../models';
import { AddAccountHandler } from './addAccount';

describe('background/services/accounts/handlers/addAccount.ts', () => {
  const uuid = 'uuid';
  const addAccountMock = jest.fn();
  const accountServiceMock = {
    addAccount: addAccountMock,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    addAccountMock.mockResolvedValue(uuid);
  });

  it('ACCOUNT_ADD success without params', async () => {
    const handler = new AddAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
    } as any;

    const result = await handler.handle(request);

    expect(addAccountMock).toBeCalledTimes(1);
    expect(addAccountMock).toBeCalledWith(undefined, undefined);
    expect(result).toEqual({ ...request, result: uuid });
  });

  it('ACCOUNT_ADD success with name', async () => {
    const handler = new AddAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
      params: ['name'],
    } as any;

    const result = await handler.handle(request);

    expect(addAccountMock).toBeCalledTimes(1);
    expect(addAccountMock).toBeCalledWith('name', undefined);
    expect(result).toEqual({ ...request, result: uuid });
  });

  it('ACCOUNT_ADD success with import data', async () => {
    const handler = new AddAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
      params: [
        '',
        {
          importType: ImportType.PRIVATE_KEY,
          data: 'secretKey',
        },
      ],
    } as any;

    const result = await handler.handle(request);

    expect(addAccountMock).toBeCalledTimes(1);
    expect(addAccountMock).toBeCalledWith('', {
      importType: ImportType.PRIVATE_KEY,
      data: 'secretKey',
    });
    expect(result).toEqual({ ...request, result: uuid });
  });

  it('ACCOUNT_ADD error', async () => {
    const handler = new AddAccountHandler({
      addAccount: jest.fn().mockRejectedValueOnce(new Error('some error')),
    } as any);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
    } as any;

    const result = await handler.handle(request);
    expect(result).toEqual({
      ...request,
      error: 'Error: some error',
    });
  });
});
