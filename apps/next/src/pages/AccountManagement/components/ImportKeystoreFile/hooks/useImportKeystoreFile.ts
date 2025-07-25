import { useKeystoreFileImport } from '@core/ui';
import { useCallback, useState } from 'react';

export type Callbacks = {
  onStarted?: VoidFunction;
  onSuccess?: VoidFunction;
  onFailure?: VoidFunction;
};

export const useImportKeystoreFile = ({
  onStarted,
  onSuccess,
  onFailure,
}: Callbacks) => {
  const { importKeystoreFile } = useKeystoreFileImport();

  const [isImporting, setIsImporting] = useState(false);

  const importFile = useCallback(
    async (file: File, password: string) => {
      if (isImporting) {
        return;
      }
      setIsImporting(true);
      try {
        onStarted?.();
        await importKeystoreFile(file, password);
        onSuccess?.();
      } catch {
        onFailure?.();
      } finally {
        setIsImporting(false);
      }
    },
    [isImporting, importKeystoreFile, onStarted, onSuccess, onFailure],
  );

  return {
    isImporting,
    importFile,
  };
};
