import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { AvalancheSelectAccountHandler } from './avalanche_selectAccount';
import { container } from 'tsyringe';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { ActionsService } from '../../actions/ActionsService';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { AccountType } from '../models';
import { buildRpcCall } from '@src/tests/test-utils';
import { canSkipApproval } from '@src/utils/canSkipApproval';

jest.mock('@src/utils/canSkipApproval');
jest.mock('@src/utils/extensionUtils', () => ({
  openExtensionNewWindow: jest.fn(),
}));

describe('background/services/accounts/handlers/avalanche_selectAccount.ts', () => {
  const addActionMock = jest.fn();
  const accountServiceMock = {
    getAccountList: jest.fn(),
    activateAccount: jest.fn(),
  } as any;
  const actionsServiceMock = {
    addAction: addActionMock,
  };
  const permissionsServiceMock = {
    setAccountPermissionForDomain: jest.fn(),
  } as any;

  container.registerInstance(ActionsService, actionsServiceMock as any);

  beforeEach(() => {
    jest.resetAllMocks();

    (openExtensionNewWindow as jest.Mock).mockReturnValue({ id: 123 });
    (crypto.randomUUID as jest.Mock).mockReturnValue('uuid');
    jest.mocked(canSkipApproval).mockResolvedValue(false);
  });

  describe('handleAuthenticated', () => {
    it('returns DEFERED_RESPONSE for primary address', async () => {
      const account = {
        index: 1,
        addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        type: AccountType.PRIMARY,
      };
      accountServiceMock.getAccountList.mockReturnValue([account]);

      const handler = new AvalancheSelectAccountHandler(
        accountServiceMock,
        permissionsServiceMock,
      );
      const url = 'switchAccount?actionId=uuid';

      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: [1],
        site: { tabId: 1 },
      } as any;

      const actionData = {
        ...request,
        actionId: 'uuid',
        displayData: {
          selectedAccount: account,
        },
        popupWindowId: 123,
      };

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(openExtensionNewWindow).toHaveBeenCalled();
      expect(openExtensionNewWindow).toHaveBeenCalledWith(url);
      expect(addActionMock).toHaveBeenCalled();
      expect(addActionMock).toBeCalledWith(expect.objectContaining(actionData));
      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });
    });

    it('returns DEFERED_RESPONSE for imported address', async () => {
      const account = {
        id: '0x1',
        addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        type: AccountType.IMPORTED,
      };

      accountServiceMock.getAccountList.mockReturnValue([account]);
      const handler = new AvalancheSelectAccountHandler(
        accountServiceMock,
        permissionsServiceMock,
      );
      const url = 'switchAccount?actionId=uuid';

      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: ['0x1'],
        site: { tabId: 1 },
      } as any;

      const actionData = {
        ...request,
        actionId: 'uuid',
        displayData: {
          selectedAccount: account,
        },
        popupWindowId: 123,
      };

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(openExtensionNewWindow).toHaveBeenCalled();
      expect(openExtensionNewWindow).toHaveBeenCalledWith(url);
      expect(addActionMock).toHaveBeenCalled();
      expect(addActionMock).toBeCalledWith(expect.objectContaining(actionData));
      expect(result).toEqual({
        ...request,
        result: DEFERRED_RESPONSE,
      });
    });

    it('returns errors when account not found', async () => {
      accountServiceMock.getAccountList.mockReturnValueOnce([]);

      const handler = new AvalancheSelectAccountHandler(
        accountServiceMock,
        permissionsServiceMock,
      );
      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: [1],
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(result).toEqual({
        ...request,
        error: new Error('Account not found'),
      });
    });

    it('should switch account without opening approval window if the request is from core web', async () => {
      jest.mocked(canSkipApproval).mockResolvedValue(true);

      const account = {
        index: 1,
        addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        type: AccountType.PRIMARY,
        id: 'accountId',
      };
      accountServiceMock.getAccountList.mockReturnValue([account]);

      const handler = new AvalancheSelectAccountHandler(
        accountServiceMock,
        permissionsServiceMock,
      );

      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: [1],
        site: { tabId: 1, domain: 'core.app', name: 'Core' },
      } as any;

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(accountServiceMock.activateAccount).toHaveBeenCalledWith(
        account.id,
      );
      expect(openExtensionNewWindow).not.toHaveBeenCalled();
      expect(addActionMock).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...request,
        result: null,
      });
    });

    it('should call the approval window with the new active account from the active wallet', async () => {
      const accounts = [
        {
          id: '0001',
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletId: 1,
          index: 0,
        },
        {
          id: '0002',
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletId: 2,
          index: 0,
        },
        {
          id: '0003',
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          type: AccountType.PRIMARY,
          walletId: 2,
          index: 1,
        },
      ];

      accountServiceMock.getAccountList.mockReturnValue(accounts);
      accountServiceMock.activeAccount = accounts[2];

      const handler = new AvalancheSelectAccountHandler(
        accountServiceMock,
        permissionsServiceMock,
      );

      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: [0],
        site: { tabId: 1 },
      } as any;
      await handler.handleAuthenticated(buildRpcCall(request));
      expect(addActionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          ...request,
          displayData: {
            selectedAccount: accounts[1],
          },
        }),
      );
    });
  });

  describe('handleUnauthenticated', () => {
    it('should return an error', async () => {
      const handler = new AvalancheSelectAccountHandler(
        accountServiceMock,
        permissionsServiceMock,
      );
      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: [1],
      } as any;

      const result = await handler.handleUnauthenticated(buildRpcCall(request));
      expect(result).toEqual({
        ...request,
        error: new Error(
          'The requested account and/or method has not been authorized by the user.',
        ),
      });
    });
  });

  describe('onActionApproved', () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();
    const activateAccountMock = jest.fn().mockResolvedValue(true);

    it('success with primary account', async () => {
      const handler = new AvalancheSelectAccountHandler(
        {
          activateAccount: activateAccountMock,
        } as any,
        permissionsServiceMock,
      );
      await handler.onActionApproved(
        {
          site: {},
          displayData: {
            selectedAccount: {
              index: 1,
              id: 'uuid',
              type: AccountType.PRIMARY,
            },
          },
        } as any,
        undefined,
        onSuccessMock,
        onErrorMock,
      );

      expect(
        permissionsServiceMock.setAccountPermissionForDomain,
      ).not.toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
      expect(activateAccountMock).toHaveBeenCalledWith('uuid');
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onSuccessMock).toBeCalledWith(null);
    });

    it('success with imported account', async () => {
      const handler = new AvalancheSelectAccountHandler(
        {
          activateAccount: activateAccountMock,
        } as any,
        permissionsServiceMock,
      );
      await handler.onActionApproved(
        {
          site: {} as any,
          displayData: {
            selectedAccount: { id: '0x1', type: AccountType.IMPORTED },
          },
        } as any,
        undefined,
        onSuccessMock,
        onErrorMock,
      );

      expect(
        permissionsServiceMock.setAccountPermissionForDomain,
      ).not.toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
      expect(activateAccountMock).toHaveBeenCalledWith('0x1');
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onSuccessMock).toBeCalledWith(null);
    });

    it('sets account permission when domain is defined', async () => {
      const handler = new AvalancheSelectAccountHandler(
        {
          activateAccount: activateAccountMock,
        } as any,
        permissionsServiceMock,
      );
      await handler.onActionApproved(
        {
          displayData: {
            selectedAccount: {
              id: '0x1',
              addressC: '0x1',
              type: AccountType.IMPORTED,
            },
          },
          site: {
            domain: 'core.app',
          },
        } as any,
        undefined,
        onSuccessMock,
        onErrorMock,
      );

      expect(
        permissionsServiceMock.setAccountPermissionForDomain,
      ).toHaveBeenCalled();
      expect(
        permissionsServiceMock.setAccountPermissionForDomain,
      ).toHaveBeenCalledWith('core.app', '0x1', true);
      expect(activateAccountMock).toHaveBeenCalledWith('0x1');
      expect(onSuccessMock).toBeCalledWith(null);
    });

    it('error', async () => {
      const mockError = new Error('something went wrong');
      const handler = new AvalancheSelectAccountHandler(
        {
          activateAccount: jest.fn().mockRejectedValueOnce(mockError),
        } as any,
        permissionsServiceMock,
      );

      await handler.onActionApproved(
        {
          request: {
            site: {} as any,
          },
          displayData: {
            selectedAccount: { index: 1 },
          },
        } as any,
        undefined,
        onSuccessMock,
        onErrorMock,
      );
      expect(
        permissionsServiceMock.setAccountPermissionForDomain,
      ).not.toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(onErrorMock).toBeCalledWith(mockError);
    });
  });
});
