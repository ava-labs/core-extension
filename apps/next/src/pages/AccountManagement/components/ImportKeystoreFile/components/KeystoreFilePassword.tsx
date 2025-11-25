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
import { useCallback, useMemo, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { LessRoundedPasswordField } from '@/components/StandaloneField/PasswordField/LessRoundedPasswordField';

import {
  KeystoreFileImportCallbacks,
  useAnalyticsContext,
  useKeystoreFileImport,
} from '@core/ui';
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
  const { go } = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();

  const [unlockError, setUnlockError] = useState<string>();
  const [filePassword, setFilePassword] = useState('');

  const importCallbacks: KeystoreFileImportCallbacks = useMemo(
    () => ({
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
        // Go back 2 steps: skip import page and add-wallet page
        go(-2);
      },
    }),
    [capture, go, t],
  );

  const { importKeystoreFile, isImporting } =
    useKeystoreFileImport(importCallbacks);

  const submit = useCallback(async () => {
    if (!filePassword) {
      setUnlockError(t('Please enter a password'));
      return;
    }
    importKeystoreFile(file, filePassword);
  }, [filePassword, t, file, importKeystoreFile]);

  return (
    <Stack sx={{ flexGrow: 1, alignItems: 'center' }}>
      <Card sx={{ p: '12px' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          columnGap={1.25}
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
        <Typography color="error.main" variant="subtitle3">
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
