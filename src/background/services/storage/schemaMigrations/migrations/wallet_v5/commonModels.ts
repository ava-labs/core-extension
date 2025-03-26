export type BtcWalletPolicyDetails = {
  hmacHex: string;
  /**
   * Extended public key of m/44'/60'/n
   */
  xpub: string;
  masterFingerprint: string;
  name: string;
};

export type PubKeyType = {
  evm: string;
  /**
   * Public keys used for X/P chain are from a different derivation path.
   */
  xp?: string;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
  ed25519?: string;
};

export type ImportedPrivateKeySecrets = {
  secretType: 'private-key';
  secret: string;
};

export type ImportedWalletConnectSecrets = {
  secretType: 'wallet-connect';
  addresses: {
    addressC: string;
    addressBTC?: string;
    addressAVM?: string;
    addressPVM?: string;
    addressCoreEth?: string;
  };
  pubKey?: PubKeyType;
};

export type ImportedFireblocksSecrets = {
  secretType: 'fireblocks';
  addresses: {
    addressC: string;
    addressBTC?: string;
  };
  api?: {
    vaultAccountId: string;
    key: string;
    secret: string;
  };
};
