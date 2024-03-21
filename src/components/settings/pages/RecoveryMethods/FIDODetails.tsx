import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  styled,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AlertCircleIcon,
  KeyIcon,
  TrashIcon,
  toast,
  Tooltip,
} from '@avalabs/k2-components';
import { useCallback, useState } from 'react';

import { Overlay } from '@src/components/common/Overlay';
import { PageTitle } from '@src/components/common/PageTitle';
import { useSeedlessMfa } from '@src/hooks/useSeedlessMfa';
import { useSeedlessMfaManager } from '@src/contexts/SeedlessMfaManagementProvider';
import {
  RecoveryMethodFido,
  SeedlessError,
} from '@src/background/services/seedless/models';

enum State {
  Initial = 'initial',
  Initiated = 'initiated',
  ConfirmRemoval = 'confirm-removal',
  Failure = 'failure',
}

type Props = {
  onBackClick: () => void;
  details: RecoveryMethodFido;
};

export function FIDODetails({ onBackClick, details }: Props) {
  const { t } = useTranslation();
  const { removeFidoDevice, hasTotpConfigured } = useSeedlessMfaManager();
  const { renderMfaPrompt } = useSeedlessMfa();

  const [state, setState] = useState(State.Initial);

  const remove = useCallback(async () => {
    setState(State.Initiated);

    try {
      await removeFidoDevice(details.id);

      toast.success(
        t('{{name}} successfully removed!', {
          name: details.name || t('Method'),
        })
      );

      onBackClick();
    } catch (err) {
      if (err === SeedlessError.NoMfaMethodAvailable) {
        toast.error(
          t(
            'You need an authenticator app configured to remove this MFA method'
          )
        );
        return;
      }

      setState(State.Failure);
    }
  }, [t, details.id, details.name, removeFidoDevice, onBackClick]);

  return (
    <Overlay isBackgroundFilled>
      <Stack sx={{ width: 1, height: 1, pt: 1.5, gap: 2 }}>
        {state === State.Failure && (
          <Stack
            sx={{
              width: 1,
              height: 1,
              px: 3,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <AlertCircleIcon size={72} />
            <Stack sx={{ textAlign: 'center', gap: 0.5 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {t('Something Went Wrong')}
              </Typography>
              <Typography variant="body2">
                {t('We encountered an unexpected issue.')}
              </Typography>
              <Typography variant="body2">{t('Please try again.')}</Typography>
            </Stack>

            <Button
              fullWidth
              onClick={remove}
              data-testid="btn-try-again"
              sx={{ mt: 4 }}
            >
              {t('Try again')}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={onBackClick ?? window.close}
              data-testid="btn-go-back"
            >
              {t('Go Back')}
            </Button>
          </Stack>
        )}
        {(state === State.Initial ||
          state === State.Initiated ||
          state === State.ConfirmRemoval) && (
          <>
            <PageTitle
              onBackClick={onBackClick}
              showBackButton={Boolean(onBackClick)}
            >
              {t('FIDO Device Details')}
            </PageTitle>
            <Stack sx={{ width: 1, gap: 2, flexGrow: 1 }}>
              <Card sx={{ backgroundColor: 'grey.900', mx: 1, px: 2, py: 2 }}>
                <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                  <KeyIcon size={24} sx={{ width: 28 }} />
                  <MethodName>{details.name}</MethodName>
                </Stack>
              </Card>
            </Stack>
            <Stack
              sx={{
                width: 1,
                px: 2,
                py: 3,
              }}
            >
              <Tooltip
                title={
                  hasTotpConfigured
                    ? ''
                    : t(
                        'To remove this recovery method, you first need to configure a TOTP recovery method (i.e. Authenticator app).'
                      )
                }
              >
                <Button
                  variant="text"
                  color="error"
                  size="large"
                  fullWidth
                  startIcon={<TrashIcon />}
                  onClick={() => setState(State.ConfirmRemoval)}
                  disabled={
                    !hasTotpConfigured ||
                    state === State.ConfirmRemoval ||
                    state === State.Initiated
                  }
                  isLoading={
                    state === State.ConfirmRemoval || state === State.Initiated
                  }
                >
                  {t('Remove')}
                </Button>
              </Tooltip>
            </Stack>
            {state === State.Initiated && renderMfaPrompt()}
            <Dialog
              open={state === State.ConfirmRemoval}
              PaperProps={{ sx: { m: 2, textAlign: 'center' } }}
            >
              <DialogTitle>{t('Remove This Method?')}</DialogTitle>
              <DialogContent>
                {t(
                  'You will no longer be able to use this method to verify any operations. You can always re-add it later.'
                )}
              </DialogContent>
              <DialogActions>
                <Button key="remove" size="large" onClick={remove}>
                  {t('Remove')}
                </Button>
                <Button
                  key="cancel"
                  variant="text"
                  onClick={() => setState(State.Initial)}
                >
                  {t('Cancel')}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Stack>
    </Overlay>
  );
}

const MethodName = styled(Typography)`
  ${({ theme }) => ({
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightSemibold,
  })}
`;
