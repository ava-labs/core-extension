import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/components/Page';
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
    <Page
      title={t('Upload keystore file')}
      withBackButton
      containerProps={{
        mt: 3,
      }}
      contentProps={{ alignItems: 'stretch', justifyContent: 'flex-start' }}
    >
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
    </Page>
  );
};
