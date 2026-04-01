import { useEffect, useRef } from 'react';

import { DisplayData } from '@avalabs/vm-module-types';

import { LedgerAppType, useLedgerContext } from '@core/ui';
import { Action } from '@core/types';

import { LedgerApprovalState } from './types';

/**
 * When the Ledger approval UI would show "Wrong app" for C-Chain / Avalanche,
 * Ethereum, Solana, or Bitcoin, try the same programmatic app open used during
 * onboarding so the overlay can reach `pending` and send the signing request.
 */
export function useLedgerApprovalAutoAppSwitch(
  ledgerState: LedgerApprovalState,
  action: Action<DisplayData>,
) {
  const {
    prepareTransportForAvalancheOnboarding,
    prepareTransportForBitcoinOnboarding,
    prepareTransportForEthereumOnboarding,
    prepareTransportForSolanaOnboarding,
  } = useLedgerContext();

  const actionKeyRef = useRef<string | undefined>(undefined);
  const autoOpenAttemptedRef = useRef(false);

  useEffect(() => {
    if (action.id !== actionKeyRef.current) {
      actionKeyRef.current = action.id;
      autoOpenAttemptedRef.current = false;
    }
  }, [action.id]);

  const isIncorrectApp = ledgerState.state === 'incorrect-app';
  const requiredAppForSwitch = isIncorrectApp ? ledgerState.requiredApp : null;

  useEffect(() => {
    if (!isIncorrectApp || !requiredAppForSwitch) {
      autoOpenAttemptedRef.current = false;
      return;
    }
    if (autoOpenAttemptedRef.current) {
      return;
    }

    if (requiredAppForSwitch === LedgerAppType.AVALANCHE) {
      autoOpenAttemptedRef.current = true;
      void prepareTransportForAvalancheOnboarding().catch(() => {
        /* User may fix device manually; avoid log noise */
      });
      return;
    }

    if (requiredAppForSwitch === LedgerAppType.ETHEREUM) {
      autoOpenAttemptedRef.current = true;
      void prepareTransportForEthereumOnboarding().catch(() => {
        /* User may fix device manually; avoid log noise */
      });
      return;
    }

    if (requiredAppForSwitch === LedgerAppType.SOLANA) {
      autoOpenAttemptedRef.current = true;
      void prepareTransportForSolanaOnboarding().catch(() => {
        /* User may fix device manually; avoid log noise */
      });
      return;
    }

    if (requiredAppForSwitch === LedgerAppType.BITCOIN) {
      autoOpenAttemptedRef.current = true;
      void prepareTransportForBitcoinOnboarding().catch(() => {
        /* User may fix device manually; avoid log noise */
      });
    }
  }, [
    isIncorrectApp,
    requiredAppForSwitch,
    prepareTransportForAvalancheOnboarding,
    prepareTransportForBitcoinOnboarding,
    prepareTransportForEthereumOnboarding,
    prepareTransportForSolanaOnboarding,
  ]);
}
