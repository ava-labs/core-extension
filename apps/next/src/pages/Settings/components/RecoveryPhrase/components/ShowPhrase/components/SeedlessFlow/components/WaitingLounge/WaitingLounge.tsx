import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { StageProps } from '../../types';
import { CancellationScreen } from './components/CancellationScreen';
import { Container } from './components/Container';
import { CountDown } from './components/CountDown';

export const WaitingLounge: FC<StageProps> = ({
  fullscreen,
  cancelExport,
  progress,
  timeLeft,
}) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  return (
    <Container
      fullscreen={fullscreen}
      title={
        showCancelConfirmation
          ? t('Are you sure that you want to cancel this request?')
          : t('Show recovery phrase')
      }
    >
      {showCancelConfirmation ? (
        <CancellationScreen
          onApprove={() => {
            cancelExport();
            push('/settings');
          }}
          onCancel={() => {
            setShowCancelConfirmation(false);
          }}
        />
      ) : (
        <CountDown
          progress={progress}
          timeLeft={timeLeft}
          onCancel={() => {
            setShowCancelConfirmation(true);
          }}
        />
      )}
    </Container>
  );
};
