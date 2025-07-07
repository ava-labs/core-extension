import Joi from 'joi';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { WALLET_ID } from '../../models';
import { getSecretsType } from './utils/getSecretsType';
import { SecretType } from '@core/types';

const VERSION = 4;

enum ImportType {
  PRIVATE_KEY = 'privateKey',
  WALLET_CONNECT = 'walletConnect',
  FIREBLOCKS = 'fireblocks',
}

type PreviousSchema = {
  mnemonic?: string;
  xpub?: string;
  xpubXP?: string;
  pubKeys?: { evm: string }[];
  derivationPath: DerivationPath;
  seedlessSignerToken?: unknown; // marking it unkonwn since it's an external type. Does not worth importing here since.
  masterFingerprint?: string;
  imported?: Record<string, { type: ImportType; secret: string }>;
  version?: number;
};

const previousSchema = Joi.object({
  mnemonic: Joi.string().allow(''),
  xpub: Joi.string(),
  xpubXP: Joi.string().allow(''),
  pubKeys: Joi.array().items(
    Joi.object({
      evm: Joi.string().required(),
    }).unknown(),
  ),
  masterFingerprint: Joi.string().allow('').optional(),
  derivationPath: Joi.string()
    .valid(DerivationPath.BIP44, DerivationPath.LedgerLive)
    .required(),
  seedlessSignerToken: Joi.object().optional(),
  imported: Joi.object().unknown(),
}).unknown();

let walletId = '';

const up = async (walletStorage: PreviousSchema) => {
  const { imported, version, ...rest } = walletStorage;
  walletId = WALLET_ID;
  const secretType = getSecretsType(walletStorage);
  const nameType =
    secretType === SecretType.Mnemonic
      ? 'Recovery Phrase'
      : secretType === SecretType.Seedless
        ? 'Seedless'
        : secretType === SecretType.Keystone ||
            secretType === SecretType.Keystone3Pro
          ? 'Keystone'
          : 'Ledger';

  const newImported = {};
  if (imported) {
    for (const [key, value] of Object.entries(imported)) {
      const { type, ...restData } = value;
      let newSecretType: SecretType | undefined;
      switch (type) {
        case ImportType.PRIVATE_KEY:
          newSecretType = SecretType.PrivateKey;
          break;
        case ImportType.FIREBLOCKS:
          newSecretType = SecretType.Fireblocks;
          break;
        case ImportType.WALLET_CONNECT:
          newSecretType = SecretType.WalletConnect;
          break;
      }
      newImported[key] = {
        secretType: newSecretType,
        ...restData,
      };
    }
  }

  const newWallet = {
    wallets: [
      {
        id: walletId,
        ...rest,
        secretType,
        name: `${nameType} 01`,
      },
    ],
    importedAccounts: newImported,
  };

  return {
    ...newWallet,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
