import {
  createTransferManager,
  TransferManager,
} from '@avalabs/unified-asset-transfer';
import { useEffect, useState } from 'react';

import { useFeatureFlagContext } from '@core/ui';
import { hasAtLeastOneElement, getEnabledTransferServices } from '@core/common';

import { useSigners } from './useSigners';
import { useTransferEnvironment } from './useTransferEnvironment';
import { useTransferServiceInitializers } from './useTransferServiceInitializers';

export const useTransferManager = () => {
  const { featureFlags } = useFeatureFlagContext();
  const [manager, setManager] = useState<TransferManager>();

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

    createTransferManager({
      environment,
      serviceInitializers,
    })
      .then(setManager)
      .catch((error) => {
        console.error('[useTransferManager]', error);
        setManager(undefined);
      });
  }, [environment, serviceInitializers]);

  return manager;
};
