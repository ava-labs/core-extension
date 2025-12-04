import {
  AvalancheCorethGetBalancesRequestItem,
  AvalancheXpGetBalancesRequestItem,
  AvmGetBalancesResponse,
  BtcGetBalancesRequestItem,
  BtcGetBalancesResponse,
  CorethGetBalancesResponse,
  EvmGetBalancesRequestItem,
  EvmGetBalancesResponse,
  PvmGetBalancesResponse,
  SvmGetBalancesRequestItem,
  SvmGetBalancesResponse,
} from '~/api-clients/balance-api';
import { AccountStorageItem } from '@core/types';

export type BalanceResponse =
  | CorethGetBalancesResponse
  | EvmGetBalancesResponse
  | AvmGetBalancesResponse
  | BtcGetBalancesResponse
  | PvmGetBalancesResponse
  | SvmGetBalancesResponse;

export type GetBalanceRequestItem =
  | EvmGetBalancesRequestItem
  | BtcGetBalancesRequestItem
  | SvmGetBalancesRequestItem
  | AvalancheCorethGetBalancesRequestItem
  | AvalancheXpGetBalancesRequestItem;

export type NotAvalancheRequestItem =
  | EvmGetBalancesRequestItem
  | BtcGetBalancesRequestItem
  | SvmGetBalancesRequestItem;

export type NameSpace = 'eip155' | 'bip122' | 'solana' | 'avax';

export type SplTokenBalance =
  SvmGetBalancesResponse['balances']['splTokenBalances']['0'];

export type AccountTypes = keyof Pick<
  AccountStorageItem,
  | 'addressC'
  | 'addressBTC'
  | 'addressAVM'
  | 'addressPVM'
  | 'addressCoreEth'
  | 'addressSVM'
>;
