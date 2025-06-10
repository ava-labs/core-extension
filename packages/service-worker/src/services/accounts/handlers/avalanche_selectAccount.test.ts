import { NetworkVMType } from '@avalabs/vm-module-types';
import { canSkipApproval } from '@core/common';
import {
  AccountType,
  DAppProviderRequest,
  DEFERRED_RESPONSE,
} from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { container } from 'tsyringe';
import { ActionsService } from '../../actions/ActionsService';
import { AvalancheSelectAccountHandler } from './avalanche_selectAccount';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  canSkipApproval: jest.fn(),
}));
jest.mock('~/runtime/openApprovalWindow');

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
    grantPermission: jest.fn(),
  } as any;

  container.registerInstance(ActionsService, actionsServiceMock as any);

  beforeEach(() => {
    jest.resetAllMocks();

    (openApprovalWindow as jest.Mock).mockReturnValue({ id: 123 });
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

      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: [1],
        site: { tabId: 1 },
      } as any;

      const actionData = {
        ...request,
        displayData: {
          selectedAccount: account,
        },
        scope: 'eip155:43113',
        type: 'single',
      };

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(openApprovalWindow).toHaveBeenCalled();
      expect(openApprovalWindow).toHaveBeenCalledWith(
        actionData,
        'switchAccount',
      );
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

      const request = {
        id: '123',
        method: DAppProviderRequest.ACCOUNT_SELECT,
        params: ['0x1'],
        site: { tabId: 1 },
      } as any;

      const actionData = {
        ...request,
        displayData: {
          selectedAccount: account,
        },
        scope: 'eip155:43113',
        type: 'single',
      };

      const result = await handler.handleAuthenticated(buildRpcCall(request));

      expect(openApprovalWindow).toHaveBeenCalledWith(
        actionData,
        'switchAccount',
      );
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
      expect(openApprovalWindow).not.toHaveBeenCalled();
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
      expect(openApprovalWindow).toHaveBeenCalledWith(
        expect.objectContaining({
          ...request,
          displayData: {
            selectedAccount: accounts[1],
          },
        }),
        'switchAccount',
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

      expect(permissionsServiceMock.grantPermission).not.toHaveBeenCalled();
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

      expect(permissionsServiceMock.grantPermission).not.toHaveBeenCalled();
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

      expect(permissionsServiceMock.grantPermission).toHaveBeenCalledWith(
        'core.app',
        '0x1',
        NetworkVMType.EVM,
      );
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
      expect(permissionsServiceMock.grantPermission).not.toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalled();
      expect(onErrorMock).toBeCalledWith(mockError);
    });
  });
});
