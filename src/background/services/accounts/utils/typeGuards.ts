import {
  Account,
  AccountType,
  FireblocksAccount,
  PrimaryAccount,
  WalletConnectAccount,
} from '../models';

export const isFireblocksAccount = (
  account?: Account
): account is FireblocksAccount => account?.type === AccountType.FIREBLOCKS;

export const isWalletConnectAccount = (
  account?: Account
): account is WalletConnectAccount =>
  account?.type === AccountType.WALLET_CONNECT;

export const isPrimaryAccount = (
  account?: Account
): account is PrimaryAccount => account?.type === AccountType.PRIMARY;
