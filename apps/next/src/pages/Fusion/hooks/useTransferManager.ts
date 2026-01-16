import {
  BtcSigner,
  createTransferManager,
  Environment,
  EvmSigner,
  ServiceType,
  TransferManager,
} from '@avalabs/unified-asset-transfer';
import { useEffect, useState } from 'react';

type TransferManagerProps = {
  signers: {
    evm: EvmSigner;
    btc?: BtcSigner;
  };
};

export const useTransferManager = ({ signers }: TransferManagerProps) => {
  const [manager, setManager] = useState<TransferManager | null>(null);

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
          markrAppId: 'core', // TODO: Required
        },
      ],
    })
      .then((m) => {
        console.log('Transfer manager created', m);
        setManager(m);
      })
      .catch((error) => {
        console.error('Error creating transfer manager', error);
        setManager(null);
      });
  }, [signers]);

  return manager;
};
