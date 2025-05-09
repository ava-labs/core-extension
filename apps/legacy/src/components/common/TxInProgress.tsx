import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { Overlay } from '@/components/common/Overlay';
import { FireblocksApprovalOverlay } from '@/pages/SignTransaction/components/FireblocksApproval/FireblocksApprovalOverlay';
import { KeystoneApprovalOverlay } from '@/pages/SignTransaction/components/KeystoneApprovalOverlay';
import { LedgerApprovalDialog } from '@/pages/SignTransaction/components/LedgerApprovalDialog';
import { WalletConnectApprovalOverlay } from '@/pages/SignTransaction/components/WalletConnectApproval/WalletConnectApprovalOverlay';
import {
  useIsUsingFireblocksAccount,
  useIsUsingKeystoneWallet,
  useIsUsingLedgerWallet,
  useIsUsingWalletConnectAccount,
} from '@core/ui';

interface TxInProgressProps {
  address?: string;
  fee?: string;
  feeSymbol?: string;
  amount?: string;
  symbol?: string;
  nftName?: string;
  requiredSignatures?: number;
  currentSignature?: number;
  onReject?: () => void;
  onSubmit?: () => Promise<unknown>;
}

export function TxInProgress({
  fee,
  feeSymbol,
  amount,
  symbol,
  address,
  nftName,
  requiredSignatures,
  currentSignature,
  onReject,
  onSubmit,
}: TxInProgressProps) {
  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const isUsingWalletConnectAccount = useIsUsingWalletConnectAccount();
  const isUsingFireblocksAccount = useIsUsingFireblocksAccount();
  const hasRejectCallback = typeof onReject === 'function';
  const hasSubmitCallback = typeof onSubmit === 'function';

  if (isUsingFireblocksAccount) {
    if (hasRejectCallback && hasSubmitCallback) {
      return (
        <FireblocksApprovalOverlay onReject={onReject} onSubmit={onSubmit} />
      );
    }

    throw new Error('Please provide proper onSubmit and onReject callbacks');
  }

  if (isUsingWalletConnectAccount) {
    if (hasRejectCallback && hasSubmitCallback) {
      return (
        <WalletConnectApprovalOverlay
          onReject={onReject}
          onSubmit={onSubmit}
          requiredSignatures={requiredSignatures}
          currentSignature={currentSignature}
        />
      );
    }

    throw new Error('Please provide proper onSubmit and onReject callbacks');
  }

  if (isUsingLedgerWallet) {
    return (
      <Overlay>
        <LedgerApprovalDialog
          address={address}
          fee={fee}
          feeSymbol={feeSymbol}
          amount={amount}
          symbol={symbol}
          nftName={nftName}
          currentSignature={currentSignature}
          requiredSignatures={requiredSignatures}
        />
      </Overlay>
    );
  }

  if (isUsingKeystoneWallet) {
    if (!hasRejectCallback) {
      throw new Error('Please provide a proper onReject callback');
    }

    return <KeystoneApprovalOverlay onReject={onReject} />;
  }

  return <LoadingOverlay />;
}
