import Joi from 'joi';

import { BtcWalletPolicyDetails, PubKeyType } from './commonModels';

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
