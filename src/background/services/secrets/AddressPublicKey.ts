import { hex } from '@scure/base';
import { mnemonicToSeed } from 'bip39';
import { fromBase58, fromSeed } from 'bip32';
import { ed25519 } from '@noble/curves/ed25519';
import slip10 from 'micro-key-producer/slip10.js';
import { BtcWalletPolicyDetails } from '@avalabs/vm-module-types';
import { getPublicKeyFromPrivateKey } from '@avalabs/core-wallets-sdk';

import { SecretsError } from '@src/utils/errors';
import { assertPresent } from '@src/utils/assertions';

import {
  AddressPublicKeyJson,
  Curve,
  ExtendedPublicKey,
  ImportedAccountSecrets,
  PrimaryWalletSecrets,
  SecretType,
} from './models';
import { assertDerivationPath, getExtendedPublicKeyFor } from './utils';

export class AddressPublicKey<HasDerivationPath extends boolean = true> {
  private readonly type = 'address-pubkey';

  constructor(
    public key: string,
    public curve: Curve,
    public derivationPath: HasDerivationPath extends true ? string : null,
    public btcWalletPolicyDetails?: BtcWalletPolicyDetails,
  ) {}

  toJSON(): AddressPublicKeyJson<HasDerivationPath> {
    return {
      type: this.type,
      curve: this.curve,
      derivationPath: this.derivationPath,
      key: this.key,
      ...(this.btcWalletPolicyDetails && {
        btcWalletPolicyDetails: this.btcWalletPolicyDetails,
      }),
    };
  }

  static fromJSON(json: Omit<AddressPublicKeyJson, 'type'>): AddressPublicKey {
    return new AddressPublicKey(
      json.key,
      json.curve,
      json.derivationPath,
      json.btcWalletPolicyDetails,
    );
  }

  static async fromSecrets(
    secrets: PrimaryWalletSecrets | ImportedAccountSecrets,
    curve: Curve,
    derivationPath?: string,
  ): Promise<AddressPublicKey<boolean>> {
    if (secrets.secretType === SecretType.Mnemonic) {
      assertDerivationPath(derivationPath);
      return AddressPublicKey.fromSeedphrase(
        secrets.mnemonic,
        curve,
        derivationPath,
      );
    }

    if (secrets.secretType === SecretType.Ledger) {
      assertDerivationPath(derivationPath);
      return AddressPublicKey.fromExtendedPublicKeys(
        secrets.extendedPublicKeys,
        curve,
        derivationPath,
      );
    }

    if (secrets.secretType === SecretType.Seedless) {
      assertDerivationPath(derivationPath);

      const pubKeyJson = secrets.publicKeys.find(
        (publicKey) =>
          publicKey.curve === curve &&
          publicKey.derivationPath === derivationPath,
      );

      assertPresent(pubKeyJson, SecretsError.PublicKeyNotFound);

      return AddressPublicKey.fromJSON(pubKeyJson);
    }

    if (secrets.secretType === SecretType.PrivateKey) {
      return AddressPublicKey.fromPrivateKey(secrets.secret, curve);
    }

    throw new Error('Not implemented yet');
  }

  static fromExtendedPublicKeys(
    xpubs: ExtendedPublicKey[],
    curve: Curve,
    derivationPath: string,
  ): AddressPublicKey<true> {
    const matchingXpub = getExtendedPublicKeyFor(xpubs, derivationPath, curve);

    if (!matchingXpub) {
      throw new Error(
        'No matching extended public key found for derivation path: ' +
          derivationPath,
      );
    }
    const pathSuffix = derivationPath.slice(
      matchingXpub.derivationPath.length + 1, // Add one to account for the trailing slash from the lookup
    );
    const node = fromBase58(matchingXpub.key).derivePath(pathSuffix);
    const key = hex.encode(node.publicKey);

    return new AddressPublicKey(
      key,
      curve,
      derivationPath,
      matchingXpub.btcWalletPolicyDetails,
    );
  }

  static fromPrivateKey(
    privateKey: string,
    curve: Curve,
  ): AddressPublicKey<false> {
    let key: string;

    switch (curve) {
      case 'ed25519':
        key = hex.encode(ed25519.getPublicKey(privateKey));
        break;

      case 'secp256k1':
        key = hex.encode(getPublicKeyFromPrivateKey(privateKey));
        break;
    }

    return new AddressPublicKey(key, curve, null);
  }

  static async fromSeedphrase(
    seedphrase: string,
    curve: Curve,
    derivationPath: string,
  ): Promise<AddressPublicKey> {
    const seed = await mnemonicToSeed(seedphrase);
    let key: string;

    switch (curve) {
      case 'secp256k1': {
        const seedNode = fromSeed(seed);
        key = hex.encode(seedNode.derivePath(derivationPath).publicKey);
        break;
      }

      case 'ed25519': {
        const hdKey = slip10.fromMasterSeed(seed);
        key = hex.encode(hdKey.derive(derivationPath).publicKey);
        break;
      }

      default:
        throw new Error('Unsupported curve');
    }

    return new AddressPublicKey(key, curve, derivationPath);
  }
}
