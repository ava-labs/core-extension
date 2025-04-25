import { useCallback, useState } from 'react';

import {
  ImportSeedphraseWalletParams,
  ImportWalletResult,
	ExtensionRequest,
} from '@core/types';
import { useConnectionContext } from '@/contexts/ConnectionProvider';
import { ImportSeedPhraseHandler } from '@core/service-worker';

type ImportWalletFn = (
  params: ImportSeedphraseWalletParams,
) => Promise<ImportWalletResult>;

export const useImportSeedphrase = () => {
  const { request } = useConnectionContext();
  const [isImporting, setIsImporting] = useState(false);

  const importSeedphrase: ImportWalletFn = useCallback(
    async (params) => {
      setIsImporting(true);

      try {
        const result = await request<ImportSeedPhraseHandler>({
          method: ExtensionRequest.WALLET_IMPORT_SEED_PHRASE,
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
    importSeedphrase,
  };
};
