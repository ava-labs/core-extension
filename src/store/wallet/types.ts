// import { KeyPair as AVMKeyPair } from 'avalanche/dist/apis/avm';

import {
  MnemonicWallet,
  SingletonWallet,
  LedgerWallet,
  BN,
} from "@avalabs/avalanche-wallet-sdk";

export {
  iAvaxBalance,
  WalletBalanceERC20,
  WalletBalanceX,
} from '@avalabs/avalanche-wallet-sdk/dist/Wallet/types';

// import MnemonicWallet from '@/Wallet/MnemonicWallet';
// import SingletonWallet from '@/Wallet/SingletonWallet';
// import LedgerWallet from '@/Wallet/LedgerWallet';

export interface iAssetDescriptionClean {
  name: string;
  symbol: string;
  assetID: string;
  denomination: number;
}

// export interface IIndexKeyCache {
//   [index: number]: AVMKeyPair;
// }

export type ChainAlias = "X" | "P";
export type AvmImportChainType = "P" | "C";
export type AvmExportChainType = "P" | "C";
export type HdChainType = "X" | "P";

export type WalletNameType = "mnemonic" | "ledger" | "singleton";
export type WalletType = MnemonicWallet | SingletonWallet | LedgerWallet;
