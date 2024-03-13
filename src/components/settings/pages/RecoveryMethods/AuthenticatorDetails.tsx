import { useTranslation } from 'react-i18next';
import {
  Stack,
  Typography,
  QRCodeIcon,
  styled,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@avalabs/k2-components';
import { useState } from 'react';

import { Overlay } from '@src/components/common/Overlay';
import { PageTitle } from '@src/components/common/PageTitle';

enum State {
  Initial = 'initial',
  ConfirmChange = 'confirm-change',
}

export function AuthenticatorDetails({ onBackClick }) {
  const { t } = useTranslation();

  const [state, setState] = useState(State.Initial);

  return (
    <Overlay isBackgroundFilled>
      <Stack sx={{ width: 1, height: 1, pt: 1.5, gap: 2 }}>
        {(state === State.Initial || state === State.ConfirmChange) && (
          <>
            <PageTitle onBackClick={onBackClick}>
              {t('Authenticator App')}
            </PageTitle>
            <Stack sx={{ width: 1, gap: 2, flexGrow: 1 }}>
              <Card
                sx={{
                  backgroundColor: 'background.paper',
                  mx: 1,
                  px: 2,
                  py: 2,
                }}
              >
                <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                  <QRCodeIcon size={24} sx={{ width: 28 }} />
                  <MethodName>{t('Authenticator')}</MethodName>
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
              <Button
                color="secondary"
                size="large"
                onClick={() => setState(State.ConfirmChange)}
              >
                {t('Change Authenticator App')}
              </Button>
            </Stack>
            <Dialog
              open={state === State.ConfirmChange}
              PaperProps={{ sx: { m: 2, textAlign: 'center' } }}
            >
              <DialogTitle>{t('Change Authenticator?')}</DialogTitle>
              <DialogContent>
                {t(
                  'You will no longer be able to use this authenticator once you switch. You can always re-add an authenticator app.'
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  size="large"
                  key="change"
                  disabled // TODO: implement change flow
                >
                  {t('Change')}
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
