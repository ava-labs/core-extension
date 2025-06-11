import { useCallback, useState } from 'react';

import { useIsUsingLedgerWallet } from './useIsUsingLedgerWallet';
import { useIsUsingKeystoneWallet } from './useIsUsingKeystoneWallet';
import { useIsUsingWalletConnectAccount } from './useIsUsingWalletConnectAccount';
import { useIsUsingFireblocksAccount } from './useIsUsingFireblocksAccount';

type UseApprovalHelpersProps = {
  onApprove: () => Promise<unknown>;
  onReject: () => unknown;
};

export function useApprovalHelpers({
  onApprove,
  onReject,
}: UseApprovalHelpersProps) {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const isUsingWalletConnectAccount = useIsUsingWalletConnectAccount();
  const isUsingFireblocksAccount = useIsUsingFireblocksAccount();

  const isTwoStepApproval =
    isUsingWalletConnectAccount || isUsingFireblocksAccount;
  const isUsingExternalSigner =
    isUsingLedgerWallet ||
    isUsingKeystoneWallet ||
    isUsingWalletConnectAccount ||
    isUsingFireblocksAccount;

  const [isReadyToSign, setIsReadyToSign] = useState(!isTwoStepApproval);
  const [isApprovalOverlayVisible, setIsApprovalOverlayVisible] =
    useState(false);

  const handleApproval = useCallback(async () => {
    setIsApprovalOverlayVisible(isUsingExternalSigner);

    // If it's a two-step approval, do not call `onApprove` yet.
    // Instead, just toggle the isReadyToSign flag so that it's
    // called on a 2nd click.
    if (isTwoStepApproval && !isReadyToSign) {
      setIsReadyToSign(true);
      return;
    }

    // This has to be awaited, otherwise the overlay would disappear immediately.
    await onApprove();
    setIsApprovalOverlayVisible(false);
  }, [isUsingExternalSigner, isTwoStepApproval, isReadyToSign, onApprove]);

  const handleRejection = useCallback(async () => {
    setIsApprovalOverlayVisible(false);

    if (isTwoStepApproval) {
      setIsReadyToSign(false);
    }

    await onReject();
  }, [isTwoStepApproval, onReject]);

  return {
    isApprovalOverlayVisible,
    handleApproval,
    handleRejection,
  };
}
