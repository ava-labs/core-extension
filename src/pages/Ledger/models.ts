export type DerivationStatus = 'waiting' | 'ready';

export type DerivedAddressInfo = {
  address: string;
  balance: string;
  explorerLink: string;
};

export type SolanaPublicKey = {
  index: number;
  key: string;
};
