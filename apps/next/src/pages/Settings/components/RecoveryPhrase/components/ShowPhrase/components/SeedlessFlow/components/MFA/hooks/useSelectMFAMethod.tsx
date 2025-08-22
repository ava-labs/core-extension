import {
  ExtensionRequest,
  MfaChoiceRequest,
  RecoveryMethod,
} from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useCallback, useRef } from 'react';
import { ChooseMfaMethodHandler } from '~/services/seedless/handlers/chooseMfaMethod';

export const useSelectMFAMethod = (
  choice: MfaChoiceRequest | undefined,
  onSelect: (method: RecoveryMethod) => void,
) => {
  const { request } = useConnectionContext();

  const params = { choice, onSelect };
  const paramsRef = useRef(params);
  paramsRef.current = params;

  return useCallback(
    (method: RecoveryMethod) => {
      if (!paramsRef.current.choice) {
        return;
      }

      paramsRef.current.onSelect(method);

      request<ChooseMfaMethodHandler>({
        method: ExtensionRequest.SEEDLESS_CHOOSE_MFA_METHOD,
        params: [
          {
            mfaId: paramsRef.current.choice.mfaId,
            chosenMethod: method,
          },
        ],
      });
    },
    [request],
  );
};
