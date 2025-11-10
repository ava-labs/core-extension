import {
  AccountType,
  DAppProviderRequest,
  DEFERRED_RESPONSE,
  Action,
  ActionStatus,
} from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';
import { PermissionsService } from '../PermissionsService';
import { WalletRequestPermissionsHandler } from './wallet_requestPermissions';
import { getPermissionsConvertedToMetaMaskStructure } from '../utils/getPermissionsConvertedToMetaMaskStructure';
import { buildRpcCall } from '@shared/tests/test-utils';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { NetworkVMType } from '@avalabs/vm-module-types';

jest.mock('~/runtime/openApprovalWindow');
jest.mock('../utils/getPermissionsConvertedToMetaMaskStructure');

describe('background/services/permissions/handlers/wallet_requestPermissions.ts', () => {
  describe('handleAuthenticated', () => {
    it('calls handle authenticated', async () => {
      const handler = new WalletRequestPermissionsHandler(
        {} as PermissionsService,
        {
          getActiveAccount: jest.fn(),
        } as unknown as AccountsService,
      );
      const handleUnauthenticatedSpy = jest.spyOn(
        handler,
        'handleUnauthenticated',
      );
      const mockRequest = {
        id: '1234',
        method: DAppProviderRequest.WALLET_PERMISSIONS,
        site: {
          domain: 'example.com',
          name: 'Example dapp',
          icon: 'icon.svg',
          tabId: 111,
        },
      };
      await handler.handleAuthenticated(buildRpcCall(mockRequest));
      expect(handleUnauthenticatedSpy).toBeCalledTimes(1);
      expect(handleUnauthenticatedSpy).toBeCalledWith(
        buildRpcCall(mockRequest),
      );
    });
  });
  describe('handleUnauthenticated', () => {
    it('opens permissions window', async () => {
      const handler = new WalletRequestPermissionsHandler(
        {} as PermissionsService,
        {} as AccountsService,
      );

      const mockRequest = {
        id: '4321',
        method: DAppProviderRequest.WALLET_PERMISSIONS,
        site: {
          domain: 'example.com',
          name: 'Example dapp',
          icon: 'icon.svg',
          tabId: 111,
        },
      };

      const result = await handler.handleUnauthenticated(
        buildRpcCall(mockRequest),
      );
      expect(result).toEqual({
        ...mockRequest,
        result: DEFERRED_RESPONSE,
      });
      expect(openApprovalWindow).toHaveBeenCalledTimes(1);
      expect(openApprovalWindow).toHaveBeenCalledWith(
        expect.objectContaining({ id: '4321' }),
        `permissions`,
      );
    });
  });

  describe('onActionApproved', () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    const accountsServiceMock = {
      getAccountByID: jest.fn(),
      activateAccount: jest.fn(),
      getActiveAccount: jest.fn(),
    };

    const permissionServiceMock = {
      grantPermission: jest.fn(),
    };

    const mockAction: Action = {
      request: {
        id: '5432',
        method: DAppProviderRequest.WALLET_PERMISSIONS,
      },
      status: ActionStatus.SUBMITTING,
      displayData: {},
      time: 12312312,
      actionId: 'uuid',
    } as any;

    beforeEach(() => {
      jest.resetAllMocks();
      accountsServiceMock.getAccountByID.mockReturnValue({
        index: 2,
        id: 'uuid',
        addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        type: AccountType.PRIMARY,
      });
    });

    it('returns error when no account is selected', async () => {
      accountsServiceMock.getAccountByID.mockReturnValueOnce(undefined);

      const handler = new WalletRequestPermissionsHandler(
        permissionServiceMock as any,
        accountsServiceMock as any,
      );

      await handler.onActionApproved(
        { ...mockAction },
        [],
        onSuccessMock,
        onErrorMock,
      );

      expect(permissionServiceMock.grantPermission).not.toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(
        ethErrors.rpc.internal('Selected account not found'),
      );
    });

    it('returns error when domain not set', async () => {
      const handler = new WalletRequestPermissionsHandler(
        permissionServiceMock as any,
        accountsServiceMock as any,
      );

      await handler.onActionApproved(
        { ...mockAction },
        'uuid',
        onSuccessMock,
        onErrorMock,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(
        ethErrors.rpc.internal('Domain not set'),
      );
      expect(permissionServiceMock.grantPermission).not.toHaveBeenCalled();
      expect(accountsServiceMock.activateAccount).not.toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();
    });

    it('updates permissons for selected account on calls onSuccess', async () => {
      const mockPermissions = {
        'example.com': {
          domain: 'example.com',
          accounts: {
            '123': NetworkVMType.EVM,
            '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': NetworkVMType.EVM,
          },
        },
      };
      const metamaskStructure = [
        { invoker: 'example.com', parentCapabitily: 'accounts' },
      ];
      (getPermissionsConvertedToMetaMaskStructure as jest.Mock).mockReturnValue(
        metamaskStructure,
      );

      permissionServiceMock.grantPermission.mockReturnValue(mockPermissions);

      const handler = new WalletRequestPermissionsHandler(
        permissionServiceMock as any,
        accountsServiceMock as any,
      );

      await handler.onActionApproved(
        {
          ...mockAction,
          site: { domain: 'example.com' },
        },
        'uuid',
        onSuccessMock,
        onErrorMock,
      );

      expect(onErrorMock).not.toHaveBeenCalled();
      expect(permissionServiceMock.grantPermission).toHaveBeenCalledTimes(1);
      expect(permissionServiceMock.grantPermission).toHaveBeenCalledWith(
        'example.com',
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        NetworkVMType.EVM,
      );
      expect(accountsServiceMock.activateAccount).toHaveBeenCalledTimes(1);
      expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith('uuid');
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
      expect(getPermissionsConvertedToMetaMaskStructure).toHaveBeenCalledTimes(
        1,
      );
      expect(onSuccessMock).toHaveBeenCalledWith(metamaskStructure);
    });
  });
});
