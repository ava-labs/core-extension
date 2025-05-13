import Joi from 'joi';

import { btcWalletPolicyDetailsSchema } from './commonSchemas';
import * as New from './newModels';

const addressPublicKeySchema = Joi.object<New.AddressPublicKey>({
  type: Joi.string().valid('address-pubkey').required(),
  curve: Joi.string().valid('secp256k1', 'ed25519').required(),
  derivationPath: Joi.string().required(),
  key: Joi.string().required(),
  btcWalletPolicyDetails: btcWalletPolicyDetailsSchema.optional(),
});

const extendedPublicKeySchema = Joi.object<New.ExtendedPublicKey, true>({
  type: Joi.string().valid('extended-pubkey').required(),
  curve: Joi.string().valid('secp256k1').required(),
  derivationPath: Joi.string().required(),
  key: Joi.string().required(),
  btcWalletPolicyDetails: btcWalletPolicyDetailsSchema.optional(),
});

const seedlessSchema = Joi.object<New.SeedlessSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('seedless').required(),
  derivationPathSpec: Joi.string().valid('bip44').required(),
  publicKeys: Joi.array().items(addressPublicKeySchema).required(),
  authProvider: Joi.string().valid('google', 'apple').required(),
  seedlessSignerToken: Joi.object().optional(),
  userEmail: Joi.string().optional(),
  userId: Joi.string().optional(),
}).unknown();

const mnemonicSchema = Joi.object<New.MnemonicSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('mnemonic').required(),
  derivationPathSpec: Joi.string().valid('bip44').required(),
  mnemonic: Joi.string().required(),
  publicKeys: Joi.array().items(addressPublicKeySchema).required(),
  extendedPublicKeys: Joi.array().items(extendedPublicKeySchema).required(),
}).unknown();

const ledgerSchema = Joi.object<New.LedgerSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('ledger').required(),
  derivationPathSpec: Joi.string().valid('bip44').required(),
  publicKeys: Joi.array().items(addressPublicKeySchema).required(),
  extendedPublicKeys: Joi.array().items(extendedPublicKeySchema).required(),
}).unknown();

const ledgerLiveSchema = Joi.object<New.LedgerLiveSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('ledger-live').required(),
  derivationPathSpec: Joi.string().valid('ledger_live').required(),
  publicKeys: Joi.array().items(addressPublicKeySchema).required(),
}).unknown();

const keystoneSchema = Joi.object<New.KeystoneSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('keystone').required(),
  derivationPathSpec: Joi.string().valid('bip44').required(),
  masterFingerprint: Joi.string().required(),
  publicKeys: Joi.array().items(addressPublicKeySchema).required(),
  extendedPublicKeys: Joi.array().items(extendedPublicKeySchema).required(),
}).unknown();

export const newSecretsSchema = Joi.object({
  wallets: Joi.array()
    .items(
      keystoneSchema,
      ledgerLiveSchema,
      ledgerSchema,
      mnemonicSchema,
      seedlessSchema,
    )
    .required(),
  // We don't really care about the contents of `importedAccounts`,
  // as we don't modify it in any way.
  importedAccounts: Joi.object().unknown().optional(),
  version: Joi.number().valid(5).required(),
}).unknown();
