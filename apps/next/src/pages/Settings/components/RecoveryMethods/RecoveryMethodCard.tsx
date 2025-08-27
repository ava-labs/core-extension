import { CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import { Button } from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { useTranslation } from 'react-i18next';

export const RecoveryMethodCard = ({ method, onClick, methodName }) => {
  console.log('method: ', method);
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  return (
    <>
      <CardMenuItem
        onClick={onClick}
        // icon={method.icon}
        text={methodName || method.name}
        description={`${t('Added ')} ${new Date(method.last_used_at)}`}
        key={method}
      />
      {/* <Button
        // ref={submitRef}
        variant="contained"
        color="primary"
        size="extension"
        fullWidth
        // disabled={!isFormValid || isSubmitting}
        // loading={isSubmitting}
        // onClick={isFormValid ? handleSubmit : undefined}
        sx={{ mt: 'auto' }}
      >
        {t('Remove')}
      </Button> */}
    </>
    // <Paper
    //   key={index}
    //   elevation={1}
    //   sx={{
    //     padding: 2,
    //     marginBottom: 2,
    //     borderRadius: 2,
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //   }}
    // >
    //   <div>
    //     <Typography variant="h6">
    //       {method.type === 'totp' && t('Authenticator App')}
    //       {method.type === 'fido' && t('Security Key')}
    //       {method.type === 'passkey' && t('Passkey')}
    //     </Typography>
    //     <Typography variant="body2" color="text.secondary">
    //       {t('Added on')} {new Date(method.addedAt).toLocaleDateString()}
    //     </Typography>
    //   </div>
    //   <div>
    //     <Button
    //       variant="outlined"
    //       color="error"
    //       onClick={() => {
    //         // Handle removal of recovery method
    //       }}
    //     >
    //       {t('Remove')}
    //     </Button>
    //   </div>
    // </Paper>
  );
};
