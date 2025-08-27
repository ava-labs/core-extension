import { FullscreenModal } from '@/components/FullscreenModal';
import { AuthErrorCode, MfaRequestType } from '@core/types';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InProgress } from '../../../InProgress';
import { StageProps } from '../../types';
import { FIDOChallenge } from './components/FIDOChallenge';
import { MfaChoicePrompt } from './components/MfaChoicePrompt';
import { TOTPChallenge } from './components/TOTPChallenge';
import { useMFAChoice } from './hooks/useMFAChoice';
import { useMFAEvents } from './hooks/useMFAEvent';
import { useSelectMFAMethod } from './hooks/useSelectMFAMethod';

export const MFA: FC<StageProps> = () => {
  const [error, setError] = useState<AuthErrorCode>();
  const mfaChoice = useMFAChoice();
  const mfaChallenge = useMFAEvents(setError);
  const [showChoicePrompt, setShowChoicePrompt] = useState(true);
  const [mfaDeviceName, setMfaDeviceName] = useState('');
  const { t } = useTranslation();

  const selectMfaMethod = useSelectMFAMethod(mfaChoice.choice, (method) => {
    setShowChoicePrompt(false);
    if (method.type === MfaRequestType.Fido) {
      setMfaDeviceName(method.name);
    }
  });

  return (
    <FullscreenModal open withCoreLogo withAppInfo>
      {mfaChallenge.challenge?.type === MfaRequestType.Totp && (
        <TOTPChallenge
          error={error}
          challenge={mfaChallenge.challenge}
          onError={setError}
        />
      )}
      {(mfaChallenge.challenge?.type === MfaRequestType.Fido ||
        mfaChallenge.challenge?.type === MfaRequestType.FidoRegister) && (
        <FIDOChallenge
          challenge={mfaChallenge.challenge}
          name={mfaDeviceName}
          onError={setError}
          error={error}
        />
      )}

      {!mfaChoice.choice && (
        <InProgress textSize="body1">
          {t('Fetching available authentication methods...')}
        </InProgress>
      )}

      {showChoicePrompt && mfaChoice.choice && (
        <MfaChoicePrompt
          mfaChoice={mfaChoice.choice}
          onChosen={selectMfaMethod}
        />
      )}
    </FullscreenModal>
  );
};
