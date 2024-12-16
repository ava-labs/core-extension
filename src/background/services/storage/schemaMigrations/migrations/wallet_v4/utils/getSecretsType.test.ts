import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';
import { getSecretsType } from './getSecretsType';
import { SecretType } from '@src/background/services/secrets/models';
import { PubKeyType } from '@src/background/services/wallet/models';

describe('getSecretsType()', () => {
  it('should throw an error', () => {
    const walletType = () => getSecretsType({});
    expect(walletType).toThrow(
      'Cannot get the secret type for a primary account',
    );
  });

  it('should return the `ledger` secret type', () => {
    const walletType = getSecretsType({
      xpub: 'xpub',
    });
    expect(walletType).toBe(SecretType.Ledger);
  });
  it('should return the `ledger live` secret type', () => {
    const walletType = getSecretsType({
      pubKeys: ['xpub'] as unknown as PubKeyType[],
    });
    expect(walletType).toBe(SecretType.LedgerLive);
  });
  it('should return the `seedless` secret type', () => {
    const walletType = getSecretsType({
      seedlessSignerToken: 'xpub' as unknown as SignerSessionData,
    });
    expect(walletType).toBe(SecretType.Seedless);
  });
  it('should return the `mnemonic` secret type', () => {
    const walletType = getSecretsType({
      xpub: 'xpub',
      mnemonic: 'mnemonic',
      xpubXP: 'xpubXp',
    });
    expect(walletType).toBe(SecretType.Mnemonic);
  });
  it('should return the `keystone` secret type', () => {
    const walletType = getSecretsType({
      xpub: 'xpub',
      masterFingerprint: 'fingerprint',
    });
    expect(walletType).toBe(SecretType.Keystone);
  });
});
