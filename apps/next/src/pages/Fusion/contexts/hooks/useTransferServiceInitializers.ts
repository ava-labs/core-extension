import { useMemo } from 'react';
import { ServiceType } from '@avalabs/unified-asset-transfer';

import { useNetworkContext } from '@core/ui';

import { Signers } from '../../types';
import { getServiceInitializer } from '../../lib/getServiceInitializer';

export const useTransferServiceInitializers = (
  services: ServiceType[],
  signers: Signers,
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
