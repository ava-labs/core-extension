import { useCallback, useMemo } from 'react';
import { ServiceType } from '@avalabs/fusion-sdk';

import { useConnectionContext, useNetworkContext } from '@core/ui';
import { getServiceInitializer, type GetTargetChainAssets } from '@core/common';
import { ExtensionRequest, type UnifiedTransferSigners } from '@core/types';
import type { GetMarkrTargetChainAssetsHandler } from '@core/service-worker';

export const useTransferServiceInitializers = (
  services: ServiceType[],
  signers: UnifiedTransferSigners | null,
) => {
  const { bitcoinProvider } = useNetworkContext();
  const { request } = useConnectionContext();

  const getTargetChainAssets = useCallback<GetTargetChainAssets>(
    ({ targetChainId, page, limit, search }) => {
      return request<GetMarkrTargetChainAssetsHandler>({
        method: ExtensionRequest.GET_MARKR_TARGET_CHAIN_ASSETS,
        params: [targetChainId, page, limit, search?.type, search?.value],
      });
    },
    [request],
  );

  return useMemo(() => {
    if (!bitcoinProvider || !signers) {
      return [];
    }

    return services.map((service) =>
      getServiceInitializer(
        service,
        bitcoinProvider,
        signers,
        getTargetChainAssets,
      ),
    );
  }, [bitcoinProvider, services, signers, getTargetChainAssets]);
};
