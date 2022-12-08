import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { DeleteAccountHandler } from './deleteAccounts';

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
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_DELETE,
      params: [['0x1', '0x2']],
    } as any;

    const result = await handler.handle(request);

    expect(deleteAccounstMock).toHaveBeenCalledWith(['0x1', '0x2']);
    expect(result).toEqual({ ...request, result: 'success' });
  });

  it('returns the error that happened during removal', async () => {
    const error = new Error('foo');
    deleteAccounstMock.mockRejectedValueOnce(error);

    const handler = new DeleteAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_DELETE,
      params: [['0x1', '0x2']],
    } as any;

    const result = await handler.handle(request);

    expect(deleteAccounstMock).toHaveBeenCalledWith(['0x1', '0x2']);
    expect(result).toEqual({ ...request, error: error.toString() });
  });
});
