import { ExtendedPublicKey } from '@core/types';

export const buildExtendedPublicKey = (
  key: string,
  derivationPath: string,
): ExtendedPublicKey => ({
  type: 'extended-pubkey',
  curve: 'secp256k1',
  derivationPath,
  key,
});
