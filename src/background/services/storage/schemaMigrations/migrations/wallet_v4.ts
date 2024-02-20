import Joi from 'joi';
import { DerivationPath } from '@avalabs/wallets-sdk';
import { WALLET_ID } from '../models';
import { getSecretsType } from '@src/background/services/wallet/utils/getSecretsType';
import { SecretType } from '@src/background/services/secrets/models';

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
  imported?: Record<string, { type: ImportType; secret: string }>;
  derivationPath: DerivationPath;
};

const previousSchema = Joi.object({
  mnemonic: Joi.string(),
  xpub: Joi.string(),
  xpubXP: Joi.string(),
  pubKeys: Joi.array().items(
    Joi.object({
      evm: Joi.string().required(),
    }).unknown()
  ),
  derivationPath: Joi.string()
    .valid(DerivationPath.BIP44, DerivationPath.LedgerLive)
    .required(),
  imported: Joi.object().unknown(),
}).unknown();

let walletId = '';

const up = async (walletStorage: PreviousSchema) => {
  const { imported, ...rest } = walletStorage;
  walletId = WALLET_ID;
  const secretType = getSecretsType(walletStorage);

  const newImported = {};
  if (imported) {
    for (const [key, value] of Object.entries(imported)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        name: `${secretType} 1`,
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
