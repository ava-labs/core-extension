import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { RenameAccountHandler } from './renameAccount';

describe('background/services/accounts/handlers/renameAccount.ts', () => {
  const setAccountNameMock = jest.fn();
  const accountServiceMock = {
    setAccountName: setAccountNameMock,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renames account', async () => {
    const handler = new RenameAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_RENAME,
      params: [1, 'Change Name'],
    } as any;

    const result = await handler.handle(request);

    expect(setAccountNameMock).toBeCalledTimes(1);
    expect(setAccountNameMock).toBeCalledWith(1, 'Change Name');
    expect(result).toEqual({ ...request, result: 'success' });
  });

  it('returns error when renaming account fails', async () => {
    const handler = new RenameAccountHandler({
      setAccountName: jest.fn().mockRejectedValueOnce(new Error('some error')),
    } as any);
    const request = {
      id: '123',
      method: ExtensionRequest.ACCOUNT_RENAME,
      params: [1, 'Change Name'],
    } as any;

    const result = await handler.handle(request);
    expect(result).toEqual({ ...request, error: 'Error: some error' });
  });
});
