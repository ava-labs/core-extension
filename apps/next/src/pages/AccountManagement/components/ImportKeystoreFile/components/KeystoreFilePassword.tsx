import { Button, Card, Stack, toast, Typography } from '@avalabs/k2-alpine';
import { FileImage } from './FileImage';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { useKeystoreFileImport } from '@core/ui/src/hooks/useKeystoreFileImport';
import { KeystoreError, KeystoreFileContentInfo } from '@core/types';
import { LessRoundedPasswordField } from '../../ShowPrivateKey/components/EnterPassword';
import { useAnalyticsContext } from '@core/ui';
import { useHistory } from 'react-router-dom';

type KeystoreFilePasswordProps = {
  file: File;
  onCancel: () => void;
  onError: (error: KeystoreError) => void;
};

export const KeystoreFilePassword = ({
  file,
  onError,
}: KeystoreFilePasswordProps) => {
  const { t } = useTranslation();
  const { replace } = useHistory();

  const { getKeyCounts, importKeystoreFile } = useKeystoreFileImport();
  const { capture } = useAnalyticsContext();

  const [filePassword, setFilePassword] = useState('');
  const [fileInfo, setFileInfo] = useState<KeystoreFileContentInfo>();
  const [showInvalidPasswordError, setShowInvalidPasswordError] =
    useState(false);

  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    async function fetchFileInfo() {
      if (!filePassword) {
        return;
      }
      try {
        const fileData = await getKeyCounts(file, filePassword);
        setFileInfo(fileData);
        setShowInvalidPasswordError(false);
      } catch (err: unknown) {
        // For wrong password we only highlight the text field.
        if (err !== KeystoreError.InvalidPassword) {
          onError(KeystoreError.Unknown);
        }

        setShowInvalidPasswordError(true);
        setFileInfo(undefined);
      }
    }
    fetchFileInfo();
  }, [file, filePassword, getKeyCounts, onError]);

  const handleImport = useCallback(async () => {
    if (!fileInfo || isImporting) {
      return;
    }
    setIsImporting(true);
    try {
      capture('KeystoreFileImportStarted');
      await importKeystoreFile(file, filePassword);
      capture('KeystoreFileImportSuccess');

      toast.success(t('Successfully imported the keystore file.'));

      replace('/account-management');
    } catch (err: unknown) {
      capture('KeystoreFileImportFailure');

      const error = Object.values(KeystoreError).includes(err as KeystoreError)
        ? (err as KeystoreError)
        : KeystoreError.Unknown;

      onError(error);
    }
  }, [
    fileInfo,
    isImporting,
    capture,
    importKeystoreFile,
    file,
    filePassword,
    t,
    replace,
    onError,
  ]);

  return (
    <Stack>
      <Card>
        <Stack direction="row">
          <FileImage />

          <Stack>
            <Typography variant="h6" color="text.primary">
              {file.name}
            </Typography>

            {fileInfo && (
              <>
                <Typography variant="body2" color="text.secondary">
                  {t('{{recoveryPhrasesCount}} new recovery phrases', {
                    recoveryPhrasesCount: fileInfo.seedPhrasesCount,
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('{{privateKeyCount}} new private keys', {
                    privateKeyCount: fileInfo.privateKeysCount,
                  })}
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
      </Card>
      <LessRoundedPasswordField
        value={filePassword}
        onChange={(e) => setFilePassword(e.target.value)}
        error={showInvalidPasswordError}
        helperText={showInvalidPasswordError && t('Invalid password')}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={!fileInfo}
        onClick={handleImport}
      >
        {t('Import Keystore file')}
      </Button>
      <Button variant="text" color="secondary" fullWidth>
        {t('Cancel')}
      </Button>
    </Stack>
  );
};
