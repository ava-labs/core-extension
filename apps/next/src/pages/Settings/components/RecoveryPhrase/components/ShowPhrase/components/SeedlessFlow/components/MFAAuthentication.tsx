import { Page } from '@/components/Page';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@avalabs/k2-alpine';
import { isSeedlessMfaChoiceRequest } from '@core/common';
import {
  ExtensionRequest,
  MfaChoiceRequest,
  MfaRequestData,
  MfaRequestType,
  RecoveryMethod,
} from '@core/types';
import { useConnectionContext } from '@core/ui';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { filter } from 'rxjs';
import { ChooseMfaMethodHandler } from '~/services/seedless/handlers/chooseMfaMethod';
import { StageProps } from '../types';

export const MFAAuthentication: FC<StageProps> = () => {
  const { t } = useTranslation();
  const [mfaChallenge, setMfaChallenge] = useState<MfaRequestData>();
  const [mfaChoice, setMfaChoice] = useState<MfaChoiceRequest>();
  const { events, request, tabId } = useConnectionContext();

  useEffect(() => {
    const eventsSubscription = events()
      .pipe(filter(isSeedlessMfaChoiceRequest))
      .subscribe(async (event) => {
        if (event.value.tabId !== tabId) {
          console.log('mfa choice request', event.value, 'dupson quit');
          return;
        }

        setMfaChoice(event.value);
      });

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, [events, tabId, mfaChallenge]);

  const chooseMfaMethod = useCallback(
    (method: RecoveryMethod) => {
      if (!mfaChoice) {
        return;
      }

      request<ChooseMfaMethodHandler>({
        method: ExtensionRequest.SEEDLESS_CHOOSE_MFA_METHOD,
        params: [
          {
            mfaId: mfaChoice.mfaId,
            chosenMethod: method,
          },
        ],
      });
    },
    [mfaChoice, request],
  );

  return (
    <Page>
      <Dialog
        open={Boolean(mfaChallenge)}
        PaperProps={{ sx: { m: 2, textAlign: 'center' } }}
      >
        {mfaChallenge?.type === MfaRequestType.Totp && (
          <div>TOTP CHALLENGE WILL BE HERE</div>
        )}
        {(mfaChallenge?.type === MfaRequestType.Fido ||
          mfaChallenge?.type === MfaRequestType.FidoRegister) && (
          <>
            <DialogTitle>{t('Waiting for Confirmation')}</DialogTitle>
            <DialogContent>FIDO CHALLENGE WILL BE HERE</DialogContent>
          </>
        )}
      </Dialog>
      {mfaChoice?.availableMethods?.length && (
        <DialogActions sx={{ px: 1 }}>
          {mfaChoice.availableMethods.map((method) => (
            <div key={method.type}>
              {method.type === 'fido' ? method.name : t('Authenticator')}
            </div>
          ))}
        </DialogActions>
      )}
    </Page>
  );
};
