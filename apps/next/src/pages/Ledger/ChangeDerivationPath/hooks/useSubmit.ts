import { DerivedKeys } from '@/components/ConnectLedger/LedgerConnector/types';
import { SecretType, WalletDetails } from '@core/types';
import { useAnalyticsContext, useImportLedger } from '@core/ui';
import { useCallback, useState } from 'react';
import { useWalletRemoval } from './useWalletRemoval';

export type SubmissionState = 'idle' | 'submitting' | 'submitted' | 'error';

export function useSubmit(walletDetails: WalletDetails | undefined) {
  const { capture } = useAnalyticsContext();
  const { importLedger } = useImportLedger();
  const [state, setState] = useState<SubmissionState>('idle');
  const [error, setError] = useState<unknown>(undefined);

  const removeOldWallet = useWalletRemoval();

  const submit = useCallback(
    async (derivedKeys: DerivedKeys) => {
      if (!walletDetails) {
        throw new Error('Wallet details not found');
      }

      const { type, name } = walletDetails;

      try {
        setState('submitting');
        await importLedger({
          name,
          addressPublicKeys: derivedKeys.addressPublicKeys.map(
            ({ key }) => key,
          ),
          extendedPublicKeys: derivedKeys.extendedPublicKeys ?? [],
          secretType:
            type === SecretType.LedgerLive
              ? SecretType.Ledger
              : SecretType.LedgerLive,
        });
        await removeOldWallet(walletDetails.id);
        capture('LedgerChangeDerivationPathSuccess');
        setState('submitted');
      } catch (err) {
        capture('LedgerChangeDerivationPathFailure');
        setState('error');
        setError(err);
      }
    },
    [importLedger, removeOldWallet, capture, walletDetails],
  );

  return { submissionState: state, submit, submissionError: error };
}
