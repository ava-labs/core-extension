export interface DappPermissions {
  domain: string;
  accounts: {
    [account: number]: boolean;
  };
}

export interface Permissions {
  [domain: string]: DappPermissions;
}
