import { FC, useCallback, useState } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { KeystoreError } from '@core/types';
import { useAnalyticsContext, useKeystoreFileImport } from '@core/ui';
import { KeystoreFileUpload } from './components/KeystoreFileUpload';
import { KeystoreFilePassword } from './components/KeystoreFilePassword';
import { KeystoreFileError } from './components/KeystoreFileError';

enum Step {
  ChooseFile,
  ProvidePassword,
  ConfirmData,
  Error,
}

export const ImportKeystoreFile: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const [step, setStep] = useState(Step.ChooseFile);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<KeystoreError | null>(null);
  const { isValidKeystoreFile } = useKeystoreFileImport();

  const reset = useCallback(() => {
    setError(null);
    setFile(null);
    setStep(Step.ChooseFile);
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

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Stack direction="row" sx={{ mt: 2.5, mb: '25px', pr: 1 }}>
        <Typography
          sx={{ '&.MuiTypography-root': { fontSize: '27px', fontWeight: 700 } }}
        >
          {t('Upload Keystore File')}
        </Typography>
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
          onCancel={() => reset()}
          onError={(newError) => {
            setError(newError);
            setStep(Step.Error);
          }}
        />
      )}
      {step === Step.Error && error && (
        <KeystoreFileError error={error} onTryAgain={() => reset()} />
      )}
    </Stack>
  );
};
