import {
  Button,
  Card,
  Stack,
  toast,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { FileImage } from './FileImage';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { useKeystoreFileImport } from '@core/ui/src/hooks/useKeystoreFileImport';
import { KeystoreError, KeystoreFileContentInfo } from '@core/types';
import { LessRoundedPasswordField } from '../../ShowPrivateKey/components/EnterPassword';
import { useAnalyticsContext, useErrorMessage } from '@core/ui';
import { useHistory } from 'react-router-dom';
import { MdErrorOutline } from 'react-icons/md';
type KeystoreFilePasswordProps = {
  error?: KeystoreError;
  file: File;
  onCancel: () => void;
  onError: (error: KeystoreError) => void;
};

export const KeystoreFilePassword = ({
  error,
  file,
  onError,
  onCancel,
}: KeystoreFilePasswordProps) => {
  const { t } = useTranslation();
  const { replace } = useHistory();
  const theme = useTheme();

  const getTranslatedError = useErrorMessage();
  const { title: errorTitle } = getTranslatedError(error);

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

      const newError = Object.values(KeystoreError).includes(
        err as KeystoreError,
      )
        ? (err as KeystoreError)
        : KeystoreError.Unknown;

      onError(newError);
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
    <Stack sx={{ flexGrow: 1 }}>
      <Card sx={{ p: '12px' }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            columnGap: '11px',
          }}
        >
          <FileImage />

          <Stack>
            <Typography variant="h6" color="text.primary">
              {file.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t('{{recoveryPhrasesCount}} new recovery phrases', {
                recoveryPhrasesCount: fileInfo
                  ? fileInfo.seedPhrasesCount
                  : '-',
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('{{privateKeyCount}} new private keys', {
                privateKeyCount: fileInfo ? fileInfo.privateKeysCount : '-',
              })}
            </Typography>
          </Stack>

          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={onCancel}
          >
            {t('Delete')}
          </Button>
        </Stack>
      </Card>

      <Stack
        direction="row"
        sx={{ mt: '27px', mb: '14px', columnGap: '8px', alignItems: 'center' }}
      >
        <MdErrorOutline size={40} style={{ color: theme.palette.error.main }} />
        <Typography
          color="error.main"
          sx={{ '&.MuiTypography-root': { fontSize: '12px', fontWeight: 500 } }}
        >
          {t(
            'This file requires a password. This password was set when the file was created.',
          )}
        </Typography>
      </Stack>
      <LessRoundedPasswordField
        value={filePassword}
        onChange={(e) => setFilePassword(e.target.value)}
        error={showInvalidPasswordError}
        helperText={
          showInvalidPasswordError && (errorTitle ?? t('Invalid password'))
        }
      />

      <Stack sx={{ mt: 'auto', rowGap: '10px' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!fileInfo}
          onClick={handleImport}
        >
          {t('Import Keystore file')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={onCancel}
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};
