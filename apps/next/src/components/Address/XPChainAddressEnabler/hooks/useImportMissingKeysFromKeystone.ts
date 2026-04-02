import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { ChainIDAlias } from '@keystonehq/hw-app-avalanche';
import { getAddressFromXPub } from '@avalabs/core-wallets-sdk';

import { ExtensionRequest } from '@core/types';
import { useConnectionContext, useKeystoneUsbContext, toast } from '@core/ui';
import { MigrateMissingPublicKeysFromKeystoneHandler } from '@core/service-worker';

import { ImportMissingKeysStatus } from '../types';

export const useImportMissingKeysFromKeystone = () => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const {
    hasKeystoneTransport,
    getExtendedPublicKey,
    wasTransportAttempted,
    retryConnection,
  } = useKeystoneUsbContext();

  const [status, setStatus] = useState<ImportMissingKeysStatus>('idle');
  const [firstEvmAddress, setFirstEvmAddress] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'initialized' && status !== 'connecting') {
      return;
    }

    if (hasKeystoneTransport) {
      setStatus('connected');
    } else if (!wasTransportAttempted) {
      setStatus('connecting');
      retryConnection();
    } else {
      setStatus('connection-error');
    }
  }, [hasKeystoneTransport, wasTransportAttempted, retryConnection, status]);

  const verifyAndImport = useCallback(async () => {
    try {
      setStatus('verifying-device');
      const evmXpub = await getExtendedPublicKey(ChainIDAlias.C, 0);
      const firstEvmAddressFromDevice = getAddressFromXPub(evmXpub, 0);

      const isCorrectDevice = firstEvmAddressFromDevice === firstEvmAddress;

      if (!isCorrectDevice) {
        setStatus('incorrect-device');
        return;
      }

      setStatus('importing');
      await request<MigrateMissingPublicKeysFromKeystoneHandler>({
        method: ExtensionRequest.KEYSTONE_MIGRATE_MISSING_PUBKEYS,
      });
      toast.success(t('Import successful!'));
      setStatus('success');
      return true;
    } catch (err) {
      setStatus('import-error');
      console.error(
        '[useImportMissingKeysFromKeystone] Failed to import missing public keys from Keystone',
        err,
      );
      return false;
    }
  }, [getExtendedPublicKey, request, firstEvmAddress, t]);

  useEffect(() => {
    if (status !== 'connected' || !firstEvmAddress) {
      return;
    }

    verifyAndImport();
  }, [status, firstEvmAddress, verifyAndImport]);

  const initialize = useCallback(async (expectedEvmAddress: string) => {
    setFirstEvmAddress(expectedEvmAddress);
    setStatus('initialized');
  }, []);

  return {
    status,
    initialize,
    verifyAndImport,
  };
};
