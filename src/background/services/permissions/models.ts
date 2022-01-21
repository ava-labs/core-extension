export interface DappPermissions {
  domain: string;
  accounts: {
    [addressC: string]: boolean;
  };
}

export interface Permissions {
  [domain: string]: DappPermissions;
}
