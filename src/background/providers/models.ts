export interface ChainChangedEventData {
  chainId: string;
  networkVersion: string;
}

export type AccountsChangedEventData = string[];

export interface UnlockStateChangedEventData {
  accounts: string[];
  isUnlocked: boolean;
}
