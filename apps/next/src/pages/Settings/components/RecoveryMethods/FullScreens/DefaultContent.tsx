import {
  FullscreenModalActions,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import {
  Button,
  PasswordIcon,
  SecurityKeyIcon,
  Stack,
} from '@avalabs/k2-alpine';
import { useSeedlessMfaManager } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const DefaultContent = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { hasTotpConfigured, isLoadingRecoveryMethods } =
    useSeedlessMfaManager();
  return (
    <>
      <FullscreenModalTitle>
        {t('Update your recovery methods')}
      </FullscreenModalTitle>
      <Stack
        sx={{
          height: '100%',
          justifyContent: 'flex-end',
        }}
      >
        <FullscreenModalActions>
          {!isLoadingRecoveryMethods && !hasTotpConfigured && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                history.push('/update-recovery-method/totp/add');
              }}
              startIcon={<SecurityKeyIcon size={24} />}
            >
              {t('Add Authenticator')}
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push('/update-recovery-method/fido/add/yubikey');
            }}
            startIcon={<SecurityKeyIcon size={24} />}
          >
            {t('Add Yubikey')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.push('/update-recovery-method/fido/add/passkey');
            }}
            startIcon={<PasswordIcon size={24} />}
          >
            {t('Add Passkey')}
          </Button>
        </FullscreenModalActions>
      </Stack>
    </>
  );
};
