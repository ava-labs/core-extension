import {
  ExtensionRequest,
  MfaChoiceRequest,
  RecoveryMethod,
} from '@core/types';
import { useConnectionContext } from '@core/ui';
import { useCallback, useRef } from 'react';
import { ChooseMfaMethodHandler } from '~/services/seedless/handlers/chooseMfaMethod';

export const useSelectMFAMethod = (
  ...params: [
    choice: MfaChoiceRequest | undefined,
    onSelect: (method: RecoveryMethod) => void,
  ]
) => {
  const { request } = useConnectionContext();

  const paramsRef = useRef(params);
  paramsRef.current = params;

  return useCallback(
    (method: RecoveryMethod) => {
      const [choice, onSelect] = paramsRef.current;
      if (!choice) {
        return;
      }

      onSelect(method);

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
};
