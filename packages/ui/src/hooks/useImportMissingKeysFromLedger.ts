import { ExtensionRequest } from '@core/types';
import { useCallback, useEffect, useRef } from 'react';
import { MigrateMissingPublicKeysFromLedgerHandler } from '@core/service-worker';

import {
  useActiveLedgerAppInfo,
  LedgerAppType,
  useConnectionContext,
  useWalletContext,
} from '../contexts';
import { useIsCorrectDeviceForActiveWallet } from './useIsCorrectDeviceForActiveWallet';

export const useImportMissingKeysFromLedger = () => {
  const { request } = useConnectionContext();
  const { appType } = useActiveLedgerAppInfo();
  const { isLedgerWallet } = useWalletContext();

  const status = useIsCorrectDeviceForActiveWallet();
  const done = useRef(false);

  const importMissingKeys = useCallback(async () => {
    try {
      await request<MigrateMissingPublicKeysFromLedgerHandler>({
        method: ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
      });
      done.current = true;
    } catch (_err) {
      // Don't do anything, we'll try again next time.
    }
  }, [request]);

  useEffect(() => {
    // Only attempt once per session/window load.
    if (
      !isLedgerWallet ||
      done.current ||
      status !== 'correct' ||
      appType !== LedgerAppType.AVALANCHE
    ) {
      return;
    }

    importMissingKeys();
  }, [isLedgerWallet, status, appType, importMissingKeys]);
};
