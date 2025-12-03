import { ConnectSolana } from '@/components/ConnectLedger';
import { useAnalyticsContext } from '@core/ui';
import { ComponentProps, FC, useMemo } from 'react';

type Props = Pick<
  ComponentProps<typeof ConnectSolana>,
  'onNext' | 'onTroubleshoot'
>;

export const ConnectPhase: FC<Props> = ({ onNext, onTroubleshoot }) => {
  const { capture } = useAnalyticsContext();

  const callbacks = useMemo(
    () => ({
      onConnectionSuccess: () => capture('OnboardingLedgerSolanaKeysDerived'),
      onConnectionFailed: () => capture('OnboardingLedgerSolanaKeysFailed'),
      onConnectionRetry: () => capture('OnboardingLedgerSolanaKeysRetry'),
    }),
    [capture],
  );
  return (
    <ConnectSolana
      connectorCallbacks={callbacks}
      onNext={onNext}
      onTroubleshoot={onTroubleshoot}
    />
  );
};
