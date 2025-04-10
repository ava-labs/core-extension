import Joi from 'joi';

import * as Legacy from './legacyModels';
import {
  btcWalletPolicyDetailsSchema,
  fireblocksSchema,
  privateKeySchema,
  pubKeyTypeSchema,
  walletConnectSchema,
} from './commonSchemas';

const seedlessSchema = Joi.object<Legacy.SeedlessSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('seedless').required(),
  derivationPath: Joi.string().valid('bip44').required(),
  pubKeys: Joi.array().items(pubKeyTypeSchema).required(),
  authProvider: Joi.string().valid('google', 'apple').required(),
  seedlessSignerToken: Joi.object().optional(),
  userEmail: Joi.string().optional(),
  userId: Joi.string().optional(),
}).unknown();

const mnemonicSchema = Joi.object<Legacy.MnemonicSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('mnemonic').required(),
  derivationPath: Joi.string().valid('bip44').required(),
  mnemonic: Joi.string().required(),
  xpub: Joi.string().required(),
  xpubXP: Joi.string().required(),
}).unknown();

const ledgerSchema = Joi.object<Legacy.LedgerSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('ledger').required(),
  derivationPath: Joi.string().valid('bip44').required(),
  xpub: Joi.string().required(),
  xpubXP: Joi.string().optional(),
  btcWalletPolicyDetails: btcWalletPolicyDetailsSchema.optional(),
}).unknown();

const ledgerLiveSchema = Joi.object<Legacy.LedgerLiveSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('ledger-live').required(),
  derivationPath: Joi.string().valid('ledger_live').required(),
  pubKeys: Joi.array().items(pubKeyTypeSchema).required(),
}).unknown();

const keystoneSchema = Joi.object<Legacy.KeystoneSecrets, true>({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  secretType: Joi.string().valid('keystone').required(),
  derivationPath: Joi.string().valid('bip44').required(),
  xpub: Joi.string().required(),
  masterFingerprint: Joi.string().required(),
}).unknown();

export const legacySecretsSchema = Joi.object<Legacy.LegacySchema, true>({
  wallets: Joi.array()
    .items(
      keystoneSchema,
      ledgerLiveSchema,
      ledgerSchema,
      mnemonicSchema,
      seedlessSchema,
    )
    .required(),
  importedAccounts: Joi.object()
    .pattern(
      Joi.string(),
      Joi.alternatives(privateKeySchema, walletConnectSchema, fireblocksSchema),
    )
    .optional(),
  version: Joi.number().valid(4).required(),
}).unknown();
