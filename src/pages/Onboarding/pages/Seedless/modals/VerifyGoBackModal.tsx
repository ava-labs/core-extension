import {
  useTheme,
  Stack,
  Typography,
  Button,
  XIcon,
  AlertCircleIcon,
} from '@avalabs/core-k2-components';
import { Overlay } from '@src/components/common/Overlay';
import { useTranslation } from 'react-i18next';

interface VerifyGoBackModalProps {
  onBack: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function VerifyGoBackModal({
  onBack,
  onCancel,
  isOpen,
}: VerifyGoBackModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }
  return (
    <Overlay>
      <Stack
        sx={{
          width: '512px',
          minHeight: '407px',
          background: theme.palette.background.paper,
          borderRadius: 1,
          p: 1,
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              pt: 3,
              px: 4,
            }}
            data-testid={`authenticator-modal-header`}
          >
            {t('Are You Sure You Want To Go Back?')}
          </Typography>
          <Button
            variant="text"
            data-testid={`authenticator-modal-close-button`}
            onClick={onCancel}
            sx={{
              p: 0,
              height: theme.spacing(3),
              width: theme.spacing(3),
              minWidth: theme.spacing(3),
            }}
          >
            <XIcon size={24} sx={{ color: 'primary.main' }} />
          </Button>
        </Stack>
        <Stack
          sx={{
            flexGrow: 1,
            pt: 1,
            px: 4,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t(
              'Going back will take you to the beginning of the onboarding flow. You will need to re-verify the MFA you just set up before continuing with account creation.'
            )}
          </Typography>
          <Stack
            sx={{
              alignItems: 'center',
              height: '100%',
              justifyContent: 'center',
              flexGrow: 1,
            }}
          >
            <AlertCircleIcon size={80} />
          </Stack>
        </Stack>

        <Stack
          sx={{
            flexDirection: 'row',
            columnGap: 2,
            justifyContent: 'flex-end',
            p: 2,
          }}
        >
          <Button
            color="secondary"
            data-testid="authenticator-modal-cancel"
            onClick={onCancel}
          >
            {t('Cancel')}
          </Button>
          <Button data-testid="authenticator-modal-next" onClick={onBack}>
            {t('Go Back')}
          </Button>
        </Stack>
      </Stack>
    </Overlay>
  );
}
