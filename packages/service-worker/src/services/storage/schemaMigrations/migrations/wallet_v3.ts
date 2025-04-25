import Joi from 'joi';
import { ImportType } from '@core/types';
import getDerivationPath from '@/services/wallet/utils/getDerivationPath';

const VERSION = 3;

type PreviousSchema = {
  mnemonic?: string;
  xpub?: string;
  xpubXP?: string;
  pubKeys?: { evm: string }[];
  imported?: Record<string, { type: ImportType; secret: string }>;
};

const previousSchema = Joi.object();

const up = async (walletStorage: PreviousSchema) => {
  const derivationPath = getDerivationPath(walletStorage);

  return {
    ...walletStorage,
    derivationPath,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
