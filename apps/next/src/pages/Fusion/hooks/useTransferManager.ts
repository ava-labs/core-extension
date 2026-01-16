import {
  createTransferManager,
  Environment,
  ServiceType,
  TokenType,
} from '@avalabs/unified-asset-transfer';
import { use } from 'react';

export const useTransferManager = () => {
  // Create a TransferManager
  const transferManager = use(
    createTransferManager({
      environment: Environment.PROD,
      serviceInitializers: [
        {
          type: ServiceType.AVALANCHE_EVM,
          evmSigner,
        },
        {
          type: ServiceType.MARKR,
          evmSigner: {
            sign: async () => {},
          },
          markrApiToken: process.env.MARKR_API_TOKEN, // Not required (if using the default proxy API url)
          markrApiUrl: 'https://staging-orchestrator.markr.io', // Not required
          markrAppId: process.env.MARKR_APP_ID!, // Required
        },
      ],
    }),
  );
};
