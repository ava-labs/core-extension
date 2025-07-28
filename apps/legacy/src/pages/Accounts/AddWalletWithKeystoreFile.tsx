import { DragEventHandler, useCallback, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  toast,
  useTheme,
} from '@avalabs/core-k2-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/components/common/PageTitle';
import { KeystoreError, KeystoreFileContentInfo } from '@core/types';
import { useErrorMessage } from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import { useKeyboardShortcuts } from '@core/ui';

import { KeystoreFileError } from './components/KeystoreFileError';
import { KeystoreFileUpload } from './components/KeystoreFileUpload';
import { useKeystoreFileImport } from '@core/ui';
import { KeystoreFileConfirmation } from './components/KeystoreFileConfirmation';

enum Step {
  ChooseFile,
  ProvidePassword,
  ConfirmData,
  Error,
}

const EMPTY_FILE_INFO: KeystoreFileContentInfo = {
  seedPhrasesCount: 0,
  privateKeysCount: 0,
};

export function AddWalletWithKeystoreFile() {
  const theme = useTheme();
  const history = useHistory();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const getTranslatedError = useErrorMessage();

  const [step, setStep] = useState(Step.ChooseFile);
  const [file, setFile] = useState<File | null>(null);
  const [filePassword, setFilePassword] = useState('');
  const [fileInfo, setFileInfo] = useState(EMPTY_FILE_INFO);
  const [error, setError] = useState<KeystoreError | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    getKeyCounts,
    importKeystoreFile,
    isImporting,
    isReading,
    isValidKeystoreFile,
  } = useKeystoreFileImport({
    onStarted: () => {
      capture('KeystoreFileImportStarted');
    },
    onSuccess: () => {
      capture('KeystoreFileImportSuccess');
      toast.success(t('Successfully imported the keystore file.'));
      history.replace('/accounts');
    },
    onFailure: (err: any) => {
      capture('KeystoreFileImportFailure');
      setError(err);
      setStep(Step.Error);
    },
  });

  const { title: errorMessage } = getTranslatedError(error);

  const restart = useCallback(() => {
    setError(null);
    setFile(null);
    setFileInfo(EMPTY_FILE_INFO);
    setFilePassword('');
    setStep(Step.ChooseFile);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const onFileSelected = useCallback(
    async (rawFile: File | null) => {
      if (!rawFile) {
        setError(KeystoreError.InvalidVersion);
        setStep(Step.Error);
        return;
      }

      setFile(rawFile);

      if (await isValidKeystoreFile(rawFile)) {
        setStep(Step.ProvidePassword);
      } else {
        capture('KeystoreFileUnsupported');
        setError(KeystoreError.InvalidVersion);
        setStep(Step.Error);
      }
    },
    [capture, isValidKeystoreFile],
  );

  const handleDrop: DragEventHandler = useCallback(
    async (ev) => {
      const item = ev.dataTransfer.items[0];

      if (!item) {
        return;
      }

      const rawFile = item.getAsFile();
      await onFileSelected(rawFile);
    },
    [onFileSelected],
  );

  const handleImport = useCallback(async () => {
    if (!file || isReading || isImporting) {
      return;
    }

    try {
      capture('KeystoreFileImportStarted');
      await importKeystoreFile(file, filePassword);
      capture('KeystoreFileImportSuccess');

      toast.success(t('Successfully imported the keystore file.'));

      history.replace('/accounts');
    } catch (err: any) {
      capture('KeystoreFileImportFailure');
      setError(err);
      setStep(Step.Error);
    }
  }, [
    capture,
    file,
    filePassword,
    history,
    importKeystoreFile,
    isImporting,
    isReading,
    t,
  ]);

  const readKeystoreFile = useCallback(async () => {
    if (!file || isReading || isImporting) {
      return;
    }

    try {
      const info = await getKeyCounts(file, filePassword);
      setFileInfo(info);
      setStep(Step.ConfirmData);
    } catch (err: any) {
      // For wrong password we only highlight the text field.
      if (err !== KeystoreError.InvalidPassword) {
        setStep(Step.Error);
      }
      setError(err);
      setFileInfo(EMPTY_FILE_INFO);
    }
  }, [file, filePassword, getKeyCounts, isImporting, isReading]);

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: readKeystoreFile,
    Escape: restart,
  });

  return (
    <>
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          background: theme.palette.background.paper,
        }}
      >
        <Stack direction="row" sx={{ mt: 2.5, mb: 0.5, pr: 1 }}>
          <PageTitle onBackClick={() => history.replace('/accounts')}>
            {t('Add Wallet with Keystore File')}
          </PageTitle>
        </Stack>

        {(step === Step.ChooseFile || step === Step.ProvidePassword) && (
          <KeystoreFileUpload
            inputRef={inputRef}
            onDrop={handleDrop}
            onFileSelected={async (ev) => {
              if (ev.target.files?.[0]) {
                await onFileSelected(ev.target.files[0]);
              }
            }}
          />
        )}

        {file && step === Step.ConfirmData && (
          <KeystoreFileConfirmation
            fileName={file.name}
            fileInfo={fileInfo}
            isLoading={isReading || isImporting}
            onConfirm={handleImport}
            onCancel={restart}
          />
        )}

        {error && step === Step.Error && (
          <KeystoreFileError error={error} onTryAgain={restart} />
        )}

        <Dialog
          open={step === Step.ProvidePassword}
          fullWidth
          onClose={restart}
          PaperProps={{
            sx: { m: 2, width: '100%', maxWidth: 'none' },
          }}
        >
          <DialogTitle>{t('Password Required')}</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              {t('Please enter the keystore file password to continue.')}
            </Typography>
            <TextField
              autoFocus
              data-testid="keystore-file-password"
              fullWidth
              label={t('Password')}
              inputLabelProps={{
                sx: {
                  transform: 'none',
                  fontSize: 'body2.fontSize',
                  mb: 1,
                  mt: 4,
                },
              }}
              helperText={
                error === KeystoreError.InvalidPassword
                  ? errorMessage
                  : t(
                      'This password was set when you created the keystore file.',
                    )
              }
              error={error === KeystoreError.InvalidPassword}
              placeholder={t('Input Password')}
              value={filePassword}
              type="password"
              onChange={(ev) => setFilePassword(ev.target.value)}
              {...keyboardHandlers}
            />
          </DialogContent>
          <DialogActions>
            <Button
              key="continue-upload"
              size="large"
              disabled={!filePassword || !file || isReading}
              isLoading={isReading}
              fullWidth
              onClick={readKeystoreFile}
              data-testid="continue-upload"
            >
              {t('Continue Upload')}
            </Button>
            <Button
              key="cancel-upload"
              variant="text"
              size="large"
              fullWidth
              onClick={restart}
              data-testid="back-button"
            >
              {t('Back')}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  );
}
