import {
  BitcoinFunctions,
  EvmServiceInitializer,
  LombardServiceInitializer,
  MarkrServiceInitializer,
  ServiceInitializer,
  ServiceType,
} from '@avalabs/unified-asset-transfer';

import { MARKR_EVM_PARTNER_ID } from '@core/ui';

import { Signers } from '../types';

export function getServiceInitializer(
  type: ServiceType,
  btcFunctions: BitcoinFunctions,
  { btc, evm }: Signers,
): ServiceInitializer {
  switch (type) {
    case ServiceType.AVALANCHE_EVM:
      return {
        type,
        evmSigner: evm,
      } satisfies EvmServiceInitializer;

    case ServiceType.MARKR:
      return {
        type,
        evmSigner: evm,
        markrApiToken: process.env.MARKR_API_TOKEN,
        markrApiUrl: process.env.MARKR_API_URL,
        markrAppId: MARKR_EVM_PARTNER_ID,
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
