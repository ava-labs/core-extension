import { FC, useCallback, useState } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { KeystoreError } from '@core/types';
import { KeystoreFileUpload } from './components/KeystoreFileUpload';
import { KeystoreFilePassword } from './components/KeystoreFilePassword';
import { KeystoreFileError } from './components/KeystoreFileError';

type Step = 'ChooseFile' | 'ProvidePassword' | 'ConfirmData' | 'Error';

export const ImportKeystoreFile: FC = () => {
  const { t } = useTranslation();

  const [step, setStep] = useState<Step>('ChooseFile');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<KeystoreError | null>(null);

  const reset = useCallback(() => {
    setError(null);
    setFile(null);
    setStep('ChooseFile');
  }, []);

  const onNextForUpload = useCallback(async () => {
    if (!file) {
      setError(KeystoreError.InvalidVersion);
      setStep('Error');
      return;
    }

    setStep('ProvidePassword');
  }, [file]);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Stack direction="row" mt={2.5} mb={3} pr={1}>
        <Typography variant="h2">{t('Upload keystore file')}</Typography>
      </Stack>
      {step === 'ChooseFile' && (
        <KeystoreFileUpload
          file={file}
          setFile={setFile}
          onSubmit={onNextForUpload}
          onError={(newError) => {
            setError(newError);
            setStep('Error');
            setFile(null);
          }}
        />
      )}
      {step === 'ProvidePassword' && file && (
        <KeystoreFilePassword file={file} onCancel={reset} />
      )}
      {step === 'Error' && error && (
        <KeystoreFileError error={error} onTryAgain={reset} />
      )}
    </Stack>
  );
};
