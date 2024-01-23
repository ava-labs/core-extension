import { Eip1193Provider } from 'ethers';

export interface ChainChangedEventData {
  chainId: string;
  networkVersion: string;
}

export type AccountsChangedEventData = string[];

export interface UnlockStateChangedEventData {
  accounts: string[];
  isUnlocked: boolean;
}

interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: Eip1193Provider;
}
