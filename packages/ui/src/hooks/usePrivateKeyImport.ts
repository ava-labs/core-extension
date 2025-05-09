import { useCallback, useState } from 'react';
import { utils } from '@avalabs/avalanchejs';

import { Monitoring } from '@core/common';
import { ImportType } from '@core/types';
import { useAccountsContext } from '../contexts';

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
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.WALLET_IMPORT,
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
