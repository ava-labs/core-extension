export interface DappPermissions {
  domain: string;
  accounts: {
    [addressC: string]: boolean;
  };
}

export interface Permissions {
  [domain: string]: DappPermissions;
}

export enum PermissionEvents {
  PERMISSIONS_STATE_UPDATE = 'permissions-state-updated',
}

export const PERMISSION_STORAGE_KEY = 'permissions';
