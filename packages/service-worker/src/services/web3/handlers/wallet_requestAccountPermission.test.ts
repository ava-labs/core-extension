import {
  AccountType,
  DAppProviderRequest,
  DEFERRED_RESPONSE,
  Action,
  ActionStatus,
} from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';
import { PermissionsService } from '../../permissions/PermissionsService';
import { buildRpcCall } from '@shared/tests/test-utils';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { RequestAccountPermissionHandler } from './wallet_requestAccountPermission';
import { LockService } from '~/services/lock/LockService';

jest.mock('~/runtime/openApprovalWindow');

describe('background/services/web3/handlers/wallet_requestAccountPermission', () => {
  const addressC = '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  const addressSVM = '123456789asdfghjl';

  describe('handleAuthenticated', () => {
    it('returns error when no active account available', async () => {
      const handler = new RequestAccountPermissionHandler(
        { getActiveAccount: async () => undefined } as AccountsService,
        {} as PermissionsService,
        {} as LockService,
      );

      const mockRequest = {
        id: '1234',
        method: DAppProviderRequest.WALLET_CONNECT,
      };

      expect(
        await handler.handleAuthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        error: ethErrors.rpc.internal('wallet locked, undefined or malformed'),
      });
    });

    it('returns active account address for selected VM', async () => {
      const handler = new RequestAccountPermissionHandler(
        {
          getActiveAccount: async () => ({
            addressC,
            addressSVM,
          }),
        } as AccountsService,
        {} as PermissionsService,
        {} as LockService,
      );

      const mockRequest = {
        id: '1235',
        method: DAppProviderRequest.WALLET_CONNECT,
        params: {
          addressVM: NetworkVMType.SVM,
        },
      };

      expect(
        await handler.handleAuthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        result: [addressSVM],
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('returns error when domain not set', async () => {
      const handler = new RequestAccountPermissionHandler(
        {} as AccountsService,
        {} as PermissionsService,
        {} as LockService,
      );

      const mockRequest = {
        id: '1235',
        method: DAppProviderRequest.WALLET_CONNECT,
      };

      expect(
        await handler.handleUnauthenticated(buildRpcCall(mockRequest)),
      ).toEqual({
        ...mockRequest,
        error: ethErrors.rpc.invalidRequest('Unspecified dApp domain'),
      });
    });

    it('opens approval window', async () => {
      const handler = new RequestAccountPermissionHandler(
        {} as AccountsService,
        {} as PermissionsService,
        {} as LockService,
      );

      const mockRequest = {
        id: '1235',
        method: DAppProviderRequest.WALLET_CONNECT,
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
      activateAccount: jest.fn(),
      getActiveAccount: jest.fn(),
    };

    const permissionServiceMock = {
      grantPermission: jest.fn(),
      hasDomainPermissionForAccount: jest.fn(),
    };

    const mockAction: Action = {
      request: {
        id: '1235',
        method: DAppProviderRequest.WALLET_CONNECT,
        params: {
          addressVM: NetworkVMType.SVM,
        },
      },
      status: ActionStatus.SUBMITTING,
      displayData: {
        addressVM: NetworkVMType.SVM,
      },
      params: {
        addressVM: NetworkVMType.SVM,
      },
      time: 12312312,
      actionId: 'uuid',
    } as any;

    beforeEach(() => {
      jest.resetAllMocks();
      accountsServiceMock.getAccountByID.mockReturnValue({
        index: 2,
        id: 'uuid',
        addressC,
        addressSVM,
        type: AccountType.PRIMARY,
      });
    });

    it('returns error when no account is selected', async () => {
      accountsServiceMock.getAccountByID.mockReturnValueOnce(undefined);

      const handler = new RequestAccountPermissionHandler(
        accountsServiceMock as any,
        permissionServiceMock as any,
        {} as LockService,
      );

      await handler.onActionApproved(
        { ...mockAction },
        '',
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
      const handler = new RequestAccountPermissionHandler(
        accountsServiceMock as any,
        permissionServiceMock as any,
        {} as LockService,
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

      const handler = new RequestAccountPermissionHandler(
        {
          ...accountsServiceMock,
          getActiveAccount: async () => ({
            index: 2,
            id: 'uuid',
            addressC,
            addressSVM,
            type: AccountType.PRIMARY,
          }),
        } as any,
        permissionServiceMock as any,
        {} as LockService,
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
          addressSVM,
        }),
        NetworkVMType.SVM,
      );
      expect(permissionServiceMock.grantPermission).not.toHaveBeenCalled();
      expect(accountsServiceMock.activateAccount).not.toHaveBeenCalled();
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
      expect(onSuccessMock).toHaveBeenCalledWith([addressSVM]);
    });

    it('updates permissons for primary account', async () => {
      const handler = new RequestAccountPermissionHandler(
        accountsServiceMock as any,
        permissionServiceMock as any,
        {} as LockService,
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
        addressSVM,
        NetworkVMType.SVM,
      );
      expect(accountsServiceMock.activateAccount).toHaveBeenCalledTimes(1);
      expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith('uuid');
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
      expect(onSuccessMock).toHaveBeenCalledWith([addressSVM]);
    });

    it('updates permissons for imported account', async () => {
      accountsServiceMock.getAccountByID.mockReturnValue({
        id: '0x2',
        addressC,
        addressSVM,
        type: AccountType.IMPORTED,
      });

      const handler = new RequestAccountPermissionHandler(
        accountsServiceMock as any,
        permissionServiceMock as any,
        {} as LockService,
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
        addressSVM,
        NetworkVMType.SVM,
      );
      expect(accountsServiceMock.activateAccount).toHaveBeenCalledTimes(1);
      expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith('0x2');
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
      expect(onSuccessMock).toHaveBeenCalledWith([addressSVM]);
    });
  });
});
