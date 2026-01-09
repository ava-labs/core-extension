import { ConnectSolana } from '@/components/ConnectLedger';
import {
  useAccountsContext,
  useAnalyticsContext,
  useWalletContext,
} from '@core/ui';
import { ComponentProps, FC, useMemo } from 'react';

type Props = Pick<
  ComponentProps<typeof ConnectSolana>,
  'onNext' | 'onTroubleshoot'
>;

export const ConnectPhase: FC<Props> = ({ onNext, onTroubleshoot }) => {
  const { capture } = useAnalyticsContext();

  const { walletDetails, isLedgerWallet } = useWalletContext();
  const { accounts } = useAccountsContext();

  const numberOfKeys =
    (isLedgerWallet &&
      walletDetails &&
      accounts.primary[walletDetails.id]?.length) ||
    0;

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
      numberOfKeys={numberOfKeys}
      connectorCallbacks={callbacks}
      onNext={onNext}
      onTroubleshoot={onTroubleshoot}
    />
  );
};
