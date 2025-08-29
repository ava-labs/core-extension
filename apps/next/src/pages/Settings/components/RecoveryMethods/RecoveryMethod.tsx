import { Page } from '@/components/Page';
import { Button } from '@avalabs/k2-alpine';
import { useSeedlessMfaManager } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { AuthenticatorDetails } from './Authenticator/AuthenticatorDetails';
import { FIDODetails } from './FIDO/FIDODetails';
import { RecoveryMethod as RecoveryMethodType } from '@core/types';
import { useCallback } from 'react';
import { openFullscreenTab } from '@core/common';

interface RecoveryMethodProps {
  method: RecoveryMethodType;
  onBackClicked: () => void;
}

export const RecoveryMethod = ({
  method,
  onBackClicked,
}: RecoveryMethodProps) => {
  console.log('RecoveryMethod: ', method);
  const { t } = useTranslation();
  const { hasTotpConfigured } = useSeedlessMfaManager();

  const openRemoveTotpPopup = useCallback(async () => {
    openFullscreenTab('remove-totp');
  }, []);

  return (
    <Page
      title={t('Recovery Method Details')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
      onBack={onBackClicked}
    >
      {method.type === 'totp' && (
        <AuthenticatorDetails method={method} methodName={t('Authenticator')} />
      )}
      {method.type === 'fido' && <FIDODetails method={method} />}
      {method.type === 'totp' && (
        <Button
          // ref={submitRef}
          variant="contained"
          color="primary"
          size="extension"
          fullWidth
          // disabled={!isFormValid || isSubmitting}
          // loading={isSubmitting}
          // onClick={isFormValid ? handleSubmit : undefined}
          sx={{ mt: 'auto' }}
          disabled={!hasTotpConfigured}
        >
          {t('Change Authenticator App')}
        </Button>
      )}
      <Button
        // ref={submitRef}
        variant="contained"
        color="primary"
        size="extension"
        fullWidth
        // disabled={!isFormValid || isSubmitting}
        // loading={isSubmitting}
        // onClick={isFormValid ? handleSubmit : undefined}
        sx={{ mt: 'auto' }}
        disabled={!hasTotpConfigured}
        onClick={() => {
          openRemoveTotpPopup();
        }}
      >
        {t('Remove recovery method')}
      </Button>
    </Page>
  );
};
