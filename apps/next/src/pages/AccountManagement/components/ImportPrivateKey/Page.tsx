import { FC } from 'react';
import { ImportPrivateKeyForm } from './components/ImportPrivateKeyForm';
import { Stack, toast } from '@avalabs/k2-alpine';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useImportPrivateKey } from './hooks/useImportPrivateKey';
import { DuplicatedAccountConfirmation } from './components/DuplicatedAccountConfirmation';
import { useAnalyticsContext, useAccountsContext } from '@core/ui';

export const ImportPrivateKey: FC = () => {
  const { t } = useTranslation();
  const { replace } = useHistory();
  const { capture } = useAnalyticsContext();

  const { selectAccount } = useAccountsContext();

  const { isImporting: isImportLoading, importPrivateKey } =
    useImportPrivateKey();

  const [privateKey, setPrivateKey] = useState('');
  const [isDuplicatedAccountDialogOpen, setIsDuplicatedAccountDialogOpen] =
    useState(false);

  const handleImport = useCallback(async () => {
    capture('ImportPrivateKeyClicked');
    try {
      const importedAccountId = await importPrivateKey(privateKey);
      await selectAccount(importedAccountId);
      capture('ImportPrivateKeySucceeded');
      toast.success(t('Private Key Imported'), { duration: 1000 });
      replace(`/account-management`);
    } catch (err) {
      toast.error(t('Private Key Import Failed'), { duration: 1000 });
      console.error(err);
    }
  }, [importPrivateKey, privateKey, selectAccount, t, replace, capture]);

  return (
    <Stack sx={{ height: '100%' }}>
      {isDuplicatedAccountDialogOpen ? (
        <DuplicatedAccountConfirmation
          onImportDuplicate={handleImport}
          onCancel={() => setIsDuplicatedAccountDialogOpen(false)}
        />
      ) : (
        <ImportPrivateKeyForm
          handleImport={handleImport}
          isImportLoading={isImportLoading}
          privateKey={privateKey}
          setPrivateKey={setPrivateKey}
          setIsDuplicatedAccountDialogOpen={setIsDuplicatedAccountDialogOpen}
        />
      )}
    </Stack>
  );
};
