import {
  LedgerWallet,
  MnemonicWallet,
  WalletType,
} from '@avalabs/avalanche-wallet-sdk';
import { WalletState } from '@avalabs/wallet-react-components';

export function isMnemonicWallet(wallet: WalletType): wallet is MnemonicWallet {
  return wallet.type === 'mnemonic';
}

export function isLedgerWallet(wallet: WalletType): wallet is LedgerWallet {
  return wallet.type === 'ledger';
}

export interface WalletLockedState {
  locked: boolean;
}

export function isWalletLocked(
  state?: WalletLockedState | WalletState
): state is WalletLockedState {
  // eslint-disable-next-line no-prototype-builtins
  return !!state?.hasOwnProperty('locked');
}
