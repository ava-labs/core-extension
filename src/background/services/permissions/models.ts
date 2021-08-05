export interface DappPermissions {
  domain: string;
  accounts: {
    [account: string]: boolean;
  };
}

export interface Permissions {
  [domain: string]: DappPermissions;
}
