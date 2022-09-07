import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { ethErrors } from 'eth-rpc-errors';
import { container } from 'tsyringe';
import { AccountsService } from '../../accounts/AccountsService';
import { ActionsService } from '../../actions/ActionsService';
import { Action, ActionStatus } from '../../actions/models';
import { PermissionsService } from '../../permissions/PermissionsService';
import { ConnectRequestHandler } from './connect';

jest.mock('@src/utils/extensionUtils', () => ({
  openExtensionNewWindow: jest.fn().mockReturnValue({ id: 123 }),
}));

describe('background/services/web3/handlers/connect.ts', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  describe('handleAuthenticated', () => {
    it('returns error when no active account available', async () => {
      const handler = new ConnectRequestHandler(
        { activeAccount: undefined } as AccountsService,
        {} as PermissionsService
      );

      const mockRequest = { id: 1234 };

      expect(await handler.handleAuthenticated(mockRequest)).toEqual({
        ...mockRequest,
        error: ethErrors.rpc.internal('wallet locked, undefined or malformed'),
      });
    });

    it('returns active account address', async () => {
      const handler = new ConnectRequestHandler(
        {
          activeAccount: {
            addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            addressBTC: '',
          },
        } as AccountsService,
        {} as PermissionsService
      );

      const mockRequest = { id: 1235 };

      expect(await handler.handleAuthenticated(mockRequest)).toEqual({
        ...mockRequest,
        result: ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('returns error when domain not set', async () => {
      const handler = new ConnectRequestHandler(
        {} as AccountsService,
        {} as PermissionsService
      );

      const mockRequest = { id: 1235 };

      expect(await handler.handleUnauthenticated(mockRequest)).toEqual({
        ...mockRequest,
        error: ethErrors.rpc.invalidRequest('domain unknown'),
      });
    });

    it('opens approval window', async () => {
      const handler = new ConnectRequestHandler(
        {} as AccountsService,
        {} as PermissionsService
      );

      const actionsServiceMock = {
        addAction: jest.fn(),
      };
      container.registerInstance(ActionsService, actionsServiceMock as any);

      const mockRequest = {
        id: 1235,
        site: {
          domain: 'example.com',
          name: 'Example dapp',
          icon: 'icon.svg',
          tabId: 111,
        },
      };

      const result = await handler.handleUnauthenticated(mockRequest);
      expect(result).toEqual({
        ...mockRequest,
        result: DEFERRED_RESPONSE,
      });

      expect(actionsServiceMock.addAction).toHaveBeenCalledTimes(1);
      expect(actionsServiceMock.addAction).toHaveBeenCalledWith({
        ...mockRequest,
        displayData: {
          domainIcon: 'icon.svg',
          domainName: 'Example dapp',
          domainUrl: 'example.com',
        },
        tabId: 111,
        popupWindowId: 123,
      });

      expect(openExtensionNewWindow).toHaveBeenCalledTimes(1);
      expect(openExtensionNewWindow).toHaveBeenCalledWith(
        `permissions?id=1235`,
        ''
      );
    });
  });

  describe('onActionApproved', () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    const accountsServiceMock = {
      getAccounts: () => [
        {
          index: 1,
          addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        },
        {
          index: 2,
          addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        },
      ],
      activateAccount: jest.fn(),
    };

    const permissionServiceMock = {
      setAccountPermissionForDomain: jest.fn(),
    };

    const mockAction: Action = {
      id: 1235,
      status: ActionStatus.SUBMITTING,
      method: DAppProviderRequest.CONNECT_METHOD,
      jsonrpc: '2.0',
      displayData: {},
      time: 12312312,
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('returns error when no account is selected', async () => {
      const handler = new ConnectRequestHandler(
        accountsServiceMock as any,
        permissionServiceMock as any
      );

      await handler.onActionApproved(
        { ...mockAction },
        undefined,
        onSuccessMock,
        onErrorMock
      );

      expect(
        permissionServiceMock.setAccountPermissionForDomain
      ).not.toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(
        ethErrors.rpc.internal('Selected account not found')
      );
    });

    it('returns error when domain not set', async () => {
      const handler = new ConnectRequestHandler(
        accountsServiceMock as any,
        permissionServiceMock as any
      );

      await handler.onActionApproved(
        { ...mockAction },
        2,
        onSuccessMock,
        onErrorMock
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(
        ethErrors.rpc.internal('Domain not set')
      );
      expect(
        permissionServiceMock.setAccountPermissionForDomain
      ).not.toHaveBeenCalled();
      expect(accountsServiceMock.activateAccount).not.toHaveBeenCalled();
      expect(onSuccessMock).not.toHaveBeenCalled();
    });

    it('updates permissons', async () => {
      const handler = new ConnectRequestHandler(
        accountsServiceMock as any,
        permissionServiceMock as any
      );

      await handler.onActionApproved(
        { ...mockAction, site: { domain: 'example.com' } },
        2,
        onSuccessMock,
        onErrorMock
      );

      expect(onErrorMock).not.toHaveBeenCalled();
      expect(
        permissionServiceMock.setAccountPermissionForDomain
      ).toHaveBeenCalledTimes(1);
      expect(
        permissionServiceMock.setAccountPermissionForDomain
      ).toHaveBeenCalledWith(
        'example.com',
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        true
      );
      expect(accountsServiceMock.activateAccount).toHaveBeenCalledTimes(1);
      expect(accountsServiceMock.activateAccount).toHaveBeenCalledWith(2);
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
      expect(onSuccessMock).toHaveBeenCalledWith([
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      ]);
    });
  });
});
