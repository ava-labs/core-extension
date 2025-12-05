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
  [BitcoinCaip2ChainId.MAINNET]: 'addressBTC',
  [AvalancheCaip2ChainId.P]: 'addressPVM',
  [AvalancheCaip2ChainId.X]: 'addressAVM',
  [AvalancheCaip2ChainId.C]: 'addressCoreEth',
  'eip155:43114': 'addressC',
  'eip155:1': 'addressC',
};
