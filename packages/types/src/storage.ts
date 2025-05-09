export const WALLET_STORAGE_ENCRYPTION_KEY = 'WALLET_STORAGE_ENCRYPTION_KEY';

export interface WalletStorageEncryptionKeyData {
  storageKey: string;
}

export enum KeyDerivationVersion {
  V1 = 'V1',
  V2 = 'V2',
}

export interface EncryptedData {
  cypher: number[];
  nonce: number[];
  salt?: number[];
  keyDerivationVersion?: KeyDerivationVersion;
}

export interface UnencryptedData<T = any> {
  data: T;
}
