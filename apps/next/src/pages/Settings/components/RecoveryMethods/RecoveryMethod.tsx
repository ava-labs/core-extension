import { Button, Paper, Stack } from '@avalabs/k2-alpine';
import { useSeedlessMfaManager } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { AuthenticatorDetails } from './Authenticator/AuthenticatorDetails';
import { FIDODetails } from './FIDO/FIDODetails';
import { RecoveryMethod as RecoveryMethodType } from '@core/types';
import { useCallback } from 'react';
import { openFullscreenTab } from '@core/common';
import { useHistory } from 'react-router-dom';

interface RecoveryMethodProps {
  method: RecoveryMethodType;
}

export const RecoveryMethod = ({ method }: RecoveryMethodProps) => {
  const { t } = useTranslation();
  const { hasTotpConfigured, hasFidoConfigured, recoveryMethods } =
    useSeedlessMfaManager();
  console.log('recoveryMethods: ', recoveryMethods);
  const history = useHistory();

  const isRemovable =
    recoveryMethods.length > 1 && hasFidoConfigured && hasTotpConfigured;
  const openRemoveTotpPopup = useCallback(async () => {
    openFullscreenTab('update-recovery-method/totp/remove');
  }, []);
  const openAddTotpPopup = useCallback(async () => {
    openFullscreenTab('update-recovery-method/totp/add');
  }, []);

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <Stack>
          {method.type === 'totp' && (
            <AuthenticatorDetails
              method={method}
              methodName={t('Authenticator')}
            />
          )}
          {method.type === 'fido' && <FIDODetails method={method} />}
        </Stack>
      </Paper>
      <Stack sx={{ width: '100%', marginTop: 'auto' }}>
        {method.type === 'totp' && (
          <Button
            variant="contained"
            color="primary"
            size="extension"
            fullWidth
            onClick={() => {
              openAddTotpPopup();
            }}
            disabled={!hasTotpConfigured}
            sx={{ mb: 1.5 }}
          >
            {t('Change Authenticator App')}
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          size="extension"
          fullWidth
          disabled={!isRemovable}
          onClick={() => {
            return method.type === 'totp'
              ? openRemoveTotpPopup()
              : history.push(`/settings/recovery-method/fido/${method.id}`);
          }}
        >
          {t('Remove recovery method')}
        </Button>
      </Stack>
    </>
  );
};
