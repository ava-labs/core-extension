import { useCallback, useState } from 'react';
import { utils } from '@avalabs/avalanchejs';

import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { ImportType } from '@src/background/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

export const usePrivateKeyImport = () => {
  const [isImporting, setIsImporting] = useState(false);

  const { addAccount } = useAccountsContext();

  const importPrivateKey = useCallback(
    async (privateKey: string) => {
      setIsImporting(true);

      try {
        const accountId = await addAccount('', {
          importType: ImportType.PRIVATE_KEY,
          data: utils.strip0x(privateKey),
        });

        return accountId;
      } catch (err) {
        sentryCaptureException(
          err as Error,
          SentryExceptionTypes.WALLET_IMPORT,
        );
        throw err;
      } finally {
        setIsImporting(false);
      }
    },
    [addAccount],
  );

  return {
    isImporting,
    importPrivateKey,
  };
};
