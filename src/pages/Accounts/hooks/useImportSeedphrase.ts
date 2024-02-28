import { useCallback, useState } from 'react';

import {
  ImportSeedphraseWalletParams,
  ImportWalletResult,
} from '@src/background/services/wallet/handlers/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { ImportSeedPhraseHandler } from '@src/background/services/wallet/handlers/importSeedPhrase';

type ImportWalletFn = (
  params: ImportSeedphraseWalletParams
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
    [request]
  );

  return {
    isImporting,
    importSeedphrase,
  };
};
