import { useMemo } from 'react';
import { ServiceType } from '@avalabs/unified-asset-transfer';

import { useNetworkContext } from '@core/ui';
import { getServiceInitializer } from '@core/common';
import { UnifiedTransferSigners } from '@core/types';

export const useTransferServiceInitializers = (
  services: ServiceType[],
  signers: UnifiedTransferSigners,
) => {
  const { bitcoinProvider } = useNetworkContext();

  return useMemo(() => {
    if (!bitcoinProvider) {
      return [];
    }

    return services.map((service) =>
      getServiceInitializer(service, bitcoinProvider, signers),
    );
  }, [bitcoinProvider, services, signers]);
};
