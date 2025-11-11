import { Button, Paper, Stack } from '@avalabs/k2-alpine';
import { useSeedlessMfaManager } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { RecoveryMethod as RecoveryMethodType } from '@core/types';
import { useCallback, useState } from 'react';
import { openFullscreenTab } from '@core/common';
import { useHistory } from 'react-router-dom';
import { ConfirmPage } from './components/ConfirmPage';
import { MethodCard } from './components/MethodCard';
import { getIconForMethod } from './RecoveryMethodCard';

interface RecoveryMethodProps {
  method: RecoveryMethodType;
}

const openRemoveTotpPopup = () =>
  openFullscreenTab('update-recovery-method/totp/remove');

const openAddTotpPopup = () =>
  openFullscreenTab('update-recovery-method/totp/add');

export const RecoveryMethod = ({ method }: RecoveryMethodProps) => {
  const { t } = useTranslation();
  const { hasTotpConfigured, hasFidoConfigured, recoveryMethods } =
    useSeedlessMfaManager();
  const history = useHistory();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isChangeOpen, setIsChangeOpen] = useState(false);

  const isRemovable =
    recoveryMethods.length > 1 && hasFidoConfigured && hasTotpConfigured;

  const onRemoveConfirm = useCallback(() => {
    setIsConfirmOpen(false);
    return method.type === 'totp'
      ? openRemoveTotpPopup()
      : history.push(`/settings/recovery-method/fido/${method.id}`);
  }, [history, method]);

  return (
    <>
      {isConfirmOpen && (
        <ConfirmPage
          title={t('Are you sure you want to remove this recovery method?')}
          onConfirm={onRemoveConfirm}
          onCancel={() => setIsConfirmOpen(false)}
          warning={t(
            'You will no longer be able to use this method once you removed.',
          )}
        />
      )}
      {isChangeOpen && (
        <ConfirmPage
          title={t('Are you sure you want to change the authenticator?')}
          onConfirm={openAddTotpPopup}
          onCancel={() => setIsChangeOpen(false)}
          warning={t(
            'You will no longer be able to use this authenticator once you switch. You will need to re-add an authenticator',
          )}
        />
      )}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          width: '100%',
          backgroundColor: 'surface.primary',
        }}
      >
        <Stack>
          {method.type === 'totp' && (
            <MethodCard
              icon={getIconForMethod(method)}
              title={t('Authenticator')}
              key={method.toString()}
              showChevron={false}
            />
          )}
          {method.type === 'fido' && (
            <MethodCard
              icon={getIconForMethod(method)}
              title={method.name}
              key={method.toString()}
              showChevron={false}
            />
          )}
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
              setIsChangeOpen(true);
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
          onClick={() => setIsConfirmOpen(true)}
        >
          {t('Remove recovery method')}
        </Button>
      </Stack>
    </>
  );
};
