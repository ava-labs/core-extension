import { ForgotPassword } from '@/pages/LockScreen';
import { useAnalyticsContext } from '@core/ui';
import { useHistory } from 'react-router-dom';

export const ResetRecoveryPhrase = () => {
  const { capture, stopDataCollection } = useAnalyticsContext();
  const { goBack } = useHistory();

  return (
    <ForgotPassword
      open
      onCancel={() => {
        capture('RecoveryPhraseResetDeclined');
        goBack();
      }}
      onConfirm={async () => {
        await capture('RecoveryPhraseResetApproved');
        await stopDataCollection();
        goBack();
      }}
    />
  );
};
