import { useSeedlessMfaManager, useAnalyticsContext } from '@core/ui';
import { useCallback, useState } from 'react';
import { MFA } from '../../RecoveryPhrase/components/ShowPhrase/components/SeedlessFlow/pages/MFA';
import { Stack, toast, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { SeedlessNameFidoKey } from '@/pages/Onboarding/flows/SeedlessFlow/screens';
import { KeyType } from '@core/types';
import { useHistory } from 'react-router-dom';

export enum AddFIDOState {
  Initial = 'initial',
  Initiated = 'initiated',
  Failure = 'failure',
}

export const AddFIDO = ({ keyType }: { keyType: KeyType }) => {
  const { t } = useTranslation();
  const { addFidoDevice } = useSeedlessMfaManager();
  const { capture } = useAnalyticsContext();
  const history = useHistory();

  const [screenState, setScreenState] = useState<AddFIDOState>(
    AddFIDOState.Initial,
  );

  const registerFidoKey = useCallback(
    async (deviceName: string) => {
      capture('ConfigureFidoClicked', { keyType });
      try {
        await addFidoDevice(deviceName, keyType);
        capture('RecoveryMethodAdded', { method: 'fido', keyType });
        toast.success(t(`${deviceName} (${keyType}) added!`), {
          duration: Infinity,
        });
        history.push('/update-recovery-method');
        return;
      } catch {
        setScreenState(AddFIDOState.Failure);
      }
    },
    [addFidoDevice, history, keyType, t, capture],
  );

  return (
    <Stack sx={{ height: '100%' }}>
      {screenState === AddFIDOState.Initial && (
        <SeedlessNameFidoKey
          required
          keyType={keyType}
          onNext={(deviceName) => {
            setScreenState(AddFIDOState.Initiated);
            registerFidoKey(deviceName);
          }}
        />
      )}
      {screenState === AddFIDOState.Initiated && <MFA />}

      {screenState === AddFIDOState.Failure && (
        <Stack>
          <Typography variant="body1" color="error">
            {t('Error occurred. Please try again.')}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
