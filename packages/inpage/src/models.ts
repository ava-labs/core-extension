import { Eip1193Provider } from 'ethers';

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

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: 'eip6963:announceProvider';
  detail: EIP6963ProviderDetail;
}

export enum EventNames {
  CORE_WALLET_ANNOUNCE_PROVIDER = 'core-wallet:announceProvider',
  CORE_WALLET_REQUEST_PROVIDER = 'core-wallet:requestProvider',
  EIP6963_ANNOUNCE_PROVIDER = 'eip6963:announceProvider',
  EIP6963_REQUEST_PROVIDER = 'eip6963:requestProvider',
}
