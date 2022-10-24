import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { SelectAccountHandler } from './selectAccount';

describe('background/services/accounts/handlers/selectAccount.ts', () => {
  const activateAccountMock = jest.fn();
  const accountServiceMock = {
    activateAccount: activateAccountMock,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('ACCOUNT_SELECT success', async () => {
    const handler = new SelectAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_SELECT,
      params: [1],
    } as any;

    const result = await handler.handle(request);

    expect(activateAccountMock).toBeCalledTimes(1);
    expect(activateAccountMock).toBeCalledWith(1);
    expect(result).toEqual({ ...request, result: 'success' });
  });

  it('ACCOUNT_SELECT error', async () => {
    const handler = new SelectAccountHandler({
      activateAccount: jest.fn().mockRejectedValueOnce(new Error('some error')),
    } as any);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_SELECT,
      params: [1, 'Change Name'],
    } as any;

    const result = await handler.handle(request);
    expect(result).toEqual({ ...request, error: 'Error: some error' });
  });
});
