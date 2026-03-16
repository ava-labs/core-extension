import { useMemo } from 'react';
import { ServiceType } from '@avalabs/fusion-sdk';

import { useNetworkContext } from '@core/ui';
import { getServiceInitializer } from '@core/common';
import { UnifiedTransferSigners } from '@core/types';

export const useTransferServiceInitializers = (
  services: ServiceType[],
  signers: UnifiedTransferSigners | null,
) => {
  const { bitcoinProvider } = useNetworkContext();

  return useMemo(() => {
    if (!bitcoinProvider || !signers) {
      return [];
    }

    return services.map((service) =>
      getServiceInitializer(service, bitcoinProvider, signers),
    );
  }, [bitcoinProvider, services, signers]);
};
