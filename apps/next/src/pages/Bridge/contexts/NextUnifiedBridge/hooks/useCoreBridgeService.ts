import {
  BridgeServicesMap,
  createUnifiedBridgeService,
  Environment,
  getEnabledBridgeServices,
} from '@avalabs/bridge-unified';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { getEnabledBridgeTypes } from '@core/common';
import { useConnectionContext, useFeatureFlagContext } from '@core/ui';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInitializerForBridgeType } from '../utils/getInitializerForBridgeType';
import { getBtcSigner, getEVMSigner } from '../utils/signers';

export function useCoreBridgeService(
  environment: Environment | null,
  bitcoinProvider: BitcoinProvider | undefined,
) {
  const { request } = useConnectionContext();
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();
  const [activeBridgeTypes, setActiveBridgeTypes] =
    useState<BridgeServicesMap>();

  const signers = useMemo<Parameters<typeof getInitializerForBridgeType>[2]>(
    () => ({
      evm: getEVMSigner(request, t),
      btc: getBtcSigner(request, t),
    }),
    [request, t],
  );

  const bridgeInitializers = useMemo(() => {
    if (!bitcoinProvider) {
      return null;
    }

    return getEnabledBridgeTypes(featureFlags).map((bridgeType) =>
      getInitializerForBridgeType(bridgeType, bitcoinProvider, signers),
    );
  }, [bitcoinProvider, featureFlags, signers]);

  useEffect(() => {
    if (!environment || !bridgeInitializers) {
      return;
    }

    getEnabledBridgeServices(environment, bridgeInitializers)
      .then(setActiveBridgeTypes)
      .catch((err) => {
        console.log('Unable to initialize bridge services', err);
        setActiveBridgeTypes(undefined);
      });
  }, [environment, bridgeInitializers]);

  // Memoize the core instance of Unified Bridge based on the current
  // network environment & feature flags configuration
  const core = useMemo(() => {
    if (!environment || !activeBridgeTypes) {
      return null;
    }

    return createUnifiedBridgeService({
      environment,
      enabledBridgeServices: activeBridgeTypes,
    });
  }, [environment, activeBridgeTypes]);

  return core;
}
