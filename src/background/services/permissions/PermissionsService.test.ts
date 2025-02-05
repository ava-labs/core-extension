import { StorageService } from '../storage/StorageService';
import type { DappPermissions, Permissions } from './models';
import { PermissionEvents, PERMISSION_STORAGE_KEY } from './models';
import { PermissionsService } from './PermissionsService';

jest.mock('../storage/StorageService');

describe('background/services/permissions/PermissionsService.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockPermissionData: Permissions = {
    'noaccounts.example': {
      domain: 'noaccounts.example',
      accounts: {},
    },
    'oneaccount.example': {
      domain: 'oneaccount.example',
      accounts: {
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': true,
        '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa': false,
      },
    },
  };
  const storageService = new StorageService({} as any);

  describe('getPermissions', () => {
    it('returns permissions from storage', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const result = await permissionService.getPermissions();

      expect(result).toEqual(mockPermissionData);

      expect(storageService.load).toHaveBeenCalledTimes(1);
      expect(storageService.load).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY);
    });

    it('returns cached data for consecutive calls', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const result = await permissionService.getPermissions();
      expect(result).toEqual(mockPermissionData);
      expect(storageService.load).toHaveBeenCalledTimes(1);

      const result2 = await permissionService.getPermissions();
      expect(result2).toEqual(mockPermissionData);
      expect(storageService.load).toHaveBeenCalledTimes(1);
    });

    it('returns empty object in case of load error', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockRejectedValue(
        new Error('storage error'),
      );

      const result = await permissionService.getPermissions();
      expect(result).toEqual({});
      expect(storageService.load).toHaveBeenCalledTimes(1);
    });

    it('emits new values on first read', async () => {
      const permissionService = new PermissionsService(storageService);
      const eventListener = jest.fn();

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });
      permissionService.addListener(
        PermissionEvents.PERMISSIONS_STATE_UPDATE,
        eventListener,
      );

      const result = await permissionService.getPermissions();
      expect(result).toEqual(mockPermissionData);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(mockPermissionData);

      await permissionService.getPermissions();
      expect(eventListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('onLock', () => {
    it('cleans up state after lock', async () => {
      const permissionService = new PermissionsService(storageService);
      const eventListener = jest.fn();

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });
      permissionService.addListener(
        PermissionEvents.PERMISSIONS_STATE_UPDATE,
        eventListener,
      );

      await permissionService.getPermissions();
      expect(permissionService['permissions']).toEqual(mockPermissionData);

      permissionService.onLock();
      expect(permissionService['permissions']).toBeUndefined();

      expect(eventListener).toHaveBeenCalledTimes(2);
      expect(eventListener).toHaveBeenNthCalledWith(1, mockPermissionData);
      expect(eventListener).toHaveBeenNthCalledWith(2, {});
    });
  });

  describe('getPermissionsForDomain', () => {
    it('returns permissions for a given domain', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const result =
        await permissionService.getPermissionsForDomain('oneaccount.example');

      expect(result).toEqual(mockPermissionData['oneaccount.example']);
    });

    it('returns undefined for unknown domains', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const result = await permissionService.getPermissionsForDomain('unknown');

      expect(result).toBeUndefined();
    });
  });

  describe('hasDomainPermissionForAccount', () => {
    it('returns true if the account has permission', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const result = await permissionService.hasDomainPermissionForAccount(
        'oneaccount.example',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      );

      expect(result).toEqual(true);
    });

    it('returns false if the account has no permission', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const result = await permissionService.hasDomainPermissionForAccount(
        'oneaccount.example',
        '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      );

      expect(result).toEqual(false);
    });

    it('returns false if the account is not found', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const result = await permissionService.hasDomainPermissionForAccount(
        'oneaccount.example',
        '0xnonexistentaccount',
      );

      expect(result).toEqual(false);
    });

    it('returns false if the domain is not found', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const result = await permissionService.hasDomainPermissionForAccount(
        'unkown.domain',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      );

      expect(result).toEqual(false);
    });
  });

  describe('addPermission', () => {
    it('adds new permission for new domain and saves it to storage', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({});

      const newPermission = {
        ...mockPermissionData['oneaccount.example'],
      } as DappPermissions;

      await permissionService.addPermission(newPermission);

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY, {
        'oneaccount.example': newPermission,
      });
    });

    it('updates already existing permissions', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const newPermission = {
        domain: 'oneaccount.example',
        accounts: {
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa': true,
        },
      } as DappPermissions;

      await permissionService.addPermission(newPermission);

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY, {
        ...mockPermissionData,
        'oneaccount.example': {
          ...newPermission,
          accounts: {
            ...mockPermissionData[newPermission.domain]?.accounts,
            ...newPermission.accounts,
          },
        },
      });
    });

    it('emits updates when permissions change', async () => {
      const permissionService = new PermissionsService(storageService);
      const eventListener = jest.fn();

      (storageService.load as jest.Mock).mockResolvedValue({});
      await permissionService.getPermissions();

      permissionService.addListener(
        PermissionEvents.PERMISSIONS_STATE_UPDATE,
        eventListener,
      );

      const newPermission = {
        ...mockPermissionData['oneaccount.example'],
      } as DappPermissions;
      await permissionService.addPermission(newPermission);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith({
        'oneaccount.example': newPermission,
      });
    });
  });

  describe('setAccountPermissionForDomain', () => {
    it('changes permission of an already added account', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const permissions = await permissionService.getPermissions();
      expect(
        permissions['oneaccount.example']?.accounts[
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        ],
      ).toBe(true);

      await permissionService.setAccountPermissionForDomain(
        'oneaccount.example',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        false,
      );

      const newPermissions = await permissionService.getPermissions();
      expect(
        newPermissions['oneaccount.example']?.accounts[
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        ],
      ).toBe(false);
    });

    it('adds domain if missing', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const permissions = await permissionService.getPermissions();
      expect(
        permissions['newdomain.example']?.accounts[
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        ],
      ).toBe(undefined);

      await permissionService.setAccountPermissionForDomain(
        'newdomain.example',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        true,
      );

      const newPermissions = await permissionService.getPermissions();
      expect(
        newPermissions['newdomain.example']?.accounts[
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        ],
      ).toBe(true);
    });

    it('saves updates to storage', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({});
      await permissionService.setAccountPermissionForDomain(
        'newdomain.example',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        true,
      );

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY, {
        'newdomain.example': {
          domain: 'newdomain.example',
          accounts: { '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': true },
        },
      });
    });

    it('emits updates when permissions change', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({});
      const eventListener = jest.fn();

      await permissionService.getPermissions();

      permissionService.addListener(
        PermissionEvents.PERMISSIONS_STATE_UPDATE,
        eventListener,
      );

      await permissionService.setAccountPermissionForDomain(
        'newdomain.example',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        true,
      );

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith({
        'newdomain.example': {
          domain: 'newdomain.example',
          accounts: { '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': true },
        },
      });
    });
  });

  describe('addWhitelistDomains', () => {
    it('calls setAccountPermissionForDomain', async () => {
      const permissionService = new PermissionsService(storageService);
      permissionService.setAccountPermissionForDomain = jest.fn();

      (storageService.load as jest.Mock).mockResolvedValue({});

      await permissionService.addWhitelistDomains('0x000000');
      expect(
        permissionService.setAccountPermissionForDomain,
      ).toHaveBeenCalledTimes(2);
      expect(
        permissionService.setAccountPermissionForDomain,
      ).toHaveBeenNthCalledWith(1, 'core.app', '0x000000', true);
      expect(
        permissionService.setAccountPermissionForDomain,
      ).toHaveBeenNthCalledWith(2, 'test.core.app', '0x000000', true);
    });
  });
});
