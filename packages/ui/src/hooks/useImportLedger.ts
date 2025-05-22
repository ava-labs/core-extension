import { useCallback, useState } from 'react';

import {
  ImportLedgerWalletParams,
  ImportWalletResult,
  ExtensionRequest,
} from '@core/types';
import { useConnectionContext } from '../contexts';
import { ImportLedgerHandler } from '@core/service-worker';

type ImportWalletFn = (
  params: ImportLedgerWalletParams,
) => Promise<ImportWalletResult>;

export const useImportLedger = () => {
  const { request } = useConnectionContext();
  const [isImporting, setIsImporting] = useState(false);

  const importLedger: ImportWalletFn = useCallback(
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

  return {
    isImporting,
    importLedger,
  };
};
