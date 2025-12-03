import Joi from 'joi';
import { rpcErrors } from '@metamask/rpc-errors';

import { CommonError } from '@core/types';

import {
  NewLedgerLiveSecrets,
  LegacySchema,
  NewSchema,
} from './wallet_v7_schema';

const secretsSchema = Joi.object<LegacySchema, true>({
  wallets: Joi.array()
    .items(
      Joi.object({
        secretType: Joi.string().valid('ledger-live').required(),
        derivationPathSpec: Joi.string().valid('ledger_live').required(),
      }).unknown(),
      Joi.any(),
    )
    .required(),
  importedAccounts: Joi.object().optional(),
  version: Joi.number().valid(6).required(),
}).unknown();

// This migration doesn't change anything in the models,
// it only adds missing Solana public keys for mnemonic wallets.
const up = async (secrets: LegacySchema): Promise<NewSchema> => {
  const validationResult = secretsSchema.validate(secrets);

  if (validationResult.error) {
    throw rpcErrors.internal({
      data: {
        reason: CommonError.MigrationFailed,
        context: validationResult.error.message,
      },
    });
  }

  const newWallets: NewSchema['wallets'] = [];

  for (const wallet of secrets.wallets) {
    if (wallet.secretType !== 'ledger-live') {
      // Do not change non-LedgerLive wallets
      newWallets.push(wallet);
      continue;
    }

    const newWallet: NewLedgerLiveSecrets = {
      ...wallet,
      extendedPublicKeys: [],
    };

    newWallets.push(newWallet);
  }

  return {
    ...secrets,
    wallets: newWallets,
    version: 7,
  };
};

export default {
  previousSchema: secretsSchema,
  up,
};
