import { useMemo } from 'react';
import { ServiceType } from '@avalabs/fusion-sdk';

import { useNetworkContext } from '@core/ui';
import { getServiceInitializer } from '@core/common';
import { UnifiedTransferSigners } from '@core/types';

import { useAvalancheFunctions } from './useAvalancheFunctions';

export const useTransferServiceInitializers = (
  services: ServiceType[],
  signers: UnifiedTransferSigners | null,
) => {
  const { bitcoinProvider } = useNetworkContext();
  const avalancheFunctions = useAvalancheFunctions();

  return useMemo(() => {
    if (!bitcoinProvider || !signers) {
      return [];
    }

    return services.map((service) =>
      getServiceInitializer(
        service,
        bitcoinProvider,
        signers,
        avalancheFunctions,
      ),
    );
  }, [avalancheFunctions, bitcoinProvider, services, signers]);
};
