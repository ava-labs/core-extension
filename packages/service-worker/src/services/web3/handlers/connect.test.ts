import {
  AccountType,
  Action,
  ActionStatus,
  DEFERRED_RESPONSE,
  DAppProviderRequest,
} from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';
import { PermissionsService } from '../../permissions/PermissionsService';
import { ConnectRequestHandler } from './connect';
import { buildRpcCall } from '@shared/tests/test-utils';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { NetworkVMType } from '@avalabs/vm-module-types';

jest.mock('~/runtime/openApprovalWindow');

describe('background/services/web3/handlers/connect.ts', () => {
  describe('handleAuthenticated', () => {
    it('returns error when no active account available', async () => {
      const handler = new ConnectRequestHandler(
        { getActiveAccount: async () => undefined } as AccountsService,
        {} as PermissionsService,
      );

      const mockRequest = {
        id: '1234',
        method: DAppProviderRequest.CONNECT_METHOD,
      };

      expect(
        await handler.handleAuthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        error: ethErrors.rpc.internal('wallet locked, undefined or malformed'),
      });
    });

    it('returns active account address', async () => {
      const handler = new ConnectRequestHandler(
        {
          getActiveAccount: async () => ({
            addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            addressBTC: '',
          }),
        } as AccountsService,
        {} as PermissionsService,
      );

      const mockRequest = {
        id: '1235',
        method: DAppProviderRequest.CONNECT_METHOD,
      };

      expect(
        await handler.handleAuthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        result: ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('returns error when domain not set', async () => {
      const handler = new ConnectRequestHandler(
        {} as AccountsService,
        {} as PermissionsService,
      );

      const mockRequest = {
        id: '1235',
        method: DAppProviderRequest.CONNECT_METHOD,
      };

      expect(
        await handler.handleUnauthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        error: ethErrors.rpc.invalidRequest('domain unknown'),
      });
    });

    it('opens approval window', async () => {
      const handler = new ConnectRequestHandler(
        {} as AccountsService,
        {} as PermissionsService,
      );

      const mockRequest = {
        id: '1235',
        method: DAppProviderRequest.CONNECT_METHOD,
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
        expect.objectContaining({ id: '1235' }),
        'permissions',
      );
    });
  });

  describe('onActionApproved', () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    const accountsServiceMock = {
      getAccountByID: jest.fn(),
      getActiveAccount: jest.fn(),
      activateAccount: jest.fn(),
    };

    const permissionServiceMock = {
      grantPermission: jest.fn(),
      hasDomainPermissionForAccount: jest.fn(),
    };

    const mockAction: Action = {
      request: {
        id: '1235',
        method: DAppProviderRequest.CONNECT_METHOD,
      },
      status: ActionStatus.SUBMITTING,
      displayData: {},
      params: {
        addressVM: NetworkVMType.EVM,
      },
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

      const handler = new ConnectRequestHandler(
        accountsServiceMock as any,
        permissionServiceMock as any,
      );

      await handler.onActionApproved(
        { ...mockAction },
        undefined,
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
      const handler = new ConnectRequestHandler(
        accountsServiceMock as any,
        permissionServiceMock as any,
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

    it('returns address when permissons already set for the selected active account', async () => {
      permissionServiceMock.hasDomainPermissionForAccount.mockReturnValue(true);

      const handler = new ConnectRequestHandler(
        {
          ...accountsServiceMock,
          getActiveAccount: async () => ({
            index: 2,
            id: 'uuid',
            addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            type: AccountType.PRIMARY,
          }),
        } as any,
        permissionServiceMock as any,
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
      expect(
        permissionServiceMock.hasDomainPermissionForAccount,
      ).toHaveBeenCalledTimes(1);
      expect(
        permissionServiceMock.hasDomainPermissionForAccount,
      ).toHaveBeenCalledWith(
        'example.com',
        expect.objectContaining({
          addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        }),
        NetworkVMType.EVM,
      );
      expect(permissionServiceMock.grantPermission).not.toHaveBeenCalled();
      expect(accountsServiceMock.activateAccount).not.toHaveBeenCalled();
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
      expect(onSuccessMock).toHaveBeenCalledWith([
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      ]);
    });

    it('updates permissons for primary account', async () => {
      const handler = new ConnectRequestHandler(
        accountsServiceMock as any,
        permissionServiceMock as any,
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
      expect(onSuccessMock).toHaveBeenCalledWith([
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      ]);
    });

    it('updates permissons for imported account', async () => {
      accountsServiceMock.getAccountByID.mockReturnValue({
        id: '0x2',
        addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        type: AccountType.IMPORTED,
      });

      const handler = new ConnectRequestHandler(
        accountsServiceMock as any,
        permissionServiceMock as any,
      );

      await handler.onActionApproved(
        {
          ...mockAction,
          site: { domain: 'example.com' },
        },
        '0x2',
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
      expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith('0x2');
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
      expect(onSuccessMock).toHaveBeenCalledWith([
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      ]);
    });
  });
});
