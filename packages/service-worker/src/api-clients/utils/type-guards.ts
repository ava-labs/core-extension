import {
  AvmGetBalancesResponse,
  BtcGetBalancesResponse,
  CorethGetBalancesResponse,
  EvmGetBalancesResponse,
  GetBalancesResponse,
  PvmGetBalancesResponse,
  SvmGetBalancesResponse,
} from '~/api-clients/balance-api';

export const isErrorResponse = (
  response: GetBalancesResponse,
): response is { error: string } => !!response.error;

export const isEvmGetBalancesResponse = (
  response: GetBalancesResponse,
): response is EvmGetBalancesResponse => {
  return (response as EvmGetBalancesResponse).networkType === 'evm';
};

export const isAvmGetBalancesResponse = (
  response: GetBalancesResponse,
): response is AvmGetBalancesResponse => {
  return (response as AvmGetBalancesResponse).networkType === 'avm';
};

export const isBtcGetBalancesResponse = (
  response: GetBalancesResponse,
): response is BtcGetBalancesResponse => {
  return (response as BtcGetBalancesResponse).networkType === 'btc';
};

export const isPvmGetBalancesResponse = (
  response: GetBalancesResponse,
): response is PvmGetBalancesResponse => {
  return (response as PvmGetBalancesResponse).networkType === 'pvm';
};

export const isSvmGetBalancesResponse = (
  response: GetBalancesResponse,
): response is SvmGetBalancesResponse => {
  return (response as SvmGetBalancesResponse).networkType === 'svm';
};

export const isCorethGetBalancesResponse = (
  response: GetBalancesResponse,
): response is CorethGetBalancesResponse => {
  return (response as CorethGetBalancesResponse).networkType === 'coreth';
};
