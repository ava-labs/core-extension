import { Network } from '@avalabs/core-chains-sdk';
import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
  SolanaProvider,
} from '@avalabs/core-wallets-sdk';

import {
  BaseSendOptions,
  NativeSendOptions,
  PVMSendOptions,
  SendOptions,
  SolanaSendOptions,
} from '../../models';

import {
  NetworkTokenWithBalance,
  NetworkVMType,
  TokenWithBalanceAVM,
  TokenWithBalanceBTC,
  TokenWithBalancePVM,
  TokenWithBalanceSVM,
} from '@avalabs/vm-module-types';
import { Account, EnsureDefined, SendErrorMessage } from '@core/types';

type CommonAdapterOptions<Provider, Token> = {
  from: string;
  provider: Provider;
  maxFee: bigint;
  nativeToken: Token;
};

export type AdapterOptionsEVM = {
  chainId: string;
};

export type AdapterOptionsBTC = {
  isMainnet: boolean;
};

export type AdapterOptionsSVM = {
  account: SvmCapableAccount;
};

export type AvmCapableAccount = EnsureDefined<
  Account,
  'addressAVM' | 'addressCoreEth'
>;

export const isAvmCapableAccount = (
  account?: Account,
): account is AvmCapableAccount =>
  Boolean(account && account.addressAVM && account.addressCoreEth);

export type PvmCapableAccount = EnsureDefined<
  Account,
  'addressPVM' | 'addressCoreEth'
>;

export type SvmCapableAccount = EnsureDefined<Account, 'addressSVM'>;

export type BtcCapableAccount = EnsureDefined<Account, 'addressBTC'>;

export type EvmCapableAccount = EnsureDefined<Account, 'addressC'>;

export type HvmCapableAccount = EnsureDefined<Account, 'addressHVM'>;

export type CoreEthCapableAccount = EnsureDefined<Account, 'addressCoreEth'>;

// Type mapping for VM types to their corresponding account types
type VMAccountTypeMap = {
  [NetworkVMType.EVM]: EvmCapableAccount;
  [NetworkVMType.SVM]: SvmCapableAccount;
  [NetworkVMType.AVM]: AvmCapableAccount;
  [NetworkVMType.PVM]: PvmCapableAccount;
  [NetworkVMType.HVM]: HvmCapableAccount;
  [NetworkVMType.BITCOIN]: BtcCapableAccount;
  [NetworkVMType.CoreEth]: CoreEthCapableAccount;
};

export const isPvmCapableAccount = (
  account?: Account,
): account is PvmCapableAccount =>
  Boolean(account && account.addressPVM && account.addressCoreEth);

export const isSvmCapableAccount = (
  account?: Account,
): account is SvmCapableAccount => Boolean(account && account.addressSVM);

export const isBtcCapableAccount = (
  account?: Account,
): account is BtcCapableAccount => Boolean(account && account.addressBTC);

export const isHvmCapableAccount = (
  account?: Account,
): account is HvmCapableAccount => Boolean(account && account.addressHVM);

export const isCoreEthCapableAccount = (
  account?: Account,
): account is CoreEthCapableAccount =>
  Boolean(account && account.addressCoreEth);

export const isVMCapableAccount = <V extends NetworkVMType>(
  vm: V,
  account?: Account,
): account is VMAccountTypeMap[V] => {
  switch (vm) {
    case NetworkVMType.AVM:
      return isAvmCapableAccount(account);
    case NetworkVMType.PVM:
      return isPvmCapableAccount(account);
    case NetworkVMType.SVM:
      return isSvmCapableAccount(account);
    case NetworkVMType.BITCOIN:
      return isBtcCapableAccount(account);
    case NetworkVMType.HVM:
      return isHvmCapableAccount(account);
    case NetworkVMType.CoreEth:
      return isCoreEthCapableAccount(account);
    default:
      return true;
  }
};

export type AdapterOptionsP = {
  network: Network;
  account: PvmCapableAccount;
};

export type AdapterOptionsX = {
  network: Network;
  account: AvmCapableAccount;
};

type SendAdapter<
  Provider = unknown,
  NetworkSendOptions = unknown,
  CustomOptions = unknown,
  Token = NetworkTokenWithBalance,
  AdditionalOutput = Record<string, unknown>,
> = (options: CommonAdapterOptions<Provider, Token> & CustomOptions) => {
  isSending: boolean;
  isValidating: boolean;
  isValid: boolean;
  maxAmount: string;
  error?: SendErrorMessage;

  send(options: NetworkSendOptions): Promise<string>;
  validate(options: Partial<NetworkSendOptions>): Promise<void>;
} & AdditionalOutput;

export type SendAdapterEVM = SendAdapter<
  JsonRpcBatchInternal,
  SendOptions,
  AdapterOptionsEVM,
  NetworkTokenWithBalance
>;

export type SendAdapterBTC = SendAdapter<
  BitcoinProvider,
  BaseSendOptions,
  AdapterOptionsBTC,
  TokenWithBalanceBTC
>;

export type SendAdapterSVM = SendAdapter<
  SolanaProvider,
  SolanaSendOptions,
  AdapterOptionsSVM,
  TokenWithBalanceSVM,
  {
    minAmount?: string;
  }
>;

export type SendAdapterPVM = SendAdapter<
  Avalanche.JsonRpcProvider,
  PVMSendOptions,
  AdapterOptionsP,
  TokenWithBalancePVM,
  {
    estimatedFee: bigint;
  }
>;

export type SendAdapterAVM = SendAdapter<
  Avalanche.JsonRpcProvider,
  NativeSendOptions,
  AdapterOptionsX,
  TokenWithBalanceAVM
>;

export const isInsufficientBalanceError = (err: any) => {
  if (!err || !err.message || typeof err.message !== 'string') {
    return false;
  }

  const knownInsufficientBalanceSubstrings = [
    'insufficient funds',
    'exceeds balance',
  ];
  return knownInsufficientBalanceSubstrings.some((substr) =>
    err.message.includes(substr),
  );
};
