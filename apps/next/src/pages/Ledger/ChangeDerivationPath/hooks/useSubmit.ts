import { DerivedKeys } from '@/components/ConnectLedger/LedgerConnector/types';
import { SecretType, WalletDetails } from '@core/types';
import { useAnalyticsContext } from '@core/ui';
import { useState } from 'react';
import { useChangeDerivationPath } from './useChangeDerivationPath';
import { useWalletRemoval } from './useWalletRemoval';

export type SubmissionState = 'idle' | 'submitting' | 'submitted' | 'error';

export function useSubmit(walletDetails: WalletDetails | undefined) {
  const { capture } = useAnalyticsContext();
  const [state, setState] = useState<SubmissionState>('idle');
  const [error, setError] = useState<unknown>(undefined);

  const secretType =
    walletDetails?.type === SecretType.LedgerLive
      ? SecretType.Ledger
      : SecretType.LedgerLive;

  const submitPathChange = useChangeDerivationPath(secretType);
  const removeOldWallet = useWalletRemoval();

  const submit = async (derivedKeys: DerivedKeys) => {
    if (!walletDetails) {
      throw new Error('Wallet details not found');
    }

    try {
      setState('submitting');
      await submitPathChange(walletDetails.name, derivedKeys);
      await removeOldWallet(walletDetails.id);
      capture('LedgerChangeDerivationPathSuccess');
      setState('submitted');
    } catch (err) {
      capture('LedgerChangeDerivationPathFailure');
      setState('error');
      setError(err);
    }
  };

  return { submissionState: state, submit, submissionError: error };
}
