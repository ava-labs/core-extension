import { useCallback, useMemo, useRef } from 'react';
import { ServiceType } from '@avalabs/fusion-sdk';

import { useConnectionContext, useNetworkContext } from '@core/ui';
import { getServiceInitializer, type GetTargetChainAssets } from '@core/common';
import { ExtensionRequest, type UnifiedTransferSigners } from '@core/types';

import { useAvalancheFunctions } from './useAvalancheFunctions';
import type { GetMarkrTargetChainAssetsHandler } from '@core/service-worker';
import {
  createLiveDelegate,
  getCapabilitySignature,
} from '../../lib/createLiveDelegate';

export const useTransferServiceInitializers = (
  services: ServiceType[],
  signers: UnifiedTransferSigners | null,
) => {
  const { bitcoinProvider } = useNetworkContext();
  const avalancheFunctions = useAvalancheFunctions();
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

  const hasBitcoinProvider = Boolean(bitcoinProvider);
  const hasSigners = Boolean(signers);

  const bitcoinProviderRef = useRef(bitcoinProvider);
  const signersRef = useRef(signers);
  const avalancheFunctionsRef = useRef(avalancheFunctions);
  const getTargetChainAssetsRef = useRef(getTargetChainAssets);

  bitcoinProviderRef.current = bitcoinProvider;
  signersRef.current = signers;
  avalancheFunctionsRef.current = avalancheFunctions;
  getTargetChainAssetsRef.current = getTargetChainAssets;

  const capabilitySignature = [
    signers?.evm,
    signers?.btc,
    signers?.svm,
    bitcoinProvider,
    avalancheFunctions,
  ]
    .map(getCapabilitySignature)
    .join('|');

  const serviceInitializers = useMemo(() => {
    if (!hasBitcoinProvider || !hasSigners) {
      return [];
    }

    const liveSigners: UnifiedTransferSigners = {
      evm: createLiveDelegate(() => signersRef.current!.evm),
      btc: createLiveDelegate(() => signersRef.current!.btc),
      svm: createLiveDelegate(() => signersRef.current!.svm),
    };
    const liveBitcoinFunctions = createLiveDelegate(
      () => bitcoinProviderRef.current!,
    );
    const liveAvalancheFunctions = createLiveDelegate(
      () => avalancheFunctionsRef.current,
    );
    const liveGetTargetChainAssets: GetTargetChainAssets = (props) =>
      getTargetChainAssetsRef.current(props);

    return services.map((service) =>
      getServiceInitializer(
        service,
        liveBitcoinFunctions,
        liveSigners,
        liveAvalancheFunctions,
        liveGetTargetChainAssets,
      ),
    );
    // The delegates freeze their method set at creation, so a capability change must rebuild them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBitcoinProvider, hasSigners, services, capabilitySignature]);

  return { serviceInitializers, capabilitySignature };
};
