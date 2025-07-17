import { FC, useCallback, useState } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { KeystoreError } from '@core/types';
import { useAnalyticsContext, useKeystoreFileImport } from '@core/ui';
import { KeystoreFileUpload } from './components/KeystoreFileUpload';
import { KeystoreFilePassword } from './components/KeystoreFilePassword';

enum Step {
  ChooseFile,
  ProvidePassword,
  ConfirmData,
  Error,
}

export const ImportKeystoreFile: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  // const getTranslatedError = useErrorMessage();

  const [step, setStep] = useState(Step.ChooseFile);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<KeystoreError | null>(null);
  const { isValidKeystoreFile } = useKeystoreFileImport();
  console.log(error); //TODO remove this

  // const { title: errorMessage } = getTranslatedError(error);

  // const restart = useCallback(() => {
  //   setError(null);
  //   setFile(null);
  //   setFileInfo(EMPTY_FILE_INFO);
  //   setFilePassword('');
  //   setStep(Step.ChooseFile);

  //   if (inputRef.current) {
  //     inputRef.current.value = '';
  //   }
  // }, []);

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

  // const handleImport = useCallback(async () => {
  //   if (!file || isReading || isImporting) {
  //     return;
  //   }

  //   try {
  //     capture('KeystoreFileImportStarted');
  //     await importKeystoreFile(file, filePassword);
  //     capture('KeystoreFileImportSuccess');

  //     toast.success(t('Successfully imported the keystore file.'));

  //     history.replace('/accounts');
  //   } catch (err: any) {
  //     capture('KeystoreFileImportFailure');
  //     setError(err);
  //     setStep(Step.Error);
  //   }
  // }, [
  //   capture,
  //   file,
  //   filePassword,
  //   history,
  //   importKeystoreFile,
  //   isImporting,
  //   isReading,
  //   t,
  // ]);

  // const readKeystoreFile = useCallback(async () => {
  //   if (!file || isReading || isImporting) {
  //     return;
  //   }

  //   try {
  //     const info = await getKeyCounts(file, filePassword);
  //     setFileInfo(info);
  //     setStep(Step.ConfirmData);
  //   } catch (err: any) {
  //     // For wrong password we only highlight the text field.
  //     if (err !== KeystoreError.InvalidPassword) {
  //       setStep(Step.Error);
  //     }
  //     setError(err);
  //     setFileInfo(EMPTY_FILE_INFO);
  //   }
  // }, [file, filePassword, getKeyCounts, isImporting, isReading]);

  // const keyboardHandlers = useKeyboardShortcuts({
  //   Enter: readKeystoreFile,
  //   Escape: restart,
  // });

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Stack direction="row" sx={{ mt: 2.5, mb: 0.5, pr: 1 }}>
        <Typography>{t('Upload Keystore File')}</Typography>
      </Stack>
      {step === Step.ChooseFile && (
        <KeystoreFileUpload
          file={file}
          setFile={setFile}
          onSubmit={async (newFile) => {
            await onFileSelected(newFile);
          }}
          onError={(newError) => {
            setError(newError);
            setStep(Step.Error);
          }}
        />
      )}
      {step === Step.ProvidePassword && file && (
        <KeystoreFilePassword
          file={file}
          onCancel={() => setStep(Step.ChooseFile)}
          onError={(newError) => {
            setError(newError);
            setStep(Step.Error);
          }}
        />
      )}
    </Stack>
  );
};
