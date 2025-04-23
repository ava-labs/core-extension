import { useCallback, useState } from 'react';

import {
  ImportLedgerWalletParams,
  ImportWalletResult,
} from '@core/service-worker';
import { ExtensionRequest } from '@core/service-worker';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
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
