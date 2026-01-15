import { ConnectSolana } from '@/components/ConnectLedger';
import {
  useAccountsContext,
  useAnalyticsContext,
  useWalletContext,
} from '@core/ui';
import { ComponentProps, FC, useMemo } from 'react';
import { ENABLE_SOLANA_LOGGER_KEY_BASE } from '../../../config';

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
      onConnectionSuccess: () =>
        capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}KeysDerived`),
      onConnectionFailed: () =>
        capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}KeysFailed`),
      onConnectionRetry: () =>
        capture(`${ENABLE_SOLANA_LOGGER_KEY_BASE}KeysRetry`),
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
