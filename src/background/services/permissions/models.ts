import { NetworkVMType } from '@avalabs/vm-module-types';

export interface DappPermissions {
  domain: string;
  accounts: {
    [address: string]: NetworkVMType;
  };
}

export interface Permissions {
  [domain: string]: DappPermissions;
}

export enum PermissionEvents {
  PERMISSIONS_STATE_UPDATE = 'permissions-state-updated',
}

export const PERMISSION_STORAGE_KEY = 'permissions';
