import { TokenWithBalanceBTC } from '@avalabs/vm-module-types';
import { PubKeyType } from '@core/types';

import { SecretType } from '../../secrets/models';

export interface DisplayData_BitcoinSendTx {
  from: string;
  address: string;
  amount: number; // satoshis
  sendFee: number; // satoshis
  feeRate: number;
  balance: TokenWithBalanceBTC;
  displayOptions?: TxDisplayOptions;
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
  dryRun?: boolean;
  numberOfAccountsToCreate?: number;
};

export type ImportWalletResult = {
  type: SecretType;
  name?: string;
  id: string;
};


export type TxDisplayOptions = {
  customApprovalScreenTitle?: string;
  contextInformation?: {
    title: string;
    notice?: string;
  };
};
