import { FullscreenModal } from '@/components/FullscreenModal';
import {
  AuthErrorCode,
  ExtensionRequest,
  MfaRequestType,
  RecoveryMethod,
} from '@core/types';
import { useConnectionContext } from '@core/ui';
import { FC, useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ChooseMfaMethodHandler } from '~/services/seedless/handlers/chooseMfaMethod';
import { StageProps } from '../../types';
import { FIDOChallenge } from './components/FIDOChallenge';
import { MfaChoicePrompt } from './components/MfaChoicePrompt';
import { TOTPChallenge } from './components/TOTPChallenge';
import { useMFAChoice } from './hooks/useMFAChoice';
import { useMFAEvents } from './hooks/useMFAEvent';

export const MFA: FC<StageProps> = () => {
  const [error, setError] = useState<AuthErrorCode>();
  const mfaChoice = useMFAChoice();
  const mfaChallenge = useMFAEvents(setError);
  const { request } = useConnectionContext();
  const history = useHistory();
  const [showChoicePrompt, setShowChoicePrompt] = useState(true);

  const mfaChoiceRef = useRef(mfaChoice);
  mfaChoiceRef.current = mfaChoice;
  const chooseMfaMethod = useCallback(
    (method: RecoveryMethod) => {
      const choice = mfaChoiceRef.current.choice;
      if (!choice) {
        return;
      }

      setShowChoicePrompt(false);
      request<ChooseMfaMethodHandler>({
        method: ExtensionRequest.SEEDLESS_CHOOSE_MFA_METHOD,
        params: [
          {
            mfaId: choice.mfaId,
            chosenMethod: method,
          },
        ],
      });
    },
    [request],
  );

  const onBackHandler = mfaChallenge.challenge
    ? () => {
        mfaChallenge.clear();
        setShowChoicePrompt(true);
      }
    : history.goBack;

  console.log({
    mfaChoice,
    mfaChallenge,
    showChoicePrompt,
    error,
  });

  return (
    <FullscreenModal open withCoreLogo withAppInfo onBack={onBackHandler}>
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
          name={mfaChallenge.challenge.options}
          onError={setError}
          error={error}
        />
      )}

      {showChoicePrompt && mfaChoice.choice && (
        <MfaChoicePrompt
          mfaChoice={mfaChoice.choice}
          onChosen={chooseMfaMethod}
        />
      )}
    </FullscreenModal>
  );
};
