import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { AddAccountHandler } from './addAccount';

describe('background/services/accounts/handlers/addAccount.ts', () => {
  const addAccountMock = jest.fn();
  const accountServiceMock = {
    addAccount: addAccountMock,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('ACCOUNT_ADD success', async () => {
    const handler = new AddAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_ADD,
    } as any;

    const result = await handler.handle(request);

    expect(addAccountMock).toBeCalledTimes(1);
    expect(result).toEqual({ ...request, result: 'success' });
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
      result: 'error',
      error: 'Error: some error',
    });
  });
});
