import {
  LedgerWallet,
  MnemonicWallet,
  WalletType,
} from '@avalabs/avalanche-wallet-sdk';

export function isMnemonicWallet(wallet: WalletType): wallet is MnemonicWallet {
  return wallet.type === 'mnemonic';
}

export function isLedgerWallet(wallet: WalletType): wallet is LedgerWallet {
  return wallet.type === 'ledger';
}
