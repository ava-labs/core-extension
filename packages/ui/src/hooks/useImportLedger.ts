import { useCallback, useState } from 'react';

import {
  ImportLedgerWalletParams,
  ImportWalletResult,
  ExtensionRequest,
  isLegacyImportLedgerWalletParams,
  LegacyImportLedgerWalletParams,
} from '@core/types';
import { useConnectionContext } from '../contexts';
import type {
  ImportLedgerHandler,
  ImportLedgerHandlerNew,
} from '@core/service-worker';

type ImportWalletFn = (
  params: ImportLedgerWalletParams,
) => Promise<ImportWalletResult>;

type ImportWalletLegacyFn = (
  params: LegacyImportLedgerWalletParams,
) => Promise<ImportWalletResult>;

export const useImportLedger = () => {
  const { request } = useConnectionContext();
  const [isImporting, setIsImporting] = useState(false);

  const importLedgerLegacy: ImportWalletLegacyFn = useCallback(
    async (params) => {
      setIsImporting(true);

      try {
        const result = await request<ImportLedgerHandler>({
          method: ExtensionRequest.WALLET_IMPORT_LEDGER,
          params: [params],
        });

        return result;
      } finally {
        setIsImporting(false);
      }
    },
    [request],
  );

  const importLedger: ImportWalletFn = useCallback(
    async (params) => {
      if (isLegacyImportLedgerWalletParams(params)) {
        return importLedgerLegacy(params);
      }

      setIsImporting(true);

      try {
        const result = await request<ImportLedgerHandlerNew>({
          method: ExtensionRequest.WALLET_IMPORT_LEDGER_NEW,
          params: [params],
        });

        return result;
      } finally {
        setIsImporting(false);
      }
    },
    [request, importLedgerLegacy],
  );

  return {
    isImporting,
    importLedger,
  };
};
