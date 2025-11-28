import Joi from 'joi';
import { ImportType } from '@core/types';
import { Avalanche } from '@avalabs/core-wallets-sdk';

const VERSION = 2;

type PreviousSchema = {
  mnemonic?: string;
  // Extended public key of m/44'/60'/0'
  xpub?: string;
  /**
   * 	Extended public key of m/44'/9000'/0'
   * 	Used X/P chain derivation on mnemonic and Ledger (BIP44) wallets.
   */
  pubKeys?: { evm: string }[];
  imported?: Record<string, { type: ImportType; secret: string }>;
};

const previousSchema = Joi.object();

const up = async (walletStorage: PreviousSchema) => {
  // Generate xpub for XP if mnemonic exists
  const xpubXP = walletStorage.mnemonic
    ? Avalanche.getXpubFromMnemonic(walletStorage.mnemonic, 0)
    : undefined;

  return {
    ...walletStorage,
    xpubXP,
    version: VERSION,
  };
};

export default {
  previousSchema,
  up,
};
