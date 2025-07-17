import { utils } from '@avalabs/avalanchejs';
import { Monitoring } from '@core/common';
import { ImportType } from '@core/types';
import { useAccountsContext } from '@core/ui';
import { useCallback, useState } from 'react';

export const useImportPrivateKey = () => {
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
      } catch (err: unknown) {
        if (!(err instanceof Error)) {
          throw new Error('Failed to import private key');
        }

        Monitoring.sentryCaptureException(
          err,
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
