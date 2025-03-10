import { NetworkVMType } from '@avalabs/vm-module-types';

export interface DappPermissions {
  domain: string;
  accounts: {
    [address: string]: {
      vm: NetworkVMType;
      hasAccess: boolean;
    };
  };
}

export interface Permissions {
  [domain: string]: DappPermissions;
}

export enum PermissionEvents {
  PERMISSIONS_STATE_UPDATE = 'permissions-state-updated',
}

export const PERMISSION_STORAGE_KEY = 'permissions';
