import { KeyInfo, KeyTypeApi } from '@cubist-labs/cubesigner-sdk';

import { AddressPublicKeyJson } from '@core/types';

export type ValidPublicKey = Omit<KeyInfo, 'derivation_info'> & {
  derivation_info: NonNullable<KeyInfo['derivation_info']>;
};

export type KeySetEntry = {
  type: KeyTypeApi;
  key: AddressPublicKeyJson;
};

export type KeySet = KeySetEntry[];

export type KeySetDictionary = Record<number, KeySet>;
export type MnemonicAccountDictionary = Record<string, KeySetDictionary>;
