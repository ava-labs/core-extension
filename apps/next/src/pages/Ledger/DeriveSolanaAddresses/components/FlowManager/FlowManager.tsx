import { PromptSolana, Troubleshooting } from '@/components/ConnectLedger';
import { PublicKey } from '@/components/ConnectLedger/LedgerConnector/types';
import { toast } from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ENABLE_SOLANA_LOGGER_KEY_BASE } from '../../config';
import {
  ActivationPhase,
  ConnectPhase,
  ErrorState,
  SuccessPhase,
} from './components';

type Phase =
  | 'prompt'
  | 'connect'
  | 'activation'
  | 'troubleshooting'
  | 'success';

type Props = {
  walletId: string;
  onCloseApp: () => void;
};

export const FlowManager: FC<Props> = ({ walletId, onCloseApp }) => {
  const { capture } = useAnalyticsContext();
  const [phase, setPhase] = useState<Phase>('prompt');
  const [keys, setKeys] = useState<PublicKey[]>([]);
  const { t } = useTranslation();

  if (phase === 'prompt') {
    return (
      <PromptSolana
        onNext={() => {
          capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}SupportConfirmed`);
          setPhase('connect');
        }}
        onSkip={() => {
          capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}SupportDenied`);
          onCloseApp();
        }}
      />
    );
  }

  if (phase === 'connect') {
    return (
      <ConnectPhase
        onNext={({ addressPublicKeys }) => {
          setKeys(addressPublicKeys);
          setPhase('activation');
        }}
        onTroubleshoot={() => {
          capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}Troubleshooting`);
          setPhase('troubleshooting');
        }}
      />
    );
  }

  if (phase === 'troubleshooting') {
    return (
      <Troubleshooting
        appName="Solana"
        onClose={() => {
          capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}TroubleshootingClosed`);
          setPhase('connect');
        }}
      />
    );
  }

  if (phase === 'activation') {
    return (
      <ActivationPhase
        keys={keys}
        walletId={walletId}
        onSuccess={() => {
          capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}KeysSaved`);
          toast.success(t('Solana addresses activated'));
          setPhase('success');
        }}
        onError={() => {
          capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}KeysFailed`);
          toast.error(t('Failed to activate Solana addresses'));
        }}
      />
    );
  }

  if (phase === 'success') {
    return (
      <SuccessPhase
        onClose={() => {
          capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}KeysClosed`);
          onCloseApp();
        }}
      />
    );
  }

  return (
    <ErrorState
      title={t('Unknown error has occurred')}
      description={t('Please restart the process')}
      content={undefined}
      actionLabel={t('Try again')}
      action={() => {
        capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}KeysRetry`);
        setPhase('connect');
      }}
    />
  );
};
