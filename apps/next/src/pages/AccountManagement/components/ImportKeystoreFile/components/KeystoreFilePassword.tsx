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
import { useCallback, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { LessRoundedPasswordField } from '@/components/StandaloneField/PasswordField/LessRoundedPasswordField';
import {
  Callbacks,
  useImportKeystoreFile,
} from '../hooks/useImportKeystoreFile';
import { useAnalyticsContext } from '@core/ui';
import { useHistory } from 'react-router-dom';

type KeystoreFilePasswordProps = {
  file: File;
  onCancel: () => void;
};

export const KeystoreFilePassword = ({
  file,
  onCancel,
}: KeystoreFilePasswordProps) => {
  const { capture } = useAnalyticsContext();
  const { replace } = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();

  const [unlockError, setUnlockError] = useState<string>();
  const [filePassword, setFilePassword] = useState('');

  const importCallbacks: Callbacks = {
    onFailure: () => {
      capture('KeystoreFileImportFailure');
      setUnlockError(t('Failed to import the keystore file.'));
    },
    onStarted: () => {
      capture('KeystoreFileImportStarted');
    },
    onSuccess: () => {
      capture('KeystoreFileImportSuccess');
      toast.success(t('Successfully imported the keystore file.'));
      replace('/account-management');
    },
  };

  const { importFile, isImporting } = useImportKeystoreFile(importCallbacks);

  const submit = useCallback(async () => {
    if (!filePassword) {
      setUnlockError(t('Please enter a password'));
      return;
    }
    importFile(file, filePassword);
  }, [filePassword, t, file, importFile]);

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
        <Typography color="error.main" variant="subtitle2">
          {/* TODO: need to update to subtitle3 when it is ready in k2-alpine */}
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
