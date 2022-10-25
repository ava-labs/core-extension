import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AvalancheSelectAccountHandler } from './avalanche_selectAccount';
import { container } from 'tsyringe';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { ActionsService } from '../../actions/ActionsService';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';

jest.mock('@src/utils/extensionUtils', () => ({
  openExtensionNewWindow: jest.fn(),
}));

describe('background/services/accounts/handlers/avalanche_selectAccount.ts', () => {
  const addActionMock = jest.fn();
  const accounts = [
    {
      index: 1,
      addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    {
      index: 2,
      addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  ];
  const accountServiceMock = {
    getAccounts: () => accounts,
  } as any;
  const actionsServiceMock = {
    addAction: addActionMock,
  };

  container.registerInstance(ActionsService, actionsServiceMock as any);

  beforeEach(() => {
    jest.resetAllMocks();

    (openExtensionNewWindow as jest.Mock).mockReturnValue({ id: 123 });
  });

  describe('handleAuthenticated', () => {
    it('returns DEFERED_RESPONSE', async () => {
      const handler = new AvalancheSelectAccountHandler(accountServiceMock);
      const url = 'switchAccount?id=123';

      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: [1],
        site: { tabId: 1 },
      } as any;

      const actionData = {
        ...request,
        tabId: 1,
        selectedAccount: accounts[0],
        popupWindowId: 123,
      };

      const result = await handler.handleAuthenticated(request);

      expect(openExtensionNewWindow).toHaveBeenCalled();
      expect(openExtensionNewWindow).toHaveBeenCalledWith(url, '');
      expect(addActionMock).toHaveBeenCalled();
      expect(addActionMock).toBeCalledWith(actionData);
      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });
    });

    it('returns errors when account not found', async () => {
      const handler = new AvalancheSelectAccountHandler({
        getAccounts: () => [],
      } as any);
      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: [1],
      } as any;

      const result = await handler.handleAuthenticated(request);

      expect(result).toEqual({
        ...request,
        error: new Error('Account not found'),
      });
    });
  });

  it('handleUnauthenticated', async () => {
    const handler = new AvalancheSelectAccountHandler(accountServiceMock);
    const request = {
      id: '123',
      method: DAppProviderRequest.ACCOUNT_SELECT,
      params: [1],
    } as any;

    const result = await handler.handleUnauthenticated(request);
    expect(result).toEqual({
      ...request,
      error: new Error(
        'The requested account and/or method has not been authorized by the user.'
      ),
    });
  });

  describe('onActionApproved', () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();
    const activateAccountMock = jest.fn().mockResolvedValue(true);

    it('success', async () => {
      const handler = new AvalancheSelectAccountHandler({
        activateAccount: activateAccountMock,
      } as any);
      await handler.onActionApproved(
        {
          selectedAccount: { index: 1 },
        } as any,
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(onErrorMock).not.toHaveBeenCalled();
      expect(activateAccountMock).toHaveBeenCalledWith(1);
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onSuccessMock).toBeCalledWith(null);
    });

    it('error', async () => {
      const mockError = new Error('something went wrong');
      const handler = new AvalancheSelectAccountHandler({
        activateAccount: jest.fn().mockRejectedValueOnce(mockError),
      } as any);

      await handler.onActionApproved(
        {
          selectedAccount: { index: 1 },
        } as any,
        undefined,
        onSuccessMock,
        onErrorMock
      );
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(onErrorMock).toBeCalledWith(mockError);
    });
  });
});
