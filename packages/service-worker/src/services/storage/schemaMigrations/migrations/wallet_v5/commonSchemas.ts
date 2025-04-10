import Joi from 'joi';

import {
  BtcWalletPolicyDetails,
  ImportedFireblocksSecrets,
  ImportedPrivateKeySecrets,
  ImportedWalletConnectSecrets,
  PubKeyType,
} from './commonModels';

export const btcWalletPolicyDetailsSchema = Joi.object<
  BtcWalletPolicyDetails,
  true
>({
  hmacHex: Joi.string().required(),
  masterFingerprint: Joi.string().required(),
  name: Joi.string().required(),
  xpub: Joi.string().required(),
});

export const pubKeyTypeSchema = Joi.object<PubKeyType, true>({
  evm: Joi.string().required(),
  xp: Joi.string().optional(),
  ed25519: Joi.string().optional(),
  btcWalletPolicyDetails: btcWalletPolicyDetailsSchema.optional(),
}).unknown();

export const walletConnectSchema = Joi.object<
  ImportedWalletConnectSecrets,
  true
>({
  secretType: Joi.string().valid('wallet-connect').required(),
  pubKey: pubKeyTypeSchema.optional(),
  addresses: Joi.object({
    addressC: Joi.string().required(),
    addressAVM: Joi.string().optional(),
    addressBTC: Joi.string().optional(),
    addressCoreEth: Joi.string().optional(),
    addressPVM: Joi.string().optional(),
  }).required(),
}).unknown();

export const fireblocksSchema = Joi.object<ImportedFireblocksSecrets>({
  secretType: Joi.string().valid('fireblocks').required(),
  addresses: Joi.object({
    addressC: Joi.string().required(),
    addressBTC: Joi.string().optional(),
  }).required(),
  api: Joi.object({
    vaultAccountId: Joi.string().required(),
    key: Joi.string().required(),
    secret: Joi.string().required(),
  }).optional(),
}).unknown();

export const privateKeySchema = Joi.object<ImportedPrivateKeySecrets, true>({
  secretType: Joi.string().valid('private-key').required(),
  secret: Joi.string().required(),
}).unknown();
