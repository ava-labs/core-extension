import { createTransferManager, TransferManager } from '@avalabs/fusion-sdk';
import { useEffect, useState } from 'react';

import { useFeatureFlagContext } from '@core/ui';
import { hasAtLeastOneElement, getEnabledTransferServices } from '@core/common';

import { useSigners } from './useSigners';
import { useTransferEnvironment } from './useTransferEnvironment';
import { useTransferServiceInitializers } from './useTransferServiceInitializers';

export const useTransferManager = () => {
  const { featureFlags } = useFeatureFlagContext();
  const [manager, setManager] = useState<TransferManager>();
  const [error, setError] = useState(false);

  const signers = useSigners();
  const environment = useTransferEnvironment();
  const enabledServices = getEnabledTransferServices(featureFlags);
  const serviceInitializers = useTransferServiceInitializers(
    enabledServices,
    signers,
  );

  useEffect(() => {
    if (!environment || !hasAtLeastOneElement(serviceInitializers)) {
      return;
    }

    // We need to use a flag to abort setting of the manager if the component is unmounted.
    // Otherwise we run into race-conditions (i.e. if two managers are created in quick succession).
    let aborted = false;

    createTransferManager({
      environment,
      serviceInitializers,
    })
      .then((_manager) => {
        if (aborted) return;

        setManager(_manager);
        setError(false);
      })
      .catch((err) => {
        if (aborted) return;

        setManager(undefined);
        setError(true);
        console.error('[useTransferManager]', err);
      });

    return () => {
      aborted = true;
    };
  }, [environment, serviceInitializers]);

  return {
    manager,
    error,
  };
};
