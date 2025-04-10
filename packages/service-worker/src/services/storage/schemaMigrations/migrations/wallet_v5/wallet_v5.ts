import { ACCOUNTS_STORAGE_KEY, Accounts } from '../../../../accounts/models';

import { MigrationWithDeps } from '../../models';

import { legacySecretsSchema } from './legacySchema';
import * as Legacy from './legacyModels';
import * as New from './newModels';
import {
  AddressPublicKeyJson,
  ExtendedPublicKey,
} from '../../../../secrets/models';
import { assertPresent } from '@src/utils/assertions';
import { CommonError } from '@src/utils/errors';
import { AddressPublicKey } from '../../../../secrets/AddressPublicKey';
import { rpcErrors } from '@metamask/rpc-errors';

const VERSION = 5;
const EVM_BASE_PATH = "m/44'/60'/0'";
const AVALANCHE_BASE_PATH = "m/44'/9000'/0'";

type DependencyModelTuples = [[typeof ACCOUNTS_STORAGE_KEY, Accounts]];

type WalletV5Migration = MigrationWithDeps<
  Legacy.LegacySchema,
  New.NewSchema,
  DependencyModelTuples
>;

const migrateMnemonicSecrets = async (
  secrets: Legacy.MnemonicSecrets,
  numberOfAccounts: number,
): Promise<New.MnemonicSecrets> => {
  const walletId = secrets.id;
  const addressPublicKeys: AddressPublicKeyJson[] = [];

  const extendedPublicKeys: ExtendedPublicKey[] = [
    {
      // xpub -> ExtendedPublicKey
      curve: 'secp256k1',
      derivationPath: EVM_BASE_PATH,
      key: secrets.xpub,
      type: 'extended-pubkey',
    },
    {
      // xpubXP -> ExtendedPublicKey
      curve: 'secp256k1',
      derivationPath: AVALANCHE_BASE_PATH,
      key: secrets.xpubXP,
      type: 'extended-pubkey',
    },
  ];

  for (let i = 0; i < numberOfAccounts; i++) {
    const evmPublicKey = await AddressPublicKey.fromSeedphrase(
      secrets.mnemonic,
      'secp256k1',
      `${EVM_BASE_PATH}/0/${i}`,
    );
    const avaSecp256k1PublicKey = await AddressPublicKey.fromSeedphrase(
      secrets.mnemonic,
      'secp256k1',
      `${AVALANCHE_BASE_PATH}/0/${i}`,
    );
    const avaEd25519PublicKey = await AddressPublicKey.fromSeedphrase(
      secrets.mnemonic,
      'ed25519',
      `${AVALANCHE_BASE_PATH}/0'/${i}'`, // Ed25519 requires hardened path
    );

    addressPublicKeys.push(
      evmPublicKey.toJSON(),
      avaSecp256k1PublicKey.toJSON(),
      avaEd25519PublicKey.toJSON(),
    );
  }

  return {
    id: walletId,
    name: secrets.name,
    derivationPathSpec: 'bip44',
    extendedPublicKeys,
    mnemonic: secrets.mnemonic,
    publicKeys: addressPublicKeys,
    secretType: 'mnemonic',
  };
};

const migrateLedgerSecrets = (
  secrets: Legacy.LedgerSecrets,
  numberOfAccounts: number,
): New.LedgerSecrets => {
  const walletId = secrets.id;
  const addressPublicKeys: AddressPublicKeyJson[] = [];

  const extendedPublicKeys: ExtendedPublicKey[] = [
    {
      // xpub -> ExtendedPublicKey
      curve: 'secp256k1',
      derivationPath: EVM_BASE_PATH,
      key: secrets.xpub,
      type: 'extended-pubkey',
      btcWalletPolicyDetails: secrets.btcWalletPolicyDetails,
    },
  ];

  if (secrets.xpubXP) {
    extendedPublicKeys.push({
      // xpubXP -> ExtendedPublicKey
      curve: 'secp256k1',
      derivationPath: AVALANCHE_BASE_PATH,
      key: secrets.xpubXP,
      type: 'extended-pubkey',
    });
  }

  for (let i = 0; i < numberOfAccounts; i++) {
    const evmPublicKey = AddressPublicKey.fromExtendedPublicKeys(
      extendedPublicKeys,
      'secp256k1',
      `${EVM_BASE_PATH}/0/${i}`,
    );
    addressPublicKeys.push(evmPublicKey.toJSON());
  }

  if (secrets.xpubXP) {
    for (let i = 0; i < numberOfAccounts; i++) {
      const avaPublicKey = AddressPublicKey.fromExtendedPublicKeys(
        extendedPublicKeys,
        'secp256k1',
        `${AVALANCHE_BASE_PATH}/0/${i}`,
      );

      addressPublicKeys.push(avaPublicKey.toJSON());
    }
  }

  return {
    id: walletId,
    name: secrets.name,
    derivationPathSpec: 'bip44',
    extendedPublicKeys,
    publicKeys: addressPublicKeys,
    secretType: 'ledger',
  };
};

const migrateLedgerLiveSecrets = (
  secrets: Legacy.LedgerLiveSecrets,
): New.LedgerLiveSecrets => {
  const walletId = secrets.id;
  const addressPublicKeys: AddressPublicKeyJson[] = [];

  for (const [index, legacyPubKey] of secrets.pubKeys.entries()) {
    if (legacyPubKey.evm) {
      addressPublicKeys.push({
        curve: 'secp256k1',
        derivationPath: `m/44'/60'/${index}'/0/0`,
        key: legacyPubKey.evm,
        type: 'address-pubkey',
        ...(legacyPubKey.btcWalletPolicyDetails
          ? { btcWalletPolicyDetails: legacyPubKey.btcWalletPolicyDetails }
          : {}),
      });
    }

    if (legacyPubKey.xp) {
      addressPublicKeys.push({
        curve: 'secp256k1',
        derivationPath: `m/44'/9000'/${index}'/0/0`,
        key: legacyPubKey.xp,
        type: 'address-pubkey',
      });
    }
  }

  return {
    id: walletId,
    name: secrets.name,
    derivationPathSpec: 'ledger_live',
    publicKeys: addressPublicKeys,
    secretType: 'ledger-live',
  };
};

const migrateKeystoneSecrets = (
  secrets: Legacy.KeystoneSecrets,
  numberOfAccounts: number,
): New.KeystoneSecrets => {
  const walletId = secrets.id;
  const addressPublicKeys: AddressPublicKeyJson[] = [];

  const extendedPublicKeys: ExtendedPublicKey[] = [
    {
      // xpub -> ExtendedPublicKey
      curve: 'secp256k1',
      derivationPath: EVM_BASE_PATH,
      key: secrets.xpub,
      type: 'extended-pubkey',
    },
  ];

  for (let i = 0; i < numberOfAccounts; i++) {
    const evmPublicKey = AddressPublicKey.fromExtendedPublicKeys(
      extendedPublicKeys,
      'secp256k1',
      `${EVM_BASE_PATH}/0/${i}`,
    );

    addressPublicKeys.push(evmPublicKey.toJSON());
  }

  return {
    id: walletId,
    name: secrets.name,
    derivationPathSpec: 'bip44',
    masterFingerprint: secrets.masterFingerprint,
    extendedPublicKeys,
    publicKeys: addressPublicKeys,
    secretType: 'keystone',
  };
};

const migrateSeedlessSecrets = (
  secrets: Legacy.SeedlessSecrets,
): New.SeedlessSecrets => {
  const walletId = secrets.id;
  const addressPublicKeys: AddressPublicKeyJson[] = [];

  for (const [index, legacyPubKey] of secrets.pubKeys.entries()) {
    if (legacyPubKey.evm) {
      addressPublicKeys.push({
        curve: 'secp256k1',
        derivationPath: `m/44'/60'/0'/0/${index}`,
        key: legacyPubKey.evm,
        type: 'address-pubkey',
        btcWalletPolicyDetails: legacyPubKey.btcWalletPolicyDetails,
      });
    }

    if (legacyPubKey.xp) {
      addressPublicKeys.push({
        curve: 'secp256k1',
        derivationPath: `m/44'/9000'/0'/0/${index}`,
        key: legacyPubKey.xp,
        type: 'address-pubkey',
      });
    }
  }

  return {
    id: walletId,
    name: secrets.name,
    derivationPathSpec: 'bip44',
    publicKeys: addressPublicKeys,
    secretType: 'seedless',
    authProvider: secrets.authProvider,
    seedlessSignerToken: secrets.seedlessSignerToken,
    userEmail: secrets.userEmail,
    userId: secrets.userId,
  };
};

const up: WalletV5Migration['up'] = async (currentSecrets, accounts) => {
  const primaryWallets: New.NewSchema['wallets'] = [];

  const validationResult = legacySecretsSchema.validate(currentSecrets);

  if (validationResult.error) {
    throw rpcErrors.internal({
      data: {
        reason: CommonError.MigrationFailed,
        context: validationResult.error.message,
      },
    });
  }

  for (let i = 0; i < currentSecrets.wallets.length; i++) {
    const wallet = currentSecrets.wallets[i];
    assertPresent(wallet, CommonError.MigrationFailed);
    const { secretType } = wallet;

    /**
     * If this throws type errors due to Accounts model being updated,
     * you're likely introducing a migration for ACCOUNTS_STORAGE_KEY.
     *
     * There are a few things that need to be done:
     *
     * The new migration needs to have both up and down methods, so that once
     * Accounts is migrated to v4+, other places (like this migration here) can still request v3.
     * The StorageService needs a way to load a key with requested version
     * (i.e. StorageService.loadVersion(storageKey: string, version: number)).
     *
     * If the key is at specified version already, just return it. If it's already been
     * migrated to a higher version - use migration.down() to go back (don't store it, just return it).
     *
     * This migration (wallet_v5) needs to be re-written so that it uses the new StorageService.loadVersion() method.
     */
    const accountsForWallet = accounts.primary[wallet.id];
    assertPresent(accountsForWallet, CommonError.MigrationFailed);

    if (secretType === 'mnemonic') {
      const mnemonicWallet = await migrateMnemonicSecrets(
        wallet,
        accountsForWallet.length,
      );
      primaryWallets.push(mnemonicWallet);
    } else if (secretType === 'ledger') {
      const ledgerWallet = migrateLedgerSecrets(
        wallet,
        accountsForWallet.length,
      );
      primaryWallets.push(ledgerWallet);
    } else if (secretType === 'ledger-live') {
      const ledgerLiveWallet = migrateLedgerLiveSecrets(wallet);
      primaryWallets.push(ledgerLiveWallet);
    } else if (secretType === 'keystone') {
      const keystoneWallet = migrateKeystoneSecrets(
        wallet,
        accountsForWallet.length,
      );
      primaryWallets.push(keystoneWallet);
    } else if (secretType === 'seedless') {
      const seedlessWallet = migrateSeedlessSecrets(wallet);
      primaryWallets.push(seedlessWallet);
    }
  }

  return {
    importedAccounts: currentSecrets.importedAccounts,
    wallets: primaryWallets,
    version: VERSION,
  };
};

export default {
  previousSchema: legacySecretsSchema,
  dependencyKeys: [ACCOUNTS_STORAGE_KEY],
  up,
} satisfies MigrationWithDeps<
  Legacy.LegacySchema,
  New.NewSchema,
  DependencyModelTuples
>;
