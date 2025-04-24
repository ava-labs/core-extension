import { ExtensionRequest } from '@core/types';
import { SelectAccountHandler } from './selectAccount';
import { buildRpcCall } from '@src/tests/test-utils';

describe('background/services/accounts/handlers/selectAccount.ts', () => {
  const activateAccountMock = jest.fn();
  const accountServiceMock = {
    activateAccount: activateAccountMock,
  } as any;

  const request = buildRpcCall({
    id: '123',
    method: ExtensionRequest.ACCOUNT_SELECT,
    params: ['uuid'],
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('ACCOUNT_SELECT success', async () => {
    const handler = new SelectAccountHandler(accountServiceMock);
    const result = await handler.handle(request);

    expect(activateAccountMock).toBeCalledTimes(1);
    expect(activateAccountMock).toBeCalledWith('uuid');
    expect(result).toEqual({ ...request.request, result: 'success' });
  });

  it('ACCOUNT_SELECT error', async () => {
    const handler = new SelectAccountHandler({
      activateAccount: jest.fn().mockRejectedValueOnce(new Error('some error')),
    } as any);

    const result = await handler.handle(request);
    expect(result).toEqual({ ...request.request, error: 'Error: some error' });
  });
});
