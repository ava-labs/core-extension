import { useCallback, useState } from 'react';

import {
  ImportLedgerWalletParams,
  ImportWalletResult,
} from '@src/background/services/wallet/handlers/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { ImportLedgerHandler } from '@src/background/services/wallet/handlers/importLedger';

type ImportWalletFn = (
  params: ImportLedgerWalletParams
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
    [request]
  );

  return {
    isImporting,
    importLedger,
  };
};
