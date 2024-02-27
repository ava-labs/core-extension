import { TokenWithBalance } from '@src/background/services/balances/models';
import { ValidSendState } from '@src/background/services/send/models';
import { SecretType } from '../../secrets/models';
import { PubKeyType } from '../models';

export interface DisplayData_BitcoinSendTx {
  sendState: ValidSendState;
  balance?: TokenWithBalance;
}

export type ImportSeedphraseWalletParams = {
  mnemonic: string;
  name?: string;
};

export type ImportLedgerWalletParams = {
  xpub: string;
  xpubXP: string;
  pubKeys?: PubKeyType[];
  secretType: SecretType.Ledger | SecretType.LedgerLive;
  name?: string;
};

export type ImportWalletResult = {
  type: SecretType;
  name?: string;
  id: string;
};

export enum SeedphraseImportError {
  ExistingSeedphrase = 'existing-seedphrase',
}
