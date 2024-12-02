import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
} from '@avalabs/core-wallets-sdk';
import { Network } from '@avalabs/core-chains-sdk';

import {
  BaseSendOptions,
  NativeSendOptions,
  PVMSendOptions,
  SendOptions,
} from '../../models';

import { Account } from '@src/background/services/accounts/models';
import { EnsureDefined } from '@src/background/models';
import { SendErrorMessage } from '@src/utils/send/models';
import {
  NetworkTokenWithBalance,
  TokenWithBalanceAVM,
  TokenWithBalanceBTC,
  TokenWithBalancePVM,
} from '@avalabs/vm-module-types';

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

export type AvmCapableAccount = EnsureDefined<
  Account,
  'addressAVM' | 'addressCoreEth'
>;

export const isAvmCapableAccount = (
  account?: Account
): account is AvmCapableAccount =>
  Boolean(account && account.addressAVM && account.addressCoreEth);

export type PvmCapableAccount = EnsureDefined<
  Account,
  'addressPVM' | 'addressCoreEth'
>;

export const isPvmCapableAccount = (
  account?: Account
): account is PvmCapableAccount =>
  Boolean(account && account.addressPVM && account.addressCoreEth);

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
  AdditionalOutput = Record<string, unknown>
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
