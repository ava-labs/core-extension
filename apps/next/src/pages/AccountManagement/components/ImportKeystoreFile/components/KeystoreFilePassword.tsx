import { Button, Card, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { FileImage } from './FileImage';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { LessRoundedPasswordField } from '@/components/StandaloneField/PasswordField/LessRoundedPasswordField';
import { useImportKeystoreFile } from '../hooks/useImportKeystoreFile';

type KeystoreFilePasswordProps = {
  file: File;
  onCancel: () => void;
};

export const KeystoreFilePassword = ({
  file,
  onCancel,
}: KeystoreFilePasswordProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { importFile, isImporting } = useImportKeystoreFile();

  const [filePassword, setFilePassword] = useState('');
  const [unlockError, setUnlockError] = useState<string>();

  const errorHandler = useCallback(() => {
    setUnlockError(t('Failed to import the keystore file.'));
  }, [t]);

  const submit = useCallback(async () => {
    if (!filePassword) {
      setUnlockError(t('Please enter a password'));
      return;
    }
    importFile(file, filePassword, errorHandler);
  }, [filePassword, t, file, importFile, errorHandler]);

  return (
    <Stack sx={{ flexGrow: 1, alignItems: 'center' }}>
      <Card sx={{ p: '12px' }}>
        <Stack
          sx={{
            flexDirection: 'row',
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
        sx={{
          mt: '27px',
          mb: '14px',
          columnGap: '8px',
          alignItems: 'center',
          flexDirection: 'row',
        }}
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
        error={!!unlockError}
        helperText={unlockError}
        fullWidth
      />

      <Stack sx={{ mt: 'auto', rowGap: '10px', width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!filePassword || isImporting}
          onClick={submit}
          size="small"
        >
          {t('Import Keystore file')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={onCancel}
          disabled={isImporting}
          size="small"
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};
