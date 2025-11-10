import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { StorageService } from '../storage/StorageService';
import {
  DappPermissions,
  PermissionEvents,
  PERMISSION_STORAGE_KEY,
  PermissionsState,
  Account,
} from '@core/types';
import { mapAddressesToVMs } from '@core/common';
import { SYNCED_DOMAINS } from '@core/common';
import { PermissionsService } from './PermissionsService';
import { omit } from 'lodash';

jest.mock('../storage/StorageService');

describe('background/services/permissions/PermissionsService.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockPermissionData: PermissionsState = {
    permissions: {
      'noaccounts.example': {
        domain: 'noaccounts.example',
        accounts: {},
      },
      'oneaccount.example': {
        domain: 'oneaccount.example',
        accounts: {
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': NetworkVMType.EVM,
        },
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

      expect(result).toEqual(mockPermissionData.permissions);

      expect(storageService.load).toHaveBeenCalledTimes(1);
      expect(storageService.load).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY);
    });

    it('returns cached data for consecutive calls', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const result = await permissionService.getPermissions();
      expect(result).toEqual(mockPermissionData.permissions);
      expect(storageService.load).toHaveBeenCalledTimes(1);

      const result2 = await permissionService.getPermissions();
      expect(result2).toEqual(mockPermissionData.permissions);
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
      expect(result).toEqual(mockPermissionData.permissions);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(
        mockPermissionData.permissions,
        [NetworkVMType.EVM, NetworkVMType.SVM],
      );

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
      expect(permissionService['permissions']).toEqual(
        mockPermissionData.permissions,
      );

      permissionService.onLock();
      expect(permissionService['permissions']).toBeUndefined();

      expect(eventListener).toHaveBeenCalledTimes(2);
      expect(eventListener).toHaveBeenNthCalledWith(
        1,
        mockPermissionData.permissions,
        [NetworkVMType.EVM, NetworkVMType.SVM],
      );
      expect(eventListener).toHaveBeenNthCalledWith(2, {}, [
        NetworkVMType.EVM,
        NetworkVMType.SVM,
      ]);
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

      expect(result).toEqual(
        mockPermissionData.permissions['oneaccount.example'],
      );
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
        { addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' } as Account,
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
        { addressC: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' } as Account,
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
        { addressC: '0xnonexistentaccount' } as Account,
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
        { addressC: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' } as Account,
      );

      expect(result).toEqual(false);
    });
  });

  describe('grantPermission', () => {
    it('adds new permission for new domain and saves it to storage', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({});

      await permissionService.grantPermission(
        'oneaccount.example',
        '0x000000',
        NetworkVMType.EVM,
      );

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY, {
        permissions: {
          'oneaccount.example': {
            domain: 'oneaccount.example',
            accounts: {
              '0x000000': NetworkVMType.EVM,
            },
          },
        },
      });
    });

    it('updates already existing permissions', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      const domain = 'oneaccount.example';
      const newAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const vm = NetworkVMType.EVM;

      await permissionService.grantPermission(domain, newAddress, vm);

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY, {
        permissions: {
          ...mockPermissionData.permissions,
          [domain]: {
            domain,
            accounts: {
              ...mockPermissionData.permissions[domain]?.accounts,
              [newAddress]: vm,
            },
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
        ...mockPermissionData.permissions['oneaccount.example'],
      } as DappPermissions;
      await permissionService.grantPermission(
        'oneaccount.example',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        NetworkVMType.EVM,
      );

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(
        {
          'oneaccount.example': newPermission,
        },
        [NetworkVMType.EVM],
      );
    });
  });

  describe('revokePermission', () => {
    const addressA = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const addressB = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const domain = 'twoaccounts.example';
    const domainPermissions = {
      domain,
      accounts: {
        [addressA]: NetworkVMType.EVM,
        [addressB]: NetworkVMType.EVM,
      },
    };

    it('removes permissions for specified addresses', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        permissions: {
          ...mockPermissionData.permissions,
          [domain]: domainPermissions,
        },
      });

      const permissions = await permissionService.getPermissions();
      expect(permissions[domain]?.accounts).toHaveProperty(addressA);
      expect(permissions[domain]?.accounts).toHaveProperty(addressB);

      await permissionService.revokePermission(domain, [addressA]);

      const newPermissions = await permissionService.getPermissions();

      expect(newPermissions[domain]?.accounts).not.toHaveProperty(addressA);
      expect(newPermissions[domain]?.accounts).toHaveProperty(addressB);
    });

    it('saves updates to storage', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        permissions: {
          ...mockPermissionData.permissions,
          [domain]: domainPermissions,
        },
      });

      const permissions = await permissionService.getPermissions();

      await permissionService.revokePermission(domain, [addressA]);

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY, {
        permissions: {
          ...permissions,
          [domain]: {
            ...domainPermissions,
            accounts: omit(domainPermissions.accounts, addressA),
          },
        },
      });
    });

    it('emits updates when permissions change', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({
        permissions: {
          [domain]: domainPermissions,
        },
      });
      const eventListener = jest.fn();

      await permissionService.getPermissions();

      permissionService.addListener(
        PermissionEvents.PERMISSIONS_STATE_UPDATE,
        eventListener,
      );

      const newPermissions = await permissionService.revokePermission(domain, [
        addressA,
        addressB,
      ]);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(newPermissions, [
        NetworkVMType.EVM,
        NetworkVMType.SVM,
      ]);
    });
  });

  describe('grantPermission', () => {
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

      await permissionService.grantPermission(
        'newdomain.example',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        NetworkVMType.EVM,
      );

      const newPermissions = await permissionService.getPermissions();
      expect(
        newPermissions['newdomain.example']?.accounts[
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        ],
      ).toBe(NetworkVMType.EVM);
    });

    it('saves updates to storage', async () => {
      const permissionService = new PermissionsService(storageService);

      (storageService.load as jest.Mock).mockResolvedValue({});
      await permissionService.grantPermission(
        'newdomain.example',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        NetworkVMType.EVM,
      );

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY, {
        permissions: {
          'newdomain.example': {
            domain: 'newdomain.example',
            accounts: {
              '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': NetworkVMType.EVM,
            },
          },
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

      await permissionService.grantPermission(
        'newdomain.example',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        NetworkVMType.EVM,
      );

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(
        {
          'newdomain.example': {
            domain: 'newdomain.example',
            accounts: {
              '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': NetworkVMType.EVM,
            },
          },
        },
        [NetworkVMType.EVM],
      );
    });
  });

  describe('updateAccessForDomain()', () => {
    const existingAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const newAddressC = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const newAddressSVM = '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';

    const domain = 'existing.example';

    it('adds access for accounts with enabled flag set to true', async () => {
      const permissionService = new PermissionsService(storageService);

      const existingPermissions = {
        domain,
        accounts: {
          [existingAddress]: NetworkVMType.EVM,
        },
      };
      (storageService.load as jest.Mock).mockResolvedValue({
        permissions: {
          'existing.example': existingPermissions,
        },
      });

      const permissions = await permissionService.updateAccessForDomain({
        domain,
        accounts: [
          {
            account: {
              addressC: newAddressC,
              addressSVM: newAddressSVM,
            } as Account,
            enabled: true,
          },
        ],
        notifiedVMConnectors: [NetworkVMType.EVM],
      });

      expect(permissions[domain]?.accounts[existingAddress]).toBe(
        NetworkVMType.EVM,
      );
      expect(permissions[domain]?.accounts[newAddressC]).toBe(
        NetworkVMType.EVM,
      );
      expect(permissions[domain]?.accounts[newAddressSVM]).toBe(
        NetworkVMType.SVM,
      );
    });

    it('revokes access for accounts with enabled flag set to false', async () => {
      const permissionService = new PermissionsService(storageService);

      const existingPermissions = {
        domain,
        accounts: {
          [existingAddress]: NetworkVMType.EVM,
          [newAddressC]: NetworkVMType.EVM,
          [newAddressSVM]: NetworkVMType.SVM,
        },
      };
      (storageService.load as jest.Mock).mockResolvedValue({
        permissions: {
          'existing.example': existingPermissions,
        },
      });

      const permissions = await permissionService.updateAccessForDomain({
        domain,
        accounts: [
          {
            account: {
              addressC: existingAddress,
            } as Account,
            enabled: false,
          },
        ],
        notifiedVMConnectors: [NetworkVMType.EVM],
      });

      expect(permissions[domain]?.accounts).not.toHaveProperty(existingAddress);
      expect(permissions[domain]?.accounts).toHaveProperty(newAddressC);
      expect(permissions[domain]?.accounts).toHaveProperty(newAddressSVM);
    });

    it('saves updates to storage', async () => {
      const permissionService = new PermissionsService(storageService);

      const existingPermissions = {
        domain,
        accounts: {
          [existingAddress]: NetworkVMType.EVM,
        },
      };
      (storageService.load as jest.Mock).mockResolvedValue(existingPermissions);
      await permissionService.updateAccessForDomain({
        domain,
        accounts: [
          {
            account: {
              addressC: newAddressC,
              addressSVM: newAddressSVM,
            } as Account,
            enabled: true,
          },
        ],
        notifiedVMConnectors: [NetworkVMType.EVM],
      });

      expect(storageService.save).toHaveBeenCalledTimes(1);
      expect(storageService.save).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY, {
        permissions: {
          [domain]: {
            domain,
            accounts: {
              [newAddressC]: NetworkVMType.EVM,
              [newAddressSVM]: NetworkVMType.SVM,
            },
          },
        },
      });
    });
  });

  describe('whitelistCoreDomains', () => {
    it('calls setAccountPermissionForDomain', async () => {
      const permissionService = new PermissionsService(storageService);
      permissionService.grantPermission = jest.fn();

      (storageService.load as jest.Mock).mockResolvedValue({
        ...mockPermissionData,
      });

      await permissionService.whitelistCoreDomains(
        mapAddressesToVMs({
          addressC: '0x000000',
          addressSVM: 'jklghbcda',
        } as Account),
      );

      // Ensure new data is added and existing data is preserved
      expect(permissionService.permissions).toEqual(
        SYNCED_DOMAINS.reduce(
          (perms, domain) => ({
            ...perms,
            [domain]: {
              domain,
              accounts: {
                ...perms[domain]?.accounts,
                '0x000000': NetworkVMType.EVM,
                jklghbcda: NetworkVMType.SVM,
              },
            },
          }),
          { ...mockPermissionData.permissions },
        ),
      );
      expect(storageService.save).toHaveBeenCalledWith(PERMISSION_STORAGE_KEY, {
        permissions: permissionService.permissions,
      });
    });
  });
});
