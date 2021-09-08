import {
  LedgerWallet,
  MnemonicWallet,
  WalletType,
} from '@avalabs/avalanche-wallet-sdk';
import { ERC20 } from '@avalabs/wallet-react-components';
import { WalletBalances } from '@avalabs/wallet-react-components';

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
  // eslint-disable-next-line no-prototype-builtins
  return state?.hasOwnProperty('locked');
}
