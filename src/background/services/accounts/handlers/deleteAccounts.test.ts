import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { DeleteAccountHandler } from './deleteAccounts';
import { buildRpcCall } from '@src/tests/test-utils';

describe('background/services/accounts/handlers/deleteAccount.ts', () => {
  const deleteAccounstMock = jest.fn();
  const accountServiceMock = {
    deleteAccounts: deleteAccounstMock,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('removes the imported accounts', async () => {
    const handler = new DeleteAccountHandler(accountServiceMock);
    const request = buildRpcCall({
      id: '123',
      method: ExtensionRequest.ACCOUNT_DELETE,
      params: [['0x1', '0x2']],
    });

    const result = await handler.handle(request);

    expect(deleteAccounstMock).toHaveBeenCalledWith(['0x1', '0x2']);
    expect(result).toEqual({ ...request.request, result: 'success' });
  });

  it('returns the error that happened during removal', async () => {
    const error = new Error('foo');
    deleteAccounstMock.mockRejectedValueOnce(error);

    const handler = new DeleteAccountHandler(accountServiceMock);
    const request = buildRpcCall({
      id: '123',
      method: ExtensionRequest.ACCOUNT_DELETE,
      params: [['0x1', '0x2']],
    });

    const result = await handler.handle(request);

    expect(deleteAccounstMock).toHaveBeenCalledWith(['0x1', '0x2']);
    expect(result).toEqual({ ...request.request, error: error.toString() });
  });
});
