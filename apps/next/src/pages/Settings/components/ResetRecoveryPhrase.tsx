import { ForgotPassword } from '@/pages/LockScreen';
import { useAnalyticsContext, useNavigation } from '@core/ui';

export const ResetRecoveryPhrase = () => {
  const { capture, stopDataCollection } = useAnalyticsContext();
  const { goBack } = useNavigation('slide');

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
