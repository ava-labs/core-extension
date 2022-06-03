import {
  LedgerWallet,
  MnemonicWallet,
  WalletType,
} from '@avalabs/avalanche-wallet-sdk';
import { WalletState } from '@avalabs/wallet-react-components';
import { BitcoinInputUTXO, BitcoinOutputUTXO } from '@avalabs/wallets-sdk';
import { TransactionRequest } from '@ethersproject/providers';

export type SignTransactionRequest =
  | TransactionRequest
  | {
      inputs: BitcoinInputUTXO[];
      outputs: BitcoinOutputUTXO[];
    };

export function isMnemonicWallet(wallet: WalletType): wallet is MnemonicWallet {
  return wallet.type === 'mnemonic';
}

export function isLedgerWallet(wallet: WalletType): wallet is LedgerWallet {
  return wallet.type === 'ledger';
}

export interface WalletLockedState {
  locked: boolean;
}

export interface WalletSecretInStorage {
  mnemonic?: string;
  // Extended public key of m/44'/60'/0'
  xpub: string;
}

export function isWalletLocked(
  state?: WalletLockedState | WalletState
): state is WalletLockedState {
  // eslint-disable-next-line no-prototype-builtins
  return !!state?.hasOwnProperty('locked');
}

export enum WalletEvents {
  WALLET_STATE_UPDATE = 'wallet-state-updated',
}

export const WALLET_STORAGE_KEY = 'wallet';
