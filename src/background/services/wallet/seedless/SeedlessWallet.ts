import * as cs from '@cubist-dev/cubesigner-sdk';
import { strip0x } from '@avalabs/utils-sdk';

import { PubKeyType } from '../../wallet/models';

export class SeedlessWallet {
  #signerSession?: cs.SignerSession;

  constructor(
    private sessionStorage: cs.SessionStorage<cs.SignerSessionData>
  ) {}

  get #connected() {
    return Boolean(this.#signerSession);
  }

  async #connect() {
    if (this.#connected) {
      return;
    }

    this.#signerSession = await cs.CubeSigner.loadSignerSession(
      this.sessionStorage
    );
  }

  async #getSession(): Promise<cs.SignerSession> {
    await this.#connect();

    if (!this.#signerSession) {
      throw new Error('SeedlessWallet not connected');
    }

    return this.#signerSession;
  }

  async getPublicKeys(): Promise<PubKeyType[] | undefined> {
    const session = await this.#getSession();
    // get keys and filter out non derived ones and group them
    const rawKeys = await session.keys();
    const keys = rawKeys
      ?.filter(
        (k) =>
          k.enabled &&
          ['SecpEthAddr', 'SecpAvaAddr'].includes(k.key_type) &&
          k.derivation_info?.derivation_path
      )
      .reduce((acc, key) => {
        if (!key.derivation_info) {
          return acc;
        }

        const index = Number(
          key.derivation_info.derivation_path.split('/').pop()
        );
        if (index === undefined) {
          return acc;
        }

        acc[key.derivation_info.mnemonic_id] = [
          ...(acc[key.derivation_info.mnemonic_id] ?? []),
        ];
        const mnemonicBlock = acc[key.derivation_info.mnemonic_id] || [];

        mnemonicBlock[index] = {
          ...acc[key.derivation_info.mnemonic_id]?.[index],
          [key.key_type]: key,
        };

        return acc;
      }, {} as Record<string, Record<string, cs.KeyInfo>[]>);

    if (!keys || Object.keys(keys).length === 0) {
      throw new Error('Accounts not created');
    }

    const derivedKeys = Object.values(keys)[0];

    if (!derivedKeys) {
      throw new Error('Accounts keys missing');
    }

    const pubkeys = [] as PubKeyType[];

    for (let i = 0; i < derivedKeys.length; i++) {
      const key = derivedKeys[i];
      if (!key || !key['SecpAvaAddr'] || !key['SecpEthAddr']) {
        continue;
      }
      pubkeys.push({
        evm: strip0x(key['SecpEthAddr'].public_key),
        xp: strip0x(key['SecpAvaAddr'].public_key),
      });
    }

    if (!pubkeys?.length) {
      throw new Error('Address not found');
    }

    return pubkeys;
  }
}
