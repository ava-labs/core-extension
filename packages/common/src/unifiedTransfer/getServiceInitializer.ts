import {
  AvalancheCctInitializer,
  BitcoinFunctions,
  EvmServiceInitializer,
  LombardServiceInitializer,
  MarkrServiceInitializer,
  ServiceInitializer,
  ServiceType,
} from '@avalabs/fusion-sdk';

import { UnifiedTransferSigners } from '@core/types';
import { MARKR_EVM_PARTNER_ID } from './constants';

export type AvalancheFunctions = Omit<AvalancheCctInitializer, 'type'>;

export type GetTargetChainAssets =
  MarkrServiceInitializer['getTargetChainAssets'];

export function getServiceInitializer(
  type: ServiceType,
  btcFunctions: BitcoinFunctions,
  { btc, evm, svm }: UnifiedTransferSigners,
  avalancheFunctions: AvalancheFunctions,
  getTargetChainAssets?: GetTargetChainAssets,
): ServiceInitializer {
  switch (type) {
    case ServiceType.AVALANCHE_CCT: {
      return {
        type,
        ...avalancheFunctions,
      } satisfies AvalancheCctInitializer;
    }

    case ServiceType.AVALANCHE_EVM:
    case ServiceType.WRAP_UNWRAP:
      return {
        type,
        evmSigner: evm,
      } satisfies EvmServiceInitializer;

    case ServiceType.MARKR:
      return {
        type,
        evmSigner: evm,
        solanaSigner: svm,
        markrApiToken: process.env.MARKR_API_TOKEN,
        markrApiUrl: process.env.MARKR_API_URL,
        markrAppId: MARKR_EVM_PARTNER_ID,
        getTargetChainAssets:
          getTargetChainAssets ??
          (() =>
            Promise.resolve({
              assets: [],
              meta: { currentPage: 1, nextPage: undefined, hasMore: false },
            })),
      } satisfies MarkrServiceInitializer;

    case ServiceType.LOMBARD_BTCB_TO_BTC:
    case ServiceType.LOMBARD_BTC_TO_BTCB:
      return {
        type,
        evmSigner: evm,
        btcSigner: btc,
        btcFunctions,
      } satisfies LombardServiceInitializer;

    default:
      throw new Error(
        `[getServiceInitializer]: Unsupported service type: ${type}`,
      );
  }
}
