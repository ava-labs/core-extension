import {
  BtcSigner,
  createTransferManager,
  Environment,
  EvmSigner,
  ServiceType,
  TransferManager,
} from '@avalabs/unified-asset-transfer';
import { useEffect, useState } from 'react';

import { MARKR_EVM_PARTNER_ID } from '@core/ui';

type TransferManagerProps = {
  signers: {
    evm: EvmSigner;
    btc?: BtcSigner;
  };
};

export const useTransferManager = ({ signers }: TransferManagerProps) => {
  const [manager, setManager] = useState<TransferManager>();

  useEffect(() => {
    createTransferManager({
      environment: Environment.PROD,
      serviceInitializers: [
        {
          type: ServiceType.AVALANCHE_EVM,
          evmSigner: signers.evm,
        },
        {
          type: ServiceType.MARKR,
          evmSigner: signers.evm,
          markrApiToken: process.env.MARKR_API_TOKEN, // Not required (if using the default proxy API url)
          markrApiUrl: 'https://staging-orchestrator.markr.io', // Not required
          markrAppId: MARKR_EVM_PARTNER_ID,
        },
      ],
    })
      .then((m) => {
        console.log('Transfer manager created', m);
        setManager(m);
      })
      .catch((error) => {
        console.error('Error creating transfer manager', error);
        setManager(undefined);
      });
  }, [signers]);

  return manager;
};
