import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { ChainIDAlias } from '@keystonehq/hw-app-avalanche';
import { getAddressFromXPub } from '@avalabs/core-wallets-sdk';

import { ExtensionRequest } from '@core/types';
import { useConnectionContext, useKeystoneUsbContext, toast } from '@core/ui';
import { MigrateMissingPublicKeysFromKeystoneHandler } from '@core/service-worker';

import { ImportMissingKeysStatus } from '../types';

export const useImportMissingKeysFromKeystone = (
  expectedFirstEvmAddress: string,
) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const {
    hasKeystoneTransport,
    getExtendedPublicKey,
    wasTransportAttempted,
    initKeystoneTransport,
    retryConnection,
  } = useKeystoneUsbContext();

  const [status, setStatus] = useState<ImportMissingKeysStatus>('waiting');

  const verifyAndImport = useCallback(async () => {
    try {
      setStatus('importing');

      const evmXpub = await getExtendedPublicKey(ChainIDAlias.C, 0);

      const firstEvmAddressFromDevice = getAddressFromXPub(evmXpub, 0);

      const isCorrectDevice =
        firstEvmAddressFromDevice === expectedFirstEvmAddress;

      if (!isCorrectDevice) {
        setStatus('incorrect-device-error');
        return;
      }

      await request<MigrateMissingPublicKeysFromKeystoneHandler>({
        method: ExtensionRequest.KEYSTONE_MIGRATE_MISSING_PUBKEYS,
      });

      toast.success(t('Import successful!'));
    } catch (err) {
      setStatus('import-error');
      console.error(
        '[useImportMissingKeysFromKeystone] Failed to import missing public keys from Keystone',
        err,
      );
    }
  }, [getExtendedPublicKey, request, t, expectedFirstEvmAddress]);

  useEffect(() => {
    if (status !== 'waiting') {
      return;
    }

    if (hasKeystoneTransport) {
      setStatus('connected');

      // This will trigger the "wallet connection" request approval on the device.
      getExtendedPublicKey(ChainIDAlias.C, 0)
        .then(() => setStatus('request-approved'))
        .catch(() => setStatus('request-rejected'));
    } else if (!wasTransportAttempted) {
      initKeystoneTransport();
    } else {
      retryConnection();
    }
  }, [
    hasKeystoneTransport,
    wasTransportAttempted,
    initKeystoneTransport,
    status,
    getExtendedPublicKey,
    retryConnection,
  ]);

  useEffect(() => {
    if (status === 'request-approved') {
      verifyAndImport();
    }
  }, [status, verifyAndImport]);

  return {
    status,
    retry: () => setStatus('waiting'),
  };
};
