import { PromptSolana, Troubleshooting } from '@/components/ConnectLedger';
import { PublicKey } from '@/components/ConnectLedger/LedgerConnector/types';
import { toast } from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
          capture('OnboardingSolanaSupportConfirmed');
          setPhase('connect');
        }}
        onSkip={() => {
          capture('OnboardingSolanaSupportDenied');
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
          capture('OnboardingLedgerTroubleshootingSolana');
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
          capture('OnboardingLedgerTroubleshootingSolanaClosed');
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
          capture('OnboardingLedgerSolanaKeysSaved');
          toast.success(t('Solana addresses activated'));
          setPhase('success');
        }}
        onError={() => {
          capture('OnboardingLedgerSolanaKeysFailed');
          toast.error(t('Failed to activate Solana addresses'));
        }}
      />
    );
  }

  if (phase === 'success') {
    return (
      <SuccessPhase
        onClose={() => {
          capture('OnboardingLedgerSolanaKeysClosed');
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
        capture('OnboardingLedgerSolanaKeysRetry');
        setPhase('connect');
      }}
    />
  );
};
