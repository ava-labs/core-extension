import { toast } from '@avalabs/k2-alpine';
import { ExportState, useAnalyticsContext } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { StageProps } from '../../types';
import { OmniViewPage } from '../OmniViewPage';
import { CancellationScreen } from './components/CancellationScreen';
import { CountDown } from './components/CountDown';

export const WaitingLounge: FC<StageProps> = ({
  fullscreen,
  cancelExport,
  progress,
  timeLeft,
  state,
}) => {
  const { t } = useTranslation();
  const { replace } = useHistory();
  const { capture } = useAnalyticsContext();

  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const showCountDown =
    !showCancelConfirmation &&
    (state === ExportState.Pending || state === ExportState.Cancelling);

  return (
    <OmniViewPage
      fullscreen={fullscreen}
      title={
        showCancelConfirmation ? t('Cancel Export') : t('Show recovery phrase')
      }
      description={
        showCancelConfirmation
          ? t('Are you sure that you want to cancel this request?')
          : undefined
      }
    >
      {showCancelConfirmation && state === ExportState.Pending && (
        <CancellationScreen
          onApprove={async () => {
            capture('RecoveryPhraseResetApproved');
            setShowCancelConfirmation(false);
            await cancelExport();
            toast.error(t('Export Cancelled'));
            if (fullscreen) {
              window.close();
            } else {
              replace('/settings');
            }
          }}
          onCancel={() => {
            capture('RecoveryPhraseResetDeclined');
            setShowCancelConfirmation(false);
          }}
        />
      )}
      {showCountDown && (
        <CountDown
          state={state}
          progress={progress}
          timeLeft={timeLeft}
          fullScreen={fullscreen}
          onCancel={() => {
            capture('RecoveryPhraseResetClicked');
            setShowCancelConfirmation(true);
          }}
        />
      )}
    </OmniViewPage>
  );
};
