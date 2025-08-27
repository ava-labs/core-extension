import { Page } from '@/components/Page';
import { Button } from '@avalabs/k2-alpine';
import { useSeedlessMfaManager } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { AuthenticatorDetails } from './Authenticator/AuthenticatorDetails';
import { FIDODetails } from './FIDO/FIDODetails';

export const RecoveryMethod = ({ method }) => {
  console.log('RecoveryMethod: ', method);
  const { t } = useTranslation();
  const { hasTotpConfigured } = useSeedlessMfaManager();
  return (
    <Page
      title={t('Recovery Method Details')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      {method.type === 'totp' && <AuthenticatorDetails method={method} />}
      {method.type === 'fido' && <FIDODetails method={method} />}
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
        {t('Remove recovery method')}
      </Button>
    </Page>
  );
};
