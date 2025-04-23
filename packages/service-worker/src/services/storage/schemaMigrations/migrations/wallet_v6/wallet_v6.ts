import Joi from 'joi';
import { rpcErrors } from '@metamask/rpc-errors';

import { CommonError } from '@core/utils';
import { AddressPublicKey } from '../../../../secrets/AddressPublicKey';

import { Schema } from './wallet_v6_schema';

const EVM_BASE_DERIVATION_PATH = "m/44'/60'/0'";
const SVM_BASE_DERIVATION_PATH = "m/44'/501'";

const secretsSchema = Joi.object<Schema, true>({
  wallets: Joi.array()
    .items(
      Joi.object({
        secretType: Joi.string().valid('mnemonic').required(),
        mnemonic: Joi.string().required(),
        publicKeys: Joi.array()
          .items(
            Joi.object({
              type: Joi.string().valid('address-pubkey').required(),
              curve: Joi.string().allow('secp256k1', 'ed25519').required(),
              derivationPath: Joi.string().required(),
              key: Joi.string().required(),
              btcWalletPolicyDetails: Joi.any(),
            }).unknown(),
          )
          .required(),
      }).unknown(),
      Joi.any(),
    )
    .required(),
  importedAccounts: Joi.object().optional(),
  version: Joi.number().valid(5).required(),
}).unknown();

// This migration doesn't change anything in the models,
// it only adds missing Solana public keys for mnemonic wallets.
const up = async (secrets: Schema) => {
  const validationResult = secretsSchema.validate(secrets);

  if (validationResult.error) {
    throw rpcErrors.internal({
      data: {
        reason: CommonError.MigrationFailed,
        context: validationResult.error.message,
      },
    });
  }

  const newWallets: Schema['wallets'] = [];

  for (const wallet of secrets.wallets) {
    if (wallet.secretType !== 'mnemonic') {
      // Do not change non-mnemonic wallets
      newWallets.push(wallet);
      continue;
    }

    const indicesOfEvmKeys = wallet.publicKeys
      .filter(
        (key) =>
          key.curve === 'secp256k1' &&
          key.derivationPath.startsWith(EVM_BASE_DERIVATION_PATH),
      )
      .map((key) => {
        // For BIP44, account index is the last segment of derivation path
        return parseInt(key.derivationPath.split('/').at(-1) as string);
      });

    const indicesOfSvmKeys = wallet.publicKeys
      .filter(
        (key) =>
          key.curve === 'secp256k1' &&
          key.derivationPath.startsWith(SVM_BASE_DERIVATION_PATH),
      )
      .map((key) => {
        // For Solana accounts, the account index is always the 2nd to last segment of derivation path.
        return parseInt(key.derivationPath.split('/').at(-2) as string);
      });

    const missingSvmKeyIndices = indicesOfEvmKeys.filter(
      (index) => !indicesOfSvmKeys.includes(index),
    );

    if (!missingSvmKeyIndices.length) {
      return wallet;
    }

    const newWallet = {
      ...wallet,
      publicKeys: wallet.publicKeys.slice(),
    };

    for (const index of missingSvmKeyIndices) {
      const key = await AddressPublicKey.fromSeedphrase(
        wallet.mnemonic,
        'ed25519',
        `m/44'/501'/${index}'/0'`,
      );

      newWallet.publicKeys.push(key.toJSON());
    }

    newWallets.push(newWallet);
  }

  return {
    ...secrets,
    wallets: newWallets,
    version: 6,
  };
};

export default {
  previousSchema: secretsSchema,
  up,
};
