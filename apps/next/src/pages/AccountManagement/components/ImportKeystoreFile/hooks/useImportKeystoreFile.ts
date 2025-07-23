import { toast } from '@avalabs/k2-alpine';
import { useAnalyticsContext, useKeystoreFileImport } from '@core/ui';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const useImportKeystoreFile = () => {
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const { replace } = useHistory();
  const { importKeystoreFile } = useKeystoreFileImport();

  const [isImporting, setIsImporting] = useState(false);

  const importFile = useCallback(
    async (file: File, password: string, onError: (error: unknown) => void) => {
      if (isImporting) {
        return;
      }
      setIsImporting(true);
      try {
        capture('KeystoreFileImportStarted');
        await importKeystoreFile(file, password);

        capture('KeystoreFileImportSuccess');
        toast.success(t('Successfully imported the keystore file.'));
        replace('/account-management');
      } catch (err: unknown) {
        capture('KeystoreFileImportFailure');
        onError(err);
      } finally {
        setIsImporting(false);
      }
    },
    [isImporting, capture, importKeystoreFile, replace, t],
  );

  return {
    isImporting,
    importFile,
  };
};
