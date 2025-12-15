import {
  AvalancheCaip2ChainId,
  BitcoinCaip2ChainId,
  ChainId,
} from '@avalabs/core-chains-sdk';
import { SolanaCaipId } from '@core/common';
import { AccountTypes } from '~/api-clients/types';

export const CORE_ETH_CAIP2ID = 'avax:8aDU0Kqh-5d23op-B-r-4YbQFRbsgF9a';

export const Caip2IdAccountTypeMap: Record<string, AccountTypes> = {
  [SolanaCaipId[ChainId.SOLANA_MAINNET_ID]]: 'addressSVM',
  [SolanaCaipId[ChainId.SOLANA_TESTNET_ID]]: 'addressSVM',
  [BitcoinCaip2ChainId.MAINNET]: 'addressBTC',
  [BitcoinCaip2ChainId.TESTNET]: 'addressBTC',
  [AvalancheCaip2ChainId.P]: 'addressPVM',
  [AvalancheCaip2ChainId.P_TESTNET]: 'addressPVM',
  [AvalancheCaip2ChainId.X]: 'addressAVM',
  [AvalancheCaip2ChainId.X_TESTNET]: 'addressAVM',
  [AvalancheCaip2ChainId.C]: 'addressCoreEth',
  [AvalancheCaip2ChainId.C_TESTNET]: 'addressCoreEth',
  'eip155:43114': 'addressC',
  'eip155:43113': 'addressC',
  'eip155:1': 'addressC',
  'eip155:11155111': 'addressC',
};

export const NameSpaceAccountTypeMap: Record<string, AccountTypes> =
  Object.freeze({
    eip155: 'addressC',
  });
