import { Network } from '@src/background/services/network/models';
import { Account } from '@src/background/services/accounts/models';
import { AvmCapableAccount, PvmCapableAccount } from './hooks/useSend/models';
import {
  NetworkTokenWithBalance,
  NftTokenWithBalance,
  TokenWithBalanceAVM,
  TokenWithBalanceBTC,
  TokenWithBalanceERC20,
  TokenWithBalancePVM,
} from '@avalabs/vm-module-types';
import { NetworkFee } from '@src/background/services/networkFee/models';

export type SendPageProps<Provider, Token, Tokens> = {
  network: Network;
  tokenList: Tokens;
  fromAddress: string;
  nativeToken: Token;
  maxFee: bigint;
  provider: Provider;
  onSuccess: (txHash: string) => void;
  onFailure: (err: unknown) => void;
  onApproved: () => void;
};

export type SendPagePropsWithWallet<Provider, Token, Tokens> = SendPageProps<
  Provider,
  Token,
  Tokens
> & {
  account: Account;
};
export type SendPagePropsWithWalletPVM<Provider, Token, Tokens> = SendPageProps<
  Provider,
  Token,
  Tokens
> & {
  account: PvmCapableAccount;
  networkFee: NetworkFee;
};

export type SendPagePropsWithWalletAVM<Provider, Token, Tokens> = SendPageProps<
  Provider,
  Token,
  Tokens
> & {
  account: AvmCapableAccount;
};

export type BaseSendOptions = {
  address: string;
  amount: string;
};

export type NativeSendOptions = BaseSendOptions & {
  token: NetworkTokenWithBalance;
};

export type AVMSendOptions = BaseSendOptions & {
  token: TokenWithBalanceAVM;
};

export type PVMSendOptions = BaseSendOptions & {
  token: TokenWithBalancePVM;
  gasPrice?: bigint;
};

export type Erc20SendOptions = BaseSendOptions & {
  token: TokenWithBalanceERC20;
};

export type NftSendOptions = BaseSendOptions & {
  token: NftTokenWithBalance;
  amount: never;
};

export type BtcSendOptions = {
  address: string;
  amount: number;
  token: TokenWithBalanceBTC;
  feeRate: number;
};

export type SendOptions = NativeSendOptions | Erc20SendOptions | NftSendOptions;
