import { AccountStorageItem } from '@core/types';
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

export type NonAvalancheRequestItem = Exclude<
  GetBalanceRequestItem,
  AvalancheCorethGetBalancesRequestItem | AvalancheXpGetBalancesRequestItem
>;

export type NameSpace = GetBalanceRequestItem['namespace'];

export type SplTokenBalance =
  SvmGetBalancesResponse['balances']['splTokenBalances'][number];

export type AccountTypes = keyof Pick<
  AccountStorageItem,
  Extract<keyof AccountStorageItem, `address${string}`>
>;

export type PartialGetBalancePayload = Record<
  string, // the name space
  GetBalanceRequestItem
>;
