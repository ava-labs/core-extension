import {
  AvalancheCaip2ChainId,
  BitcoinCaip2ChainId,
  ChainId,
} from '@avalabs/core-chains-sdk';
import { SolanaCaipId } from '@core/common';
import { AccountTypes } from '~/api-clients/types';

export const CORE_ETH_CAIP2ID = 'avax:8aDU0Kqh-5d23op-B-r-4YbQFRbsgF9a';

export const AVALANCHE_CHAIN_IDS = Object.freeze({
  MAINNET_P: '11111111111111111111111111111111LpoYY',
  TESTNET_P: '11111111111111111111111111111111LpoYY',
  MAINNET_X: '2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM',
  TESTNET_X: '2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm',
  MAINNET_C: '2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5',
  TESTNET_C: 'yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp',
});

export const Caip2IdAccountTypeMap: Record<string, AccountTypes> = {
  [SolanaCaipId[ChainId.SOLANA_MAINNET_ID]]: 'addressSVM',
  [BitcoinCaip2ChainId.MAINNET]: 'addressBTC',
  [AvalancheCaip2ChainId.P]: 'addressPVM',
  [AvalancheCaip2ChainId.X]: 'addressAVM',
  [AvalancheCaip2ChainId.C]: 'addressCoreEth',
  'eip155:43114': 'addressC',
  'eip155:1': 'addressC',
};
