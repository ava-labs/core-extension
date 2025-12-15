import { hex } from '@scure/base';
import { mnemonicToSeed } from 'bip39';
import { fromBase58, fromSeed } from 'bip32';
import { ed25519 } from '@noble/curves/ed25519';
import slip10 from 'micro-key-producer/slip10.js';
import { BtcWalletPolicyDetails } from '@avalabs/vm-module-types';
import { getPublicKeyFromPrivateKey } from '@avalabs/core-wallets-sdk';
import { ethErrors } from 'eth-rpc-errors';

import {
  SecretsError,
  AddressPublicKeyJson,
  Curve,
  ExtendedPublicKey,
  ImportedAccountSecrets,
  PrimaryWalletSecrets,
  SecretType,
} from '@core/types';
import { assertPresent } from '@core/common';

import {
  assertDerivationPath,
  getExtendedPublicKeyFor,
  getPublicKeyFor,
} from './utils';

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
      curve: this.curve,
      derivationPath: this.derivationPath,
      type: this.type,
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
    // With mnemonic wallets, we can derive the public key from the seed phrase.
    if (secrets.secretType === SecretType.Mnemonic) {
      assertDerivationPath(derivationPath);
      return AddressPublicKey.fromSeedphrase(
        secrets.mnemonic,
        curve,
        derivationPath,
      );
    }

    // For Ledger (BIP44) and Keystone, look if we already have the public key stored.
    // If not, fall back to the extended public keys.
    if (
      secrets.secretType === SecretType.Ledger ||
      secrets.secretType === SecretType.Keystone ||
      secrets.secretType === SecretType.Keystone3Pro
    ) {
      assertDerivationPath(derivationPath);

      const pubKeyJson = getPublicKeyFor(secrets, derivationPath, curve);

      if (pubKeyJson) {
        return AddressPublicKey.fromJSON(pubKeyJson);
      }

      return AddressPublicKey.fromExtendedPublicKeys(
        secrets.extendedPublicKeys,
        curve,
        derivationPath,
      );
    }

    // For Ledger Live and Seedless, we should already have the public keys stored.
    // We just need to find them:
    if (
      secrets.secretType === SecretType.Seedless ||
      secrets.secretType === SecretType.LedgerLive
    ) {
      assertDerivationPath(derivationPath);

      const pubKeyJson = getPublicKeyFor(secrets, derivationPath, curve);
      assertPresent(pubKeyJson, SecretsError.PublicKeyNotFound);

      return AddressPublicKey.fromJSON(pubKeyJson);
    }

    if (secrets.secretType === SecretType.PrivateKey) {
      return AddressPublicKey.fromPrivateKey(secrets.secret, curve);
    }

    throw ethErrors.rpc.internal({
      data: {
        reason: SecretsError.UnsupportedSecretType,
        context: secrets.secretType,
      },
    });
  }

  static fromExtendedPublicKeys(
    xpubs: ExtendedPublicKey[],
    curve: Curve,
    derivationPath: string,
  ): AddressPublicKey<true> {
    assertDerivationPath(derivationPath);

    if (curve !== 'secp256k1') {
      throw ethErrors.rpc.internal({
        data: {
          reason: SecretsError.UnsupportedCurve,
          context: `"${curve}" is not supported with extended public keys`,
        },
      });
    }

    const matchingXpub = getExtendedPublicKeyFor(xpubs, derivationPath, curve);

    if (!matchingXpub) {
      throw ethErrors.rpc.internal({
        data: {
          reason: SecretsError.MissingExtendedPublicKey,
          context: `${derivationPath} / ${curve}`,
        },
      });
    }

    const pathSuffix = derivationPath.slice(
      matchingXpub.derivationPath.length + 1, // Add one to account for the trailing slash from the lookup
    );
    const node = fromBase58(matchingXpub.key).derivePath(pathSuffix);
    const key = hex.encode(Uint8Array.from(node.publicKey));

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
        key = hex.encode(
          Uint8Array.from(getPublicKeyFromPrivateKey(privateKey)),
        );
        break;

      default:
        throw ethErrors.rpc.internal({
          data: {
            reason: SecretsError.UnsupportedCurve,
            context: curve,
          },
        });
    }

    return new AddressPublicKey(key, curve, null);
  }

  static async fromSeedphrase(
    seedphrase: string,
    curve: Curve,
    derivationPath: string,
  ): Promise<AddressPublicKey> {
    assertDerivationPath(derivationPath);
    const seed = await mnemonicToSeed(seedphrase);
    let key: string;

    switch (curve) {
      case 'secp256k1': {
        const seedNode = fromSeed(seed);
        key = hex.encode(
          Uint8Array.from(seedNode.derivePath(derivationPath).publicKey),
        );
        break;
      }

      case 'ed25519': {
        const hdKey = slip10.fromMasterSeed(Uint8Array.from(seed));
        key = hex.encode(
          Uint8Array.from(hdKey.derive(derivationPath).publicKeyRaw),
        );
        break;
      }

      default:
        throw ethErrors.rpc.internal({
          data: {
            reason: SecretsError.UnsupportedCurve,
            context: curve,
          },
        });
    }

    return new AddressPublicKey(key, curve, derivationPath);
  }
}
