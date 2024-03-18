import { DerivationPath } from '@avalabs/wallets-sdk';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';

import getDerivationPath from './getDerivationPath';

describe('src/background/services/wallet/utils/getDerivationPath.ts', () => {
  it('throws if none of the secrets were provided', () => {
    expect(() => getDerivationPath({})).toThrow(
      'Unable to get derivation type for wallet'
    );
  });

  it('returns BIP44 if mnemonic is defined', () => {
    const result = getDerivationPath({ mnemonic: 'mnemonic' });
    expect(result).toBe(DerivationPath.BIP44);
  });

  it('returns BIP44 if xpub is defined', () => {
    const result = getDerivationPath({ xpub: 'xpub' });
    expect(result).toBe(DerivationPath.BIP44);
  });

  it('returns BIP44 if seedlessSignerToken is defined', () => {
    const result = getDerivationPath({
      seedlessSignerToken: {} as SignerSessionData,
    });
    expect(result).toBe(DerivationPath.BIP44);
  });

  it('returns LedgerLive if there are pubKeys', () => {
    const result = getDerivationPath({ pubKeys: [{ evm: 'pubKey' }] });
    expect(result).toBe(DerivationPath.LedgerLive);
  });
});
