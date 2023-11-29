export const WALLET_STORAGE_ENCRYPTION_KEY = 'WALLET_STORAGE_ENCRYPTION_KEY';

export interface EncryptedData {
  cypher: number[];
  nonce: number[];
  salt?: number[];
}

export interface UnencryptedData<T = any> {
  data: T;
}
