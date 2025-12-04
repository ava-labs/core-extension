import { SecretType } from '@core/types';

const HEADER_SIZES = {
  LEDGER_SEEDLESS: 11.5,
  KEYSTONE: 10.6,
  MNEMONIC: 16,
};

const getHeaderSize = (walletType?: SecretType): number => {
  if (!walletType) return HEADER_SIZES.MNEMONIC;
  return walletType === SecretType.LedgerLive ||
    walletType === SecretType.Ledger ||
    walletType === SecretType.Seedless
    ? HEADER_SIZES.LEDGER_SEEDLESS
    : walletType === SecretType.Keystone ||
        walletType === SecretType.Keystone3Pro
      ? HEADER_SIZES.KEYSTONE
      : HEADER_SIZES.MNEMONIC;
};

const WALLET_VIEW_SIZES = {
  LEDGER_SEEDLESS: 19,
  KEYSTONE: 17.6,
  MNEMONIC: 26.5,
};

const getWalletViewSize = (walletType?: SecretType): number => {
  if (!walletType) return WALLET_VIEW_SIZES.MNEMONIC;
  return walletType === SecretType.LedgerLive ||
    walletType === SecretType.Ledger ||
    walletType === SecretType.Seedless
    ? WALLET_VIEW_SIZES.LEDGER_SEEDLESS
    : walletType === SecretType.Keystone ||
        walletType === SecretType.Keystone3Pro
      ? WALLET_VIEW_SIZES.KEYSTONE
      : WALLET_VIEW_SIZES.MNEMONIC;
};

export const useWalletIconSize = (
  walletType?: SecretType,
  location?: 'header' | 'walletView',
): number => {
  return location === 'header'
    ? getHeaderSize(walletType)
    : getWalletViewSize(walletType);
};
