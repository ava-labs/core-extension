import {
  LedgerWallet,
  MnemonicWallet,
  WalletType,
} from '@avalabs/avalanche-wallet-sdk';
import { ERC20 } from '../erc20Tokens/models';
import { WalletBalances } from './balances';

export function isMnemonicWallet(wallet: WalletType): wallet is MnemonicWallet {
  return wallet.type === 'mnemonic';
}

export function isLedgerWallet(wallet: WalletType): wallet is LedgerWallet {
  return wallet.type === 'ledger';
}

export interface WalletState {
  balances: WalletBalances;
  addresses: {
    addrX: string;
    addrP: string;
    addrC: string;
  };
  erc20Tokens: ERC20[];
  avaxPrice: number;
}

export interface WalletLockedState {
  locked: boolean;
}

export function isWalletLocked(
  state: WalletLockedState | WalletState
): state is WalletLockedState {
  return state?.hasOwnProperty('locked');
}
